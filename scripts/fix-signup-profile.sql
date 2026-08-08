-- Fix: new sign-ups never get a public.users row.
--
-- Why this is needed
-- ------------------
-- Email confirmation is enabled on this project (auth settings report
-- mailer_autoconfirm = false), so supabase.auth.signUp() returns a user but
-- NO session. The client then tries to insert the profile row into
-- public.users while still unauthenticated, and row level security rejects it:
--
--   HTTP 401  42501  new row violates row-level security policy for table "users"
--
-- The client only console.error()s that failure, so registration appears to
-- succeed while leaving no profile row behind. public.users currently has 0
-- rows. Because orders.buyer_id references public.users(id), checkout would
-- fail with a foreign key violation even after the user confirms and signs in.
--
-- The fix is to create the profile row server-side, from a trigger on
-- auth.users, which runs with definer rights and is not subject to RLS.
-- Run this in the Supabase SQL editor.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, first_name, last_name, phone, account_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(
      (new.raw_user_meta_data ->> 'account_type')::account_type_enum,
      'buyer'::account_type_enum
    )
  )
  on conflict (id) do nothing;

  -- Give every account a settings row so the Settings page has something to
  -- update rather than needing to guess whether to insert or update.
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

-- Backfill any accounts that registered before this trigger existed.
insert into public.users (id, email, first_name, last_name, phone, account_type)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'first_name', ''),
  coalesce(u.raw_user_meta_data ->> 'last_name', ''),
  nullif(u.raw_user_meta_data ->> 'phone', ''),
  coalesce(
    (u.raw_user_meta_data ->> 'account_type')::account_type_enum,
    'buyer'::account_type_enum
  )
from auth.users u
on conflict (id) do nothing;

insert into public.user_settings (user_id)
select id from auth.users
on conflict (user_id) do nothing;
