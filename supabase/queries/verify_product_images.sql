select product_id, storage_path, sort_order, is_primary, created_at
from public.product_images
order by created_at desc
limit 5;
