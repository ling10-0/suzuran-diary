create table if not exists public.newsroom_progress (
  newsroom text not null check (char_length(newsroom) between 1 and 30),
  case_index integer not null,
  solved_at timestamptz not null default now(),
  primary key (newsroom, case_index)
);

alter table public.newsroom_progress enable row level security;

alter table public.newsroom_progress
  drop constraint if exists newsroom_progress_case_index_check;

alter table public.newsroom_progress
  add constraint newsroom_progress_case_index_check
  check (case_index between 0 and 103);

grant usage on schema public to anon;
grant select, insert on public.newsroom_progress to anon;

drop policy if exists "Read shared newsroom progress" on public.newsroom_progress;
create policy "Read shared newsroom progress"
on public.newsroom_progress for select to anon
using (true);

drop policy if exists "Add shared newsroom progress" on public.newsroom_progress;
create policy "Add shared newsroom progress"
on public.newsroom_progress for insert to anon
with check (char_length(newsroom) between 1 and 30 and case_index between 0 and 103);
