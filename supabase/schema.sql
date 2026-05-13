create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  industry text not null,
  concept text not null,
  preview_style text not null,
  headline text not null,
  cta text not null,
  supporting_copy text not null,
  proof text not null,
  sections jsonb not null default '["Hero","Proof","Convert"]'::jsonb,
  visual_mood text not null,
  price_usd integer not null check (price_usd in (29, 49, 59)),
  price_cad integer not null check (price_cad in (29, 49, 59)),
  tier text not null check (tier in ('css', 'react', 'premium')),
  stack text not null,
  is_best_seller boolean not null default true,
  delivery_note text not null,
  zip_path text,
  preview_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  motion_profile text,
  generated_at timestamptz not null default now(),
  reference_ids jsonb not null default '[]'::jsonb,
  accent text not null,
  palette jsonb not null,
  stats text not null,
  signature text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."references" (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  discovered_url text not null,
  screenshot_path text,
  title text,
  tags jsonb not null default '[]'::jsonb,
  palette jsonb not null default '{}'::jsonb,
  layout_notes text,
  motion_notes text,
  typography_notes text,
  interaction_notes text,
  allowed_use text not null default 'reference_only',
  captured_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  template_id text not null,
  buyer_email text not null,
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'sent', 'failed')),
  signed_link_sent_at timestamptz,
  delivery_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_status_generated_at_idx
  on public.templates (status, generated_at desc);

create index if not exists templates_price_generated_at_idx
  on public.templates (price_usd, generated_at desc);

create index if not exists references_captured_at_idx
  on public."references" (captured_at desc);

insert into storage.buckets (id, name, public)
values
  ('template-previews', 'template-previews', true),
  ('template-zips', 'template-zips', false),
  ('reference-shots', 'reference-shots', false)
on conflict (id) do nothing;
