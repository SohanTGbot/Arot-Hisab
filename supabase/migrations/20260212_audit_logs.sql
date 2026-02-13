-- Audit Logs Table
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  action varchar(50) not null,
  resource_type varchar(50) not null,
  resource_id varchar(100),
  details jsonb,
  ip_address varchar(50),
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_audit_logs_user_id on public.audit_logs(user_id);
create index idx_audit_logs_action on public.audit_logs(action);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- RLS
alter table public.audit_logs enable row level security;

-- Only admins can view audit logs
create policy "Admins can view audit logs" 
  on public.audit_logs for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Only admins/system can insert audit logs (handled by service role in actions if needed, or RLS)
-- Since we use server actions with authenticated user, we allow insert if user is admin OR if we implement a function.
-- For now, let's allow authenticated users to insert if they perform an action, OR restrict to admin.
-- Ideally, actions that trigger logs are done by admins.
create policy "Admins can insert audit logs" 
  on public.audit_logs for insert 
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
