create table if not exists public.newsroom_progress (
  newsroom text not null check (char_length(newsroom) between 1 and 30),
  case_index integer not null check (case_index between 0 and 12),
  solved_at timestamptz not null default now(),
  primary key (newsroom, case_index)
);

alter table public.newsroom_progress enable row level security;

grant usage on schema public to anon;
grant select, insert on public.newsroom_progress to anon;

drop policy if exists "Read shared newsroom progress" on public.newsroom_progress;
create policy "Read shared newsroom progress"
on public.newsroom_progress for select to anon
using (true);

drop policy if exists "Add shared newsroom progress" on public.newsroom_progress;
create policy "Add shared newsroom progress"
on public.newsroom_progress for insert to anon
with check (char_length(newsroom) between 1 and 30 and case_index between 0 and 12);
