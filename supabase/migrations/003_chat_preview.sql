-- Denormalized preview for chat thread list (avoids N+1 queries)

alter table public.chat_threads
  add column if not exists last_message_preview text not null default '';

create or replace function public.sync_chat_thread_preview()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_threads
  set
    last_message_preview = left(new.content, 120),
    updated_at = now()
  where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists chat_messages_sync_preview on public.chat_messages;
create trigger chat_messages_sync_preview
  after insert on public.chat_messages
  for each row execute function public.sync_chat_thread_preview();

-- Backfill previews for existing threads
update public.chat_threads t
set last_message_preview = coalesce(
  (
    select left(m.content, 120)
    from public.chat_messages m
    where m.thread_id = t.id
    order by m.created_at desc
    limit 1
  ),
  ''
);
