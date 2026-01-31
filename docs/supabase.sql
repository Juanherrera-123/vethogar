-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Roles enum
create type public.user_role as enum ('admin', 'vet', 'clinic', 'client');

-- Verification status enum
create type public.verification_status as enum ('pending', 'approved', 'rejected');

-- Base profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Vet profile
create table if not exists public.vet_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  sex text,
  age int,
  phone text,
  city text not null,
  address text,
  about text,
  professional_card_number text,
  specialties text[] not null default '{}',
  consultation_cost text,
  hours text,
  experience text,
  university text,
  languages text,
  awards text,
  publications text,
  social_links text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clinic profile
create table if not exists public.clinic_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  clinic_name text not null,
  professionals_count int,
  city text not null,
  address text,
  first_name text not null,
  last_name text not null,
  sex text,
  age int,
  phone text,
  role text,
  about text,
  consultation_cost text,
  hours text,
  services text[] not null default '{}',
  other_service text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Client profile
create table if not exists public.client_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Verification requests
create table if not exists public.verification_requests (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  status public.verification_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger vet_profiles_set_updated_at before update on public.vet_profiles
for each row execute function public.set_updated_at();

create trigger clinic_profiles_set_updated_at before update on public.clinic_profiles
for each row execute function public.set_updated_at();

create trigger client_profiles_set_updated_at before update on public.client_profiles
for each row execute function public.set_updated_at();

create trigger verification_requests_set_updated_at before update on public.verification_requests
for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.vet_profiles enable row level security;
alter table public.clinic_profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.verification_requests enable row level security;

-- Policies
create policy "Profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

create policy "Vet profiles are readable by owner" on public.vet_profiles
  for select using (auth.uid() = id);

create policy "Vet profiles are insertable by owner" on public.vet_profiles
  for insert with check (auth.uid() = id);

create policy "Vet profiles are updatable by owner" on public.vet_profiles
  for update using (auth.uid() = id);

create policy "Clinic profiles are readable by owner" on public.clinic_profiles
  for select using (auth.uid() = id);

create policy "Clinic profiles are insertable by owner" on public.clinic_profiles
  for insert with check (auth.uid() = id);

create policy "Clinic profiles are updatable by owner" on public.clinic_profiles
  for update using (auth.uid() = id);

create policy "Client profiles are readable by owner" on public.client_profiles
  for select using (auth.uid() = id);

create policy "Client profiles are insertable by owner" on public.client_profiles
  for insert with check (auth.uid() = id);

create policy "Client profiles are updatable by owner" on public.client_profiles
  for update using (auth.uid() = id);

create policy "Verification requests readable by owner" on public.verification_requests
  for select using (auth.uid() = profile_id);

create policy "Verification requests insertable by owner" on public.verification_requests
  for insert with check (auth.uid() = profile_id);

-- Admin access via service role or custom claims should be added separately
