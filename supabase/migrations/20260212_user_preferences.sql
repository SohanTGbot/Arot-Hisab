-- Add user preferences columns
alter table public.users 
add column if not exists phone text,
add column if not exists language_preference text default 'en',
add column if not exists theme_preference text default 'system',
add column if not exists deduction_method text default 'A';
