-- Create attendance table
create table if not exists attendance (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  service_type text not null check (service_type in ('Sunday Service', 'FTN Bible Study', 'Prayer Meeting')),
  center_id uuid references centers(id) not null,
  adult_male integer default 0,
  adult_female integer default 0,
  child_male integer default 0,
  child_female integer default 0
);

-- Enable RLS
alter table attendance enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on attendance
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on attendance
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on attendance
  for update using (auth.role() = 'authenticated');
