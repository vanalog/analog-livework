-- Taxonomy tables for sports and conferences.
-- These lookup tables replace hardcoded constants and let admins manage
-- the canonical list from /settings/taxonomy.

-- ============ SPORTS ============
create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed with the current SPORT_LABELS values (idempotent via ON CONFLICT).
insert into public.sports (key, label, sort_order) values
  ('football',          'Football',                      10),
  ('mens_basketball',   'Men''s Basketball',             20),
  ('womens_basketball', 'Women''s Basketball',           30),
  ('baseball',          'Baseball',                      40),
  ('softball',          'Softball',                      50),
  ('mens_soccer',       'Men''s Soccer',                 60),
  ('womens_soccer',     'Women''s Soccer',               70),
  ('volleyball',        'Volleyball',                    80),
  ('mens_tennis',       'Men''s Tennis',                 90),
  ('womens_tennis',     'Women''s Tennis',              100),
  ('mens_golf',         'Men''s Golf',                  110),
  ('womens_golf',       'Women''s Golf',                120),
  ('mens_swimming',     'Men''s Swimming & Diving',     130),
  ('womens_swimming',   'Women''s Swimming & Diving',   140),
  ('mens_track',        'Men''s Track & Field',         150),
  ('womens_track',      'Women''s Track & Field',       160),
  ('wrestling',         'Wrestling',                    170),
  ('gymnastics',        'Gymnastics',                   180),
  ('lacrosse',          'Lacrosse',                     190),
  ('field_hockey',      'Field Hockey',                 200),
  ('rowing',            'Rowing',                       210),
  ('ice_hockey',        'Ice Hockey',                   220),
  ('cross_country',     'Cross Country',                230),
  ('other',             'Other',                        999)
on conflict (key) do nothing;

-- ============ CONFERENCES ============
create table if not exists public.conferences (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.conferences (name, sort_order) values
  ('ACC',            10),
  ('Big Ten',        20),
  ('Big 12',         30),
  ('Pac-12',         40),
  ('SEC',            50),
  ('American',       60),
  ('Conference USA', 70),
  ('MAC',            80),
  ('Mountain West',  90),
  ('Sun Belt',      100),
  ('Big East',      110),
  ('Atlantic 10',   120),
  ('Ivy League',    130),
  ('Independent',   140),
  ('Other',         999)
on conflict (name) do nothing;
