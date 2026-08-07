-- 翻閱1938：同組跨手機共同進度
-- 在 Supabase Dashboard > SQL Editor 貼上並執行一次即可。

create table if not exists public.newsroom_progress (
  newsroom text not null,
  case_index integer not null,
  created_at timestamptz not null default now()
);

-- 若先前測試時產生重複資料，先保留每組／每關一筆。
delete from public.newsroom_progress a
using public.newsroom_progress b
where a.ctid < b.ctid
  and a.newsroom = b.newsroom
  and a.case_index = b.case_index;

-- 每個組別的每一關只能有一筆進度，讓前端 POST 可安全重試。
create unique index if not exists newsroom_progress_group_case_key
  on public.newsroom_progress (newsroom, case_index);

alter table public.newsroom_progress enable row level security;

-- 重建遊戲需要的最小權限。
drop policy if exists "game progress read" on public.newsroom_progress;
drop policy if exists "game progress insert" on public.newsroom_progress;
drop policy if exists "public read game progress" on public.newsroom_progress;
drop policy if exists "public insert game progress" on public.newsroom_progress;

create policy "game progress read"
on public.newsroom_progress
for select
to anon, authenticated
using (newsroom in ('蘭臺', '見山', '迴聲'));

create policy "game progress insert"
on public.newsroom_progress
for insert
to anon, authenticated
with check (
  newsroom in ('蘭臺', '見山', '迴聲')
  and case_index between 1000 and 1099
);

grant select, insert on public.newsroom_progress to anon, authenticated;
revoke update, delete on public.newsroom_progress from anon, authenticated;

-- 可選：確認三組目前的共同進度
select newsroom, array_agg(case_index order by case_index) as solved_cases
from public.newsroom_progress
where newsroom in ('蘭臺', '見山', '迴聲')
group by newsroom
order by newsroom;
