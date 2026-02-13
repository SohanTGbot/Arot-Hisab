-- Audit Logs Table
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  action varchar(50) not null, -- e.g., 'user_ban', 'update_settings'
  resource_type varchar(50) not null, -- e.g., 'user', 'settings', 'feedback'
  resource_id varchar(100), -- ID of the affected resource
  details jsonb, -- Previous and new values
  ip_address varchar(45),
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for Audit Logs
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- RLS for Audit Logs
alter table public.audit_logs enable row level security;

-- Only Admins can view audit logs
create policy "Admins can view audit logs" 
  on public.audit_logs for select 
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Only System/Admins can insert (via server actions)
create policy "Admins can insert audit logs" 
  on public.audit_logs for insert 
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
