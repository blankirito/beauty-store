select column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'products'
  and column_name in ('status', 'low_stock_threshold', 'collection', 'dimensions', 'weight')
order by column_name;
