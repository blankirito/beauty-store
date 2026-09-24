alter table public.profiles
add column if not exists phone text;

alter table public.profiles
add constraint profiles_phone_not_blank
check (phone is null or char_length(btrim(phone)) > 0);