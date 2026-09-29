create table public.store_notifications (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null
    references public.stores(id)
    on delete cascade,
  recipient_user_id uuid not null
    references public.profiles(id)
    on delete cascade,
  order_id uuid
    references public.orders(id)
    on delete set null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index store_notifications_recipient_created_at_idx
  on public.store_notifications (
    recipient_user_id,
    created_at desc
  );

create index store_notifications_unread_idx
  on public.store_notifications (
    recipient_user_id,
    created_at desc
  )
  where read_at is null;

alter table public.store_notifications enable row level security;

revoke all on table public.store_notifications
  from anon, authenticated;

grant select on table public.store_notifications
  to authenticated;

create policy "Recipients can read their own store notifications"
on public.store_notifications
for select
to authenticated
using (recipient_user_id = auth.uid());