create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech text[] not null default '{}',
  github text,
  demo text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects
add column if not exists sort_order integer not null default 0;

with ordered_projects as (
  select
    id,
    row_number() over (order by sort_order asc, created_at desc) - 1 as next_sort_order
  from public.projects
)
update public.projects
set sort_order = ordered_projects.next_sort_order
from ordered_projects
where public.projects.id = ordered_projects.id;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Projects are public" on public.projects;
create policy "Projects are public"
on public.projects
for select
using (true);

drop policy if exists "Authenticated users can create projects" on public.projects;
create policy "Authenticated users can create projects"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
on public.projects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
on public.projects
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Project images are public" on storage.objects;
create policy "Project images are public"
on storage.objects
for select
using (bucket_id = 'project-images');

drop policy if exists "Authenticated users can upload project images" on storage.objects;
create policy "Authenticated users can upload project images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated users can update project images" on storage.objects;
create policy "Authenticated users can update project images"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated users can delete project images" on storage.objects;
create policy "Authenticated users can delete project images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-images');
