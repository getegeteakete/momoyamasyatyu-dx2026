-- =============================================
-- 桃山社中 補助金進捗管理 — Supabase セットアップSQL
-- Supabase Dashboard > SQL Editor に貼り付けて実行
-- =============================================

-- 1. テーブル作成
create table if not exists subsidies (
  id text primary key,
  name text not null,
  category text default '国',
  max_amount text,
  rate text,
  status integer default 0,
  priority text default '中',
  deadline text,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id text primary key,
  subsidy_id text references subsidies(id) on delete cascade,
  text text not null,
  done boolean default false,
  date text,
  created_at timestamptz default now()
);

create table if not exists notes (
  id text primary key,
  subsidy_id text references subsidies(id) on delete cascade,
  text text not null,
  author text default '担当者',
  created_at timestamptz default now()
);

create table if not exists files (
  id text primary key,
  subsidy_id text references subsidies(id) on delete cascade,
  name text not null,
  type text default '申請書類',
  created_at timestamptz default now()
);

-- 2. Row Level Security を有効化（認証なしで全アクセス許可）
alter table subsidies enable row level security;
alter table tasks enable row level security;
alter table notes enable row level security;
alter table files enable row level security;

-- anon キーで全操作を許可（クライアント共有のため）
create policy "Public access subsidies" on subsidies for all using (true) with check (true);
create policy "Public access tasks" on tasks for all using (true) with check (true);
create policy "Public access notes" on notes for all using (true) with check (true);
create policy "Public access files" on files for all using (true) with check (true);

-- 3. リアルタイム有効化
alter publication supabase_realtime add table subsidies;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table files;

-- 4. 初期データ投入（桃山社中の4補助金）
insert into subsidies (id, name, category, max_amount, rate, status, priority, deadline) values
  ('digital-ai',   'デジタル化・AI導入補助金2026',    '国',    '¥450万',     '1/2〜4/5', 1, '高', '2026-05-12'),
  ('monodukuri',   'ものづくり補助金 第23次',         '国',    '¥4,000万',   '1/2〜2/3', 1, '高', '2026-06-30'),
  ('osaka-dx',     '大阪産業局 DX支援補助金',         '大阪府', '¥300万',    '2/3',      0, '中', '2026-08-31'),
  ('reskilling',   '大阪府リスキリング支援補助金',     '大阪府', '費用の一部', '優遇率',   0, '低', '2026-12-31')
on conflict (id) do nothing;

insert into tasks (id, subsidy_id, text, done, date) values
  -- デジタル化・AI導入
  ('t-d1', 'digital-ai', 'GビズIDプライム取得',       true,  '2026-02-28'),
  ('t-d2', 'digital-ai', 'SECURITY ACTION一つ星申請', true,  '2026-02-28'),
  ('t-d3', 'digital-ai', 'IT支援事業者選定',          false, '2026-03-20'),
  ('t-d4', 'digital-ai', '事業計画書作成',            false, '2026-04-20'),
  ('t-d5', 'digital-ai', '交付申請提出',              false, '2026-05-10'),
  -- ものづくり
  ('t-m1', 'monodukuri', '革新性論証資料作成',        false, '2026-03-31'),
  ('t-m2', 'monodukuri', '技術開発計画策定',          false, '2026-04-30'),
  ('t-m3', 'monodukuri', '申請書提出',                false, '2026-06-25'),
  -- 大阪DX
  ('t-o1', 'osaka-dx', 'DX課題整理ヒアリング',       false, '2026-05-15'),
  ('t-o2', 'osaka-dx', '専門家コンサル手配',         false, '2026-06-01'),
  ('t-o3', 'osaka-dx', '申請書類準備',               false, '2026-08-15'),
  -- リスキリング
  ('t-r1', 'reskilling', '対象研修プログラム確認',   false, '2026-07-01'),
  ('t-r2', 'reskilling', '受講申込',                 false, '2026-09-01')
on conflict (id) do nothing;
