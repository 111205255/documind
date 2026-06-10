-- Harden trigger functions (Supabase linter: search_path + RPC exposure)

create or replace function public.set_documents_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_chat_threads_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger-only: block direct RPC calls via PostgREST
revoke all on function public.sync_chat_thread_preview() from public;
revoke all on function public.sync_chat_thread_preview() from anon;
revoke all on function public.sync_chat_thread_preview() from authenticated;
