-- © Janus — yashxsanjay
-- pgTAP tests for profiles RLS policies
-- Run with: supabase test db

begin;
select plan(10);

-- Setup: create two test users
select tests.create_supabase_user('alice@test.com', 'alice');
select tests.create_supabase_user('bob@test.com', 'bob');

-- Insert alice's profile as alice
select tests.authenticate_as('alice@test.com');

insert into public.profiles (user_id, type, handle, display_name)
values (tests.get_supabase_uid('alice@test.com'), 'builder', 'alice_j', 'Alice');

-- 1. Alice can read her own profile
select results_eq(
  $$ select count(*)::int from public.profiles where handle = 'alice_j' $$,
  $$ values (1) $$,
  'alice can read her own profile'
);

-- 2. Bob can also read alice's profile (public)
select tests.authenticate_as('bob@test.com');

select results_eq(
  $$ select count(*)::int from public.profiles where handle = 'alice_j' $$,
  $$ values (1) $$,
  'bob can read alice''s profile (public)'
);

-- 3. Bob cannot insert a profile with alice's user_id
select throws_ok(
  $$ insert into public.profiles (user_id, type, handle, display_name)
     values (tests.get_supabase_uid('alice@test.com'), 'builder', 'bob_impersonating_alice', 'Hacker') $$,
  'new row violates row-level security policy for table "profiles"',
  'bob cannot insert a profile for alice'
);

-- 4. Bob can insert his own profile
insert into public.profiles (user_id, type, handle, display_name)
values (tests.get_supabase_uid('bob@test.com'), 'builder', 'bob_j', 'Bob');

select results_eq(
  $$ select count(*)::int from public.profiles where handle = 'bob_j' $$,
  $$ values (1) $$,
  'bob can insert his own profile'
);

-- 5. Bob cannot update alice's profile
select throws_ok(
  $$ update public.profiles set display_name = 'Hacked' where handle = 'alice_j' $$,
  null,
  'bob cannot update alice''s profile'
);

-- 6. Alice's display name unchanged
select tests.authenticate_as('alice@test.com');

select results_eq(
  $$ select display_name from public.profiles where handle = 'alice_j' $$,
  $$ values ('Alice') $$,
  'alice''s display_name was not changed by bob'
);

-- 7. Alice can update her own profile
update public.profiles set bio = 'Building cool things' where handle = 'alice_j';

select results_eq(
  $$ select bio from public.profiles where handle = 'alice_j' $$,
  $$ values ('Building cool things') $$,
  'alice can update her own bio'
);

-- 8. Alice cannot delete bob's profile
select throws_ok(
  $$ delete from public.profiles where handle = 'bob_j' $$,
  null,
  'alice cannot delete bob''s profile'
);

-- 9. Bob's profile still exists
select results_eq(
  $$ select count(*)::int from public.profiles where handle = 'bob_j' $$,
  $$ values (1) $$,
  'bob''s profile still exists after alice''s delete attempt'
);

-- 10. Unauthenticated user can read profiles (public)
select tests.clear_authentication();

select results_eq(
  $$ select count(*)::int from public.profiles $$,
  $$ values (2) $$,
  'unauthenticated user can read all profiles'
);

select * from finish();
rollback;
