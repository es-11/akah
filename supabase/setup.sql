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

insert into public.menu_items (id, name, description, price, category, image)
values
  ('00000000-0000-0000-0000-000000000001', 'برجر سنقل لحم (Single Beef Burger)', 'شريحة لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.', 10, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000002', 'برجر دبل لحم (Double Beef Burger)', 'شريحتين لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.', 15, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000003', 'برجر تربل لحم (Triple Beef Burger)', 'ثلاث شرائح لحم بقري مع جبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.', 20, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000004', 'مقلوب سنقل لحم (Upside-Down Single Beef Burger)', 'شريحة لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص بطريقة مقلوبة.', 15, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000005', 'مقلوب دبل لحم (Upside-Down Double Beef Burger)', 'شريحتين لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص بطريقة مقلوبة.', 17, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000006', 'فلات بيف برجر (Flat Beef Burger)', 'شريحتين لحم بقري مع جبنة وصوص خاص تقدم على خبز البطاطس المحمص.', 17, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000007', 'برجر مكس لحم ودجاج (Beef & Chicken Mix Burger)', 'شريحة لحم بقري مع دجاج وجبنة وخس وصوص خاص تقدم على خبز البطاطس المحمص.', 15, 'Beef Burgers', null),
  ('00000000-0000-0000-0000-000000000008', 'برجر سنقل دجاج مشوي (Single Grilled Chicken Burger)', 'صدر دجاج مشوي مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.', 13, 'Chicken Burgers', null),
  ('00000000-0000-0000-0000-000000000009', 'برجر دبل دجاج مشوي (Double Grilled Chicken Burger)', 'قطعتين صدر دجاج مشوي مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.', 15, 'Chicken Burgers', null),
  ('00000000-0000-0000-0000-000000000010', 'برجر سنقل دجاج كرسبي (Crispy Fried Chicken Burger)', 'صدر دجاج مقرمش مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.', 13, 'Chicken Burgers', null),
  ('00000000-0000-0000-0000-000000000011', 'برجر دبل دجاج كرسبي (Crispy Double Fried Chicken Burger)', 'قطعتين دجاج مقرمش مع جبنة وخس وصوص خاص يقدم على خبز البطاطس المحمص.', 15, 'Chicken Burgers', null),
  ('00000000-0000-0000-0000-000000000012', 'كلوب دجاج ساندويتش (Club Chicken Sandwich)', 'ساندويتش من خبز التوست المحمص مع دجاج كرسبي وخس وصوص ويقدم مع بطاطس.', 13, 'Sandwiches', null),
  ('00000000-0000-0000-0000-000000000013', 'كلوب لحم ساندويتش (Club Beef Sandwich)', 'ساندويتش من خبز التوست المحمص مع اللحم وصوص خاص ويقدم مع بطاطس.', 13, 'Sandwiches', null),
  ('00000000-0000-0000-0000-000000000014', 'إندومي دجاج بالكريمة', 'خليط من الإندومي مع نكهة الكريمة والدجاج والخضار.', 10, 'Indomie', null),
  ('00000000-0000-0000-0000-000000000015', 'إندومي دجاج صويا', 'خليط من الإندومي مع نكهة الصويا.', 10, 'Indomie', null),
  ('00000000-0000-0000-0000-000000000016', 'إندومي شيتوس', 'خليط من الإندومي مع شيبس الشيتوس الحار.', 10, 'Indomie', null),
  ('00000000-0000-0000-0000-000000000017', 'إندومي دجاج سبايسي', 'خليط من الإندومي مع نكهة الكريمة والدجاج والخضار الحارة.', 10, 'Indomie', null),
  ('00000000-0000-0000-0000-000000000018', 'بطاطس مقلية', 'بطاطس بلجيكية مقلية مقرمشة.', 3, 'Fries', null),
  ('00000000-0000-0000-0000-000000000019', 'تشيكن فرايز', 'بطاطس مقلية مع قطع دجاج مقرمش مع مزيج من الصوصات.', 10, 'Fries', null),
  ('00000000-0000-0000-0000-000000000020', 'مكعبات بطاطس', 'مكعبات بطاطس بلجيكية مقلية مقرمشة مع الصوصات.', 10, 'Fries', null),
  ('00000000-0000-0000-0000-000000000021', 'كلوب تشيكن ساندويتش (وجبة أطفال)', 'ساندويتش توست مع دجاج كرسبي وخس وصوص مع بطاطس ومشروب أطفال.', 14, 'Kids Meals', null),
  ('00000000-0000-0000-0000-000000000022', 'تشيكن ناجيت', 'قطع دجاج ناجيت مع بطاطس ومشروب أطفال.', 10, 'Kids Meals', null)
on conflict (id) do nothing;

do $$
begin
  begin
    alter publication supabase_realtime add table public.orders;
  exception
    when duplicate_object then
      null;
  end;
end $$;
