-- Contact Messages Table
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name varchar(100) not null,
  email varchar(255) not null,
  subject varchar(200),
  message text not null,
  status varchar(20) default 'new', -- new, read, replied
  ip_address varchar(45),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.contact_messages enable row level security;

-- Public can insert
create policy "Public can insert contact messages" 
  on public.contact_messages for insert 
  with check (true);

-- Admins can view/update
create policy "Admins can view contact messages" 
  on public.contact_messages for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update contact messages" 
  on public.contact_messages for update 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
