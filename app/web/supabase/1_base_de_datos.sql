-- Porción: base de datos para cuentas y guardado en la nube.
-- Pegar todo en Supabase → SQL Editor → New query → Run.

create table if not exists public.kv (
  path text primary key,
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists kv_owner_idx on public.kv(owner);
create index if not exists kv_path_prefix_idx on public.kv(path text_pattern_ops);

alter table public.kv enable row level security;

-- cada persona ve solo lo suyo; las correcciones de la cámara (calib/...) las ven todos para que la IA aprenda de todos
drop policy if exists "leer lo propio y calib" on public.kv;
create policy "leer lo propio y calib" on public.kv for select to authenticated
  using (owner = auth.uid() or path like 'calib/%');

drop policy if exists "crear lo propio" on public.kv;
create policy "crear lo propio" on public.kv for insert to authenticated
  with check (owner = auth.uid() and (path like 'data/users/' || auth.uid()::text || '/%' or path = 'calib/' || auth.uid()::text));

drop policy if exists "cambiar lo propio" on public.kv;
create policy "cambiar lo propio" on public.kv for update to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid() and (path like 'data/users/' || auth.uid()::text || '/%' or path = 'calib/' || auth.uid()::text));

drop policy if exists "borrar lo propio" on public.kv;
create policy "borrar lo propio" on public.kv for delete to authenticated
  using (owner = auth.uid());

-- límite diario de uso de la IA por persona (lo usa la función "ai")
create table if not exists public.ai_uso (
  owner uuid not null references auth.users(id) on delete cascade,
  dia date not null default current_date,
  n int not null default 0,
  primary key (owner, dia)
);
alter table public.ai_uso enable row level security;   -- solo la función (con la clave de servicio) la toca
