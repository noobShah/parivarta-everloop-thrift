-- Update products table to support multiple images and sale/rent options
ALTER TABLE products 
  DROP COLUMN image_url,
  DROP COLUMN type,
  DROP COLUMN sp;

-- Add new columns for multiple images and sale/rent functionality
ALTER TABLE products
  ADD COLUMN image_urls text[] DEFAULT '{}',
  ADD COLUMN available_for_sale boolean DEFAULT true,
  ADD COLUMN available_for_rent boolean DEFAULT false,
  ADD COLUMN sale_price numeric,
  ADD COLUMN rent_price_per_month numeric,
  ADD COLUMN rent_duration_months integer;