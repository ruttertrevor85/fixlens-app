create extension if not exists pgcrypto;
create table if not exists public.repair_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  photo_url text not null,
  category text not null,
  urgency text not null,
  description text,
  ai_summary text,
  status text not null default 'uploaded',
  created_at timestamptz not null default now()
);
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  repair_request_id uuid not null references public.repair_requests(id) on delete cascade,
  stripe_payment_id text not null,
  amount integer not null,
  status text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  repair_request_id uuid not null references public.repair_requests(id) on delete cascade,
  review_text text not null,
  materials text,
  estimated_cost text,
  created_at timestamptz not null default now()
);
alter table public.repair_requests enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
create policy "service role manages repair_requests" on public.repair_requests for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role manages payments" on public.payments for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role manages reviews" on public.reviews for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
