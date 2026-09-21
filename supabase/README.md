# Supabase database backup

This folder contains the database structure and security rules for the application.

## Rebuild order

Run each migration once, in filename order, only when preparing a new Supabase project:

1. `migrations/001_store_access.sql`
2. `migrations/002_products_and_product_images.sql`
3. `migrations/003_product_catalog_fields.sql`
4. `migrations/004_product_image_storage.sql`

The current Supabase project has already run these changes. Do not run the old migrations again there, because they are a backup and rebuild record, not a daily deployment script.

## Test data

`seed.local.example.sql` is safe to commit because it has placeholders only. Copy it to `seed.local.sql`, replace the placeholders with your own test-user email addresses, and keep that local file private. Git ignores it.

## Verification

The files in `queries/` are read-only checks. They do not modify database data.

Never place Supabase keys, passwords, or real email addresses in this folder.
