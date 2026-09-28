create extension if not exists pg_cron;

select cron.schedule(
  'release-expired-inventory-reservations',
  '0 * * * *',
  $$
    select public.release_expired_inventory_reservations();
  $$
);