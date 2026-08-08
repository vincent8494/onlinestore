-- VMK Store — Full Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/bzeptsuqpjtgrekinoro/sql

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── ENUMS ───────────────────────────────────────────────────────────────────

do $$ begin create type account_type_enum as enum ('buyer', 'seller'); exception when duplicate_object then null; end $$;
do $$ begin create type product_status_enum as enum ('active', 'pending', 'out_of_stock', 'draft', 'archived'); exception when duplicate_object then null; end $$;
do $$ begin create type order_status_enum as enum ('processing', 'shipped', 'delivered', 'cancelled', 'refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type payment_status_enum as enum ('pending', 'paid', 'failed', 'refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type payment_method_enum as enum ('card', 'paypal', 'google_pay', 'apple_pay'); exception when duplicate_object then null; end $$;
do $$ begin create type theme_enum as enum ('light', 'dark', 'auto'); exception when duplicate_object then null; end $$;

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── TABLES ──────────────────────────────────────────────────────────────────

-- 1. users (extends Supabase auth.users via trigger)
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  first_name    text not null default '',
  last_name     text not null default '',
  phone         text,
  account_type  account_type_enum not null default 'buyer',
  avatar_url    text,
  is_verified   boolean not null default false,
  marketing_opt_in boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
  for each row execute function set_updated_at();

-- User profile rows are created client-side after signUp() succeeds.
-- No trigger needed — avoids 500 errors from server-side trigger failures.

-- 2. user_settings
create table if not exists public.user_settings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid unique not null references public.users(id) on delete cascade,
  email_notifications   boolean not null default true,
  push_notifications    boolean not null default false,
  sms_notifications     boolean not null default false,
  marketing_emails      boolean not null default true,
  theme                 theme_enum not null default 'auto',
  language              text not null default 'en',
  updated_at            timestamptz not null default now()
);

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at before update on public.user_settings
  for each row execute function set_updated_at();

-- 3. seller_profiles
create table if not exists public.seller_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique not null references public.users(id) on delete cascade,
  store_name   text not null,
  store_slug   text unique not null,
  bio          text,
  location     text,
  avatar_url   text,
  is_verified  boolean not null default false,
  total_sales  numeric(12,2) not null default 0,
  store_views  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists seller_profiles_updated_at on public.seller_profiles;
create trigger seller_profiles_updated_at before update on public.seller_profiles
  for each row execute function set_updated_at();

-- 4. categories
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text unique not null,
  slug       text unique not null,
  icon       text,
  parent_id  uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 5. products
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  seller_id       uuid not null references public.users(id) on delete cascade,
  category_id     uuid references public.categories(id) on delete set null,
  name            text not null,
  description     text,
  price           numeric(10,2) not null check (price >= 0),
  original_price  numeric(10,2),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  status          product_status_enum not null default 'draft',
  average_rating  numeric(3,2) not null default 0,
  review_count    integer not null default 0,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_products_seller_id on public.products (seller_id);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_created_at_desc on public.products (created_at desc);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function set_updated_at();

-- 6. product_images
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  image_url     text not null,
  is_primary    boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_product_images_product_id on public.product_images (product_id);

-- 7. product_features
create table if not exists public.product_features (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  feature       text not null,
  display_order integer not null default 0
);

create index if not exists idx_product_features_product_id on public.product_features (product_id);

-- 8. reviews
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists idx_reviews_product_id on public.reviews (product_id);

drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at before update on public.reviews
  for each row execute function set_updated_at();

-- Recalculate product rating after review changes
create or replace function sync_product_rating()
returns trigger language plpgsql as $$
declare
  pid uuid;
begin
  pid := coalesce(new.product_id, old.product_id);
  update public.products
  set
    average_rating = coalesce((select avg(rating) from public.reviews where product_id = pid), 0),
    review_count   = (select count(*) from public.reviews where product_id = pid)
  where id = pid;
  return null;
end;
$$;

drop trigger if exists after_review_change on public.reviews;
create trigger after_review_change
  after insert or update or delete on public.reviews
  for each row execute function sync_product_rating();

-- 9. carts
create table if not exists public.carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists carts_updated_at on public.carts;
create trigger carts_updated_at before update on public.carts
  for each row execute function set_updated_at();

-- 10. cart_items
create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   integer not null default 1 check (quantity > 0),
  added_at   timestamptz not null default now(),
  unique (cart_id, product_id)
);

create index if not exists idx_cart_items_cart_id on public.cart_items (cart_id);

-- 11. wishlists
create table if not exists public.wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 12. wishlist_items
create table if not exists public.wishlist_items (
  id          uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  added_at    timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

create index if not exists idx_wishlist_items_wishlist_id on public.wishlist_items (wishlist_id);

-- 13. addresses
create table if not exists public.addresses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  address_line1 text not null,
  address_line2 text,
  city          text not null,
  postal_code   text not null,
  country       text not null default 'US',
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_addresses_user_id on public.addresses (user_id);

-- 14. orders
create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  buyer_id             uuid not null references public.users(id) on delete restrict,
  status               order_status_enum not null default 'processing',
  subtotal             numeric(10,2) not null,
  shipping_cost        numeric(10,2) not null default 0,
  tax                  numeric(10,2) not null default 0,
  total                numeric(10,2) not null,
  shipping_email       text not null,
  shipping_first_name  text not null,
  shipping_last_name   text not null,
  shipping_address     text not null,
  shipping_city        text not null,
  shipping_postal_code text not null,
  shipping_country     text not null default 'US',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_orders_buyer_id on public.orders (buyer_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at_desc on public.orders (created_at desc);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function set_updated_at();

-- 15. order_items
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  seller_id    uuid references public.users(id) on delete set null,
  product_name text not null,
  unit_price   numeric(10,2) not null,
  quantity     integer not null check (quantity > 0),
  line_total   numeric(10,2) generated always as (unit_price * quantity) stored
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

-- 16. payments
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid unique not null references public.orders(id) on delete cascade,
  amount         numeric(10,2) not null,
  status         payment_status_enum not null default 'pending',
  payment_method payment_method_enum not null default 'card',
  card_last_four char(4),
  transaction_id text,
  paid_at        timestamptz,
  created_at     timestamptz not null default now()
);

-- 17. seller_follows
create table if not exists public.seller_follows (
  id          uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.users(id) on delete cascade,
  seller_id   uuid not null references public.users(id) on delete cascade,
  followed_at timestamptz not null default now(),
  unique (follower_id, seller_id),
  check (follower_id <> seller_id)
);

create index if not exists idx_seller_follows_follower_id on public.seller_follows (follower_id);
create index if not exists idx_seller_follows_seller_id on public.seller_follows (seller_id);

-- 18. deals / promotions
create table if not exists public.deals (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  discount_percent numeric(5,2) not null check (discount_percent between 0 and 100),
  starts_at        timestamptz not null,
  ends_at          timestamptz not null,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists idx_deals_product_id on public.deals (product_id);
create index if not exists idx_deals_is_active__starts_at__ends_at on public.deals (is_active, starts_at, ends_at);

-- ─── SEED: CATEGORIES ────────────────────────────────────────────────────────

insert into public.categories (name, slug, icon) values
  ('Electronics',           'electronics',          'Smartphone'),
  ('Fashion',               'fashion',              'Shirt'),
  ('Home & Garden',         'home-garden',          'Home'),
  ('Sports & Outdoors',     'sports-outdoors',      'Dumbbell'),
  ('Books & Media',         'books-media',          'BookOpen'),
  ('Automotive',            'automotive',           'Car'),
  ('Beauty & Personal Care','beauty-personal-care', 'Sparkles'),
  ('Grocery',               'grocery',              'ShoppingBasket')
on conflict (slug) do nothing;

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

alter table public.users enable row level security;
alter table public.user_settings enable row level security;
alter table public.seller_profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_features enable row level security;
alter table public.reviews enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.seller_follows enable row level security;
alter table public.deals enable row level security;
alter table public.categories enable row level security;

-- Users: insert/read/update own row only
drop policy if exists "users: insert own" on public.users;
create policy "users: insert own" on public.users for insert with check (auth.uid() = id);
drop policy if exists "users: read own" on public.users;
create policy "users: read own" on public.users for select using (auth.uid() = id);
drop policy if exists "users: update own" on public.users;
create policy "users: update own" on public.users for update using (auth.uid() = id);

-- User settings
drop policy if exists "user_settings: own" on public.user_settings;
create policy "user_settings: own" on public.user_settings for all using (auth.uid() = user_id);

-- Seller profiles: anyone can read, only owner can write
drop policy if exists "seller_profiles: public read" on public.seller_profiles;
create policy "seller_profiles: public read" on public.seller_profiles for select using (true);
drop policy if exists "seller_profiles: owner write" on public.seller_profiles;
create policy "seller_profiles: owner write" on public.seller_profiles for all using (auth.uid() = user_id);

-- Categories: public read only
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories for select using (true);

-- Products: public read active, seller manages own
drop policy if exists "products: public read" on public.products;
create policy "products: public read" on public.products for select using (status = 'active' or auth.uid() = seller_id);
drop policy if exists "products: seller insert" on public.products;
create policy "products: seller insert" on public.products for insert with check (auth.uid() = seller_id);
drop policy if exists "products: seller update" on public.products;
create policy "products: seller update" on public.products for update using (auth.uid() = seller_id);
drop policy if exists "products: seller delete" on public.products;
create policy "products: seller delete" on public.products for delete using (auth.uid() = seller_id);

-- Product images & features: public read, seller writes via product ownership
drop policy if exists "product_images: public read" on public.product_images;
create policy "product_images: public read" on public.product_images for select using (true);
drop policy if exists "product_images: seller write" on public.product_images;
create policy "product_images: seller write" on public.product_images for all
  using (exists (select 1 from public.products p where p.id = product_id and p.seller_id = auth.uid()));

drop policy if exists "product_features: public read" on public.product_features;
create policy "product_features: public read" on public.product_features for select using (true);
drop policy if exists "product_features: seller write" on public.product_features;
create policy "product_features: seller write" on public.product_features for all
  using (exists (select 1 from public.products p where p.id = product_id and p.seller_id = auth.uid()));

-- Reviews: public read, owner writes
drop policy if exists "reviews: public read" on public.reviews;
create policy "reviews: public read" on public.reviews for select using (true);
drop policy if exists "reviews: owner write" on public.reviews;
create policy "reviews: owner write" on public.reviews for all using (auth.uid() = user_id);

-- Cart: owner only
drop policy if exists "carts: own" on public.carts;
create policy "carts: own" on public.carts for all using (auth.uid() = user_id);
drop policy if exists "cart_items: own" on public.cart_items;
create policy "cart_items: own" on public.cart_items for all
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

-- Wishlist: owner only
drop policy if exists "wishlists: own" on public.wishlists;
create policy "wishlists: own" on public.wishlists for all using (auth.uid() = user_id);
drop policy if exists "wishlist_items: own" on public.wishlist_items;
create policy "wishlist_items: own" on public.wishlist_items for all
  using (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid()));

-- Addresses: owner only
drop policy if exists "addresses: own" on public.addresses;
create policy "addresses: own" on public.addresses for all using (auth.uid() = user_id);

-- Orders: buyer sees own, seller sees items for their products
drop policy if exists "orders: buyer read" on public.orders;
create policy "orders: buyer read" on public.orders for select using (auth.uid() = buyer_id);
drop policy if exists "orders: buyer insert" on public.orders;
create policy "orders: buyer insert" on public.orders for insert with check (auth.uid() = buyer_id);

drop policy if exists "order_items: buyer read" on public.order_items;
create policy "order_items: buyer read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid()));
drop policy if exists "order_items: seller read" on public.order_items;
create policy "order_items: seller read" on public.order_items for select
  using (auth.uid() = seller_id);
drop policy if exists "order_items: buyer insert" on public.order_items;
create policy "order_items: buyer insert" on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid()));

-- Payments: order owner only
drop policy if exists "payments: own" on public.payments;
create policy "payments: own" on public.payments for all
  using (exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid()));

-- Seller follows: anyone reads, owner writes
drop policy if exists "seller_follows: public read" on public.seller_follows;
create policy "seller_follows: public read" on public.seller_follows for select using (true);
drop policy if exists "seller_follows: follower write" on public.seller_follows;
create policy "seller_follows: follower write" on public.seller_follows for all using (auth.uid() = follower_id);

-- Deals: public read
drop policy if exists "deals: public read" on public.deals;
create policy "deals: public read" on public.deals for select using (is_active = true and starts_at <= now() and ends_at >= now());
