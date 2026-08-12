-- 翻閱1938：同組跨裝置共同進度
-- Supabase Dashboard > SQL Editor 執行一次。
-- 正式資料與可清空的測試資料分表，避免測試重設誤刪活動進度。

create table if not exists public.newsroom_progress (
  newsroom text not null,
  case_index integer not null,
  launch_version text not null,
  created_at timestamptz not null default now(),
  primary key (newsroom, case_index)
);

-- 移除曾使用過的衝突範圍，統一採 1000–1099。
alter table public.newsroom_progress
  drop constraint if exists newsroom_progress_case_index_check;

alter table public.newsroom_progress
  add constraint newsroom_progress_case_index_check
  check (case_index between 1000 and 1099);

alter table public.newsroom_progress
  drop constraint if exists newsroom_progress_launch_version_check;

alter table public.newsroom_progress
  add constraint newsroom_progress_launch_version_check
  check (launch_version = '2026-08-14-launch');

alter table public.newsroom_progress enable row level security;

drop policy if exists "game progress read" on public.newsroom_progress;
drop policy if exists "game progress insert" on public.newsroom_progress;
drop policy if exists "public read game progress" on public.newsroom_progress;
drop policy if exists "public insert game progress" on public.newsroom_progress;
drop policy if exists "Read shared newsroom progress" on public.newsroom_progress;
drop policy if exists "Add shared newsroom progress" on public.newsroom_progress;

create policy "game progress read"
on public.newsroom_progress for select to anon, authenticated
using (newsroom in ('蘭臺', '見山', '迴聲'));

create policy "game progress insert"
on public.newsroom_progress for insert to anon, authenticated
with check (
  newsroom in ('蘭臺', '見山', '迴聲')
  and case_index between 1000 and 1099
  and launch_version = '2026-08-14-launch'
);

grant select, insert on public.newsroom_progress to anon, authenticated;
revoke update, delete on public.newsroom_progress from anon, authenticated;

create table if not exists public.newsroom_test_progress (
  test_session text not null,
  newsroom text not null,
  case_index integer not null check (case_index between 1000 and 1099),
  created_at timestamptz not null default now(),
  primary key (test_session, newsroom, case_index),
  check (test_session ~ '^[A-Z0-9]{6,12}$'),
  check (newsroom in ('蘭臺', '見山', '迴聲'))
);

alter table public.newsroom_test_progress enable row level security;

drop policy if exists "test progress read" on public.newsroom_test_progress;
drop policy if exists "test progress insert" on public.newsroom_test_progress;
drop policy if exists "test progress delete" on public.newsroom_test_progress;

create policy "test progress read"
on public.newsroom_test_progress for select to anon, authenticated
using (
  newsroom in ('蘭臺', '見山', '迴聲')
  and test_session ~ '^[A-Z0-9]{6,12}$'
);

create policy "test progress insert"
on public.newsroom_test_progress for insert to anon, authenticated
with check (
  newsroom in ('蘭臺', '見山', '迴聲')
  and test_session ~ '^[A-Z0-9]{6,12}$'
  and case_index between 1000 and 1099
);

-- 只有測試表可從前台刪除；正式表沒有 DELETE 權限或 policy。
create policy "test progress delete"
on public.newsroom_test_progress for delete to anon, authenticated
using (
  newsroom in ('蘭臺', '見山', '迴聲')
  and test_session ~ '^[A-Z0-9]{6,12}$'
);

grant select, insert, delete on public.newsroom_test_progress to anon, authenticated;
revoke update on public.newsroom_test_progress from anon, authenticated;

select newsroom, array_agg(case_index order by case_index) as solved_cases
from public.newsroom_progress
where newsroom in ('蘭臺', '見山', '迴聲')
group by newsroom
order by newsroom;
