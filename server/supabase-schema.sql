create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key default ('prod_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 9)),
  title text not null,
  description text not null default '',
  category text not null check (category in ('Websites', 'Robotic Projects', 'IoT Projects', 'UI/UX Design')),
  price numeric(12, 2) not null default 0 check (price >= 0),
  thumbnail text not null default '/placeholder.svg',
  options text[] not null default array['purchase', 'customise'],
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.orders (
  id text primary key default ('ord_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 9)),
  product_id text references public.products(id) on delete set null,
  product_title text not null,
  price numeric(12, 2) not null default 0 check (price >= 0),
  option text not null check (option in ('purchase', 'customise')),
  billing_address jsonb not null default '{}'::jsonb,
  contact jsonb,
  customisation jsonb,
  payment_method text not null check (payment_method in ('Gpay', 'Paytm')),
  status text not null default 'paid' check (status in ('pending', 'processing', 'shipped', 'completed', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.service_orders (
  id text primary key default ('svc_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 9)),
  type text not null check (type in ('3d-printing', 'contact')),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  details text,
  material text,
  color text,
  infill integer check (infill is null or (infill >= 0 and infill <= 100)),
  extra_info text,
  hear_about text,
  model_file text,
  model_filename text,
  timeline text,
  source text,
  status text not null default 'new' check (status in ('new', 'in-progress', 'completed', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

insert into public.settings (key, value)
values (
  '3dprint-colors',
  '{
    "PLA+": ["White", "Black", "Red", "Blue", "Green", "Yellow", "Orange", "Grey"],
    "PETG": ["Clear", "Black", "White", "Blue", "Red"],
    "TPU": ["Black", "White", "Blue", "Red", "Green"]
  }'::jsonb
)
on conflict (key) do nothing;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists service_orders_set_updated_at on public.service_orders;
create trigger service_orders_set_updated_at
before update on public.service_orders
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.service_orders enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Server service role access products" on public.products;
create policy "Server service role access products"
on public.products for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Server service role access orders" on public.orders;
create policy "Server service role access orders"
on public.orders for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Server service role access service orders" on public.service_orders;
create policy "Server service role access service orders"
on public.service_orders for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Server service role access settings" on public.settings;
create policy "Server service role access settings"
on public.settings for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
