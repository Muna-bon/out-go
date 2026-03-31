alter table profiles
add column if not exists email_notifications boolean default true,
add column if not exists push_notifications boolean default true;
