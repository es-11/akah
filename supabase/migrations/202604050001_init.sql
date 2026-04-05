create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric not null,
  category text not null,
  image text,
  created_at timestamptz not null default now()
);

create index if not exists idx_menu_items_category on public.menu_items(category);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  car_name text,
  car_type text,
  car_plate text,
  notes text,
  total_price numeric not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders(created_at desc);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id uuid references public.menu_items(id),
  name text not null,
  price numeric not null,
  quantity int not null
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "menu read" on public.menu_items;
create policy "menu read" on public.menu_items for select using (true);

drop policy if exists "orders read" on public.orders;
create policy "orders read" on public.orders for select using (true);

drop policy if exists "orders insert" on public.orders;
create policy "orders insert" on public.orders for insert with check (true);

drop policy if exists "order_items read" on public.order_items;
create policy "order_items read" on public.order_items for select using (true);

drop policy if exists "order_items insert" on public.order_items;
create policy "order_items insert" on public.order_items for insert with check (true);
