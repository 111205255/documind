-- DocuMind Step 5: chat threads + messages

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_threads_user_updated_idx
  on public.chat_threads (user_id, updated_at desc);

create index if not exists chat_threads_document_idx
  on public.chat_threads (document_id);

alter table public.chat_threads enable row level security;

create policy "Users read own chat threads"
  on public.chat_threads for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own chat threads"
  on public.chat_threads for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own chat threads"
  on public.chat_threads for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own chat threads"
  on public.chat_threads for delete
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_thread_created_idx
  on public.chat_messages (thread_id, created_at asc);

alter table public.chat_messages enable row level security;

create policy "Users read own chat messages"
  on public.chat_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );

create policy "Users insert own chat messages"
  on public.chat_messages for insert
  to authenticated
  with check (
    exists (
      select 1 from public.chat_threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );

create or replace function public.set_chat_threads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists chat_threads_updated_at on public.chat_threads;
create trigger chat_threads_updated_at
  before update on public.chat_threads
  for each row execute function public.set_chat_threads_updated_at();
