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
