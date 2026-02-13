-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- User Table (Extends Supabase Auth users)
create table public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email varchar(255) unique,
  phone varchar(15) unique,
  full_name varchar(100) not null,
  language_preference varchar(2) default 'bn',
  theme_preference varchar(10) default 'light',
  font_size varchar(10) default 'medium',
  deduction_method varchar(1) default 'A',
  is_active boolean default true,
  last_login timestamp with time zone,
  email_verified boolean default false,
  phone_verified boolean default false,
  role varchar(20) default 'user' check (role in ('user', 'admin', 'support'))
);

-- RLS for Users
alter table public.users enable row level security;

create policy "Users can view own profile" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.users for update 
  using (auth.uid() = id);

-- Transactions Table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  seller_name varchar(100),
  gross_weight_kg numeric(10,3) not null,
  net_weight_kg numeric(10,3) not null,
  deduction_method varchar(1) not null check (deduction_method in ('A', 'B')),
  rate_per_kg numeric(10,2) not null,
  base_amount numeric(12,2) not null,
  commission_percent numeric(5,2) default 2.00,
  final_amount numeric(12,2) not null,
  buyer_name varchar(100),
  buyer_address text,
  notes text,
  is_deleted boolean default false
);

-- Indexes for Transactions
create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_created_at on public.transactions(created_at desc);
create index idx_transactions_seller on public.transactions(seller_name);
create index idx_transactions_buyer on public.transactions(buyer_name);

-- RLS for Transactions
alter table public.transactions enable row level security;

create policy "Users can view own transactions" 
  on public.transactions for select 
  using (auth.uid() = user_id);

create policy "Users can create own transactions" 
  on public.transactions for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own transactions" 
  on public.transactions for update 
  using (auth.uid() = user_id);

create policy "Users can delete own transactions (soft delete)" 
  on public.transactions for update 
  using (auth.uid() = user_id); -- Implement soft delete via update is_deleted=true

-- Saved Contacts Table
create table public.saved_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  contact_type varchar(10) not null check (contact_type in ('seller', 'buyer')),
  name varchar(100) not null,
  address text,
  phone varchar(15),
  notes text
);

-- Indexes for Saved Contacts
create index idx_contacts_user_id on public.saved_contacts(user_id);
create index idx_contacts_name on public.saved_contacts(name);

-- RLS for Saved Contacts
alter table public.saved_contacts enable row level security;

create policy "Users can view own contacts" 
  on public.saved_contacts for select 
  using (auth.uid() = user_id);

create policy "Users can manage own contacts" 
  on public.saved_contacts for all 
  using (auth.uid() = user_id);

-- Daily Summaries Table
create table public.daily_summaries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  date date not null,
  total_transactions integer default 0,
  total_gross_weight numeric(12,3) default 0,
  total_net_weight numeric(12,3) default 0,
  total_base_amount numeric(15,2) default 0,
  total_commission numeric(15,2) default 0,
  total_final_amount numeric(15,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Indexes for Daily Summaries
create index idx_summaries_user_date on public.daily_summaries(user_id, date desc);

-- RLS for Daily Summaries
alter table public.daily_summaries enable row level security;

create policy "Users can view own summaries" 
  on public.daily_summaries for select 
  using (auth.uid() = user_id);

-- Donations Table
create table public.donations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric(10,2) not null,
  payment_method varchar(50),
  transaction_id varchar(100),
  status varchar(20) default 'pending' check (status in ('pending', 'completed', 'failed')),
  message text
);

-- Indexes for Donations
create index idx_donations_user_id on public.donations(user_id);
create index idx_donations_created_at on public.donations(created_at desc);

-- RLS for Donations
alter table public.donations enable row level security;

create policy "Users can view own donations" 
  on public.donations for select 
  using (auth.uid() = user_id);

create policy "Users can create donation records" 
  on public.donations for insert 
  with check (auth.uid() = user_id);

-- Feedback Table
create table public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type varchar(20) not null check (type in ('bug', 'feature', 'support', 'other')),
  subject varchar(200) not null,
  description text not null,
  status varchar(20) default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority varchar(10) default 'medium' check (priority in ('low', 'medium', 'high')),
  admin_notes text
);

-- Indexes for Feedback
create index idx_feedback_user_id on public.feedback(user_id);
create index idx_feedback_status on public.feedback(status);

-- RLS for Feedback
alter table public.feedback enable row level security;

create policy "Users can view own feedback" 
  on public.feedback for select 
  using (auth.uid() = user_id);

create policy "Users can submit feedback" 
  on public.feedback for insert 
  with check (auth.uid() = user_id);

-- Settings Table (Global/System)
create table public.settings (
  id uuid default uuid_generate_v4() primary key,
  key varchar(100) unique not null,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Settings
alter table public.settings enable row level security;

create policy "Everyone can view settings" 
  on public.settings for select 
  using (true);

-- Admin Policies (Using checking role in users table)
-- Note: This assumes a secure way to set roles. Initial role setting might need direct SQL or Edge Function.

create policy "Admins can view all users" 
  on public.users for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update all users" 
  on public.users for update 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can view all transactions" 
  on public.transactions for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can view all feedback" 
  on public.feedback for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update feedback" 
  on public.feedback for update 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can manage settings" 
  on public.settings for all 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Function to handle new user creation trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for transactions updated_at
create trigger on_transactions_updated
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();
