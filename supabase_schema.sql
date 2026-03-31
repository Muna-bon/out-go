-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  name text,
  email text,
  location text,
  bio text,
  age integer,
  activity_type text,
  preferred_time text,
  pace text,
  interests text[],
  rating numeric default 5.0,
  completed_pairings integer default 0
);

-- Ensure all columns exist inside the table if running migrations dynamically
alter table profiles 
add column if not exists location text,
add column if not exists bio text,
add column if not exists age integer,
add column if not exists activity_type text,
add column if not exists preferred_time text,
add column if not exists pace text,
add column if not exists interests text[],
add column if not exists rating numeric default 5.0,
add column if not exists completed_pairings integer default 0;

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Create events table
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text,
  image_url text,
  location text,
  date text,
  time text,
  capacity integer default 0,
  registered integer default 0,
  price integer default 0,
  organizer text,
  featured boolean default false,
  status text default 'upcoming',
  created_by uuid references profiles(id) on delete cascade
);

alter table events enable row level security;
drop policy if exists "Events are viewable by everyone." on events;
create policy "Events are viewable by everyone." on events for select using (true);
drop policy if exists "Authenticated users can insert events" on events;
create policy "Authenticated users can insert events" on events for insert with check (auth.uid() = created_by);
drop policy if exists "Users can update their own events" on events;
create policy "Users can update their own events" on events for update using (auth.uid() = created_by);
drop policy if exists "Users can delete their own events" on events;
create policy "Users can delete their own events" on events for delete using (auth.uid() = created_by);

-- Create user_events mapping table to track who joined what event
create table if not exists user_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, event_id)
);

alter table user_events enable row level security;
drop policy if exists "Users can see their joined events" on user_events;
create policy "Users can see their joined events" on user_events for select using (auth.uid() = user_id);
drop policy if exists "Users can join events" on user_events;
create policy "Users can join events" on user_events for insert with check (auth.uid() = user_id);
drop policy if exists "Users can leave events" on user_events;
create policy "Users can leave events" on user_events for delete using (auth.uid() = user_id);

-- Create a trigger to automatically create a profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, location)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'location');
  
  insert into public.notifications (user_id, type, title, message, link)
  values (new.id, 'system', 'Welcome to OutGo!', 'Complete your profile to get personalized recommendations.', '/settings');
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RPC functions to safely increment/decrement registered counts
create or replace function public.increment_event_registered(row_id uuid)
returns void as $$
begin
  update public.events set registered = registered + 1 where id = row_id;
end;
$$ language plpgsql security definer;

create or replace function public.decrement_event_registered(row_id uuid)
returns void as $$
begin
  update public.events set registered = greatest(0, registered - 1) where id = row_id;
end;
$$ language plpgsql security definer;

-- RPC function to allow a user to completely delete their account and auth record
-- This will cascade and delete their profile, events, etc.
create or replace function public.delete_user()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;

-- Create notifications table
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  link text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table notifications enable row level security;
drop policy if exists "Users can access their own notifications" on notifications;
create policy "Users can access their own notifications" on notifications for select using (auth.uid() = user_id);
drop policy if exists "Users can update their own notifications" on notifications;
create policy "Users can update their own notifications" on notifications for update using (auth.uid() = user_id);
drop policy if exists "System can insert notifications" on notifications;
create policy "System can insert notifications" on notifications for insert with check (true);


-- Trigger to send a notification to all users when a new event is created
create or replace function public.create_new_event_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, title, message, link)
  select id, 'activity', 'New Activity Near You', 'A new event: ' || new.title || ' has been created.', '/events/' || new.id
  from public.profiles where id != new.created_by;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_event_created on public.events;
create trigger on_event_created
  after insert on public.events
  for each row execute procedure public.create_new_event_notification();

-- Trigger to notify event creator when someone joins
create or replace function public.create_joined_event_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, title, message, link)
  select events.created_by, 'pairing', 'New Event Participant',
         (select name from public.profiles where id = new.user_id) || ' joined your event: ' || events.title,
         '/events/' || new.event_id
  from public.events 
  where id = new.event_id and events.created_by != new.user_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_event_joined on public.user_events;
create trigger on_event_joined
  after insert on public.user_events
  for each row execute procedure public.create_joined_event_notification();


-- Create pairing_requests table
create table if not exists pairing_requests (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  status text default 'pending',
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table pairing_requests enable row level security;
drop policy if exists "Senders can insert and read requests" on pairing_requests;
create policy "Senders can insert and read requests" on pairing_requests for all using (auth.uid() = sender_id);
drop policy if exists "Receivers can read and update requests" on pairing_requests;
create policy "Receivers can read and update requests" on pairing_requests for all using (auth.uid() = receiver_id);

-- Trigger to notify receiver
create or replace function public.create_pairing_request_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, title, message, link)
  values (
    new.receiver_id, 
    'pairing', 
    'New Pairing Request', 
    (select coalesce(name, 'Someone') from public.profiles where id = new.sender_id) || ' sent you a pairing request.', 
    '/my-pairings'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_pairing_request on public.pairing_requests;
create trigger on_pairing_request
  after insert on public.pairing_requests
  for each row execute procedure public.create_pairing_request_notification();
alter table profiles
add column if not exists email_notifications boolean default true,
add column if not exists push_notifications boolean default true,
add column if not exists avatar_url text;
