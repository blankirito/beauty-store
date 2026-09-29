create table if not exists public.payment_qr_cleanup_jobs (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  created_at timestamptz not null default now()
);

create index if not exists payment_qr_cleanup_jobs_created_at_idx
on public.payment_qr_cleanup_jobs (created_at);

alter table public.payment_qr_cleanup_jobs enable row level security;

revoke all on table public.payment_qr_cleanup_jobs
from anon, authenticated;