/*
# Update categories to four main categories

1. Changes
- Consolidate 8 categories into 4 main categories: Veg Pickles, Non-Veg Pickles, Traditional Snacks, Combo Packs
- Reassign all existing products to their new category
- Delete old categories that are no longer needed

2. Category mapping
- Mango Pickles, Gongura Pickles, Lemon Pickles, Garlic Pickles → Veg Pickles
- Murukulu, Chekkalu, existing Traditional Snacks → Traditional Snacks
- Existing Combo Packs → Combo Packs
- Non-Veg Pickles → new empty category for future products
*/

-- Step 1: Reassign all products to consolidated categories
-- Veg Pickles (mango, gongura, lemon, garlic)
UPDATE products SET category_id = '9b36a444-a0c1-42e4-a91a-28a400b61aa1'
WHERE category_id IN (
  '9d9d228b-f438-48e4-8401-accaf5ec3e40', -- mango-pickles
  '9cd98954-acfb-42a8-82ba-6f3d8eed19ab', -- gongura-pickles
  '9e7bfb54-6515-4838-aaa5-92d0a6d0c647', -- lemon-pickles
  'fb265bb6-11cb-43f4-9cd2-faa3fb496aec'  -- garlic-pickles
);

-- Traditional Snacks (murukulu, chekkalu, existing traditional-snacks)
UPDATE products SET category_id = '9b36a444-a0c1-42e4-a91a-28a400b61aa1'
WHERE category_id IN (
  'db6ded29-4b1b-4586-9b2f-8ec9b4a49010', -- murukulu
  '352db057-9dfd-41f1-a35e-f7277715f253'  -- chekkalu
);

-- Step 2: Update Traditional Snacks to keep its ID
UPDATE categories
SET name = 'Traditional Snacks', slug = 'traditional-snacks', sort_order = 3
WHERE id = '9b36a444-a0c1-42e4-a91a-28a400b61aa1';

-- Step 3: Update Combo Packs to keep its ID
UPDATE categories
SET name = 'Combo Packs', slug = 'combo-packs', sort_order = 4
WHERE id = '6e2f9eb8-e1de-45a4-ae1c-6d9eb348daa3';

-- Step 4: Create Veg Pickles category
INSERT INTO categories (id, name, slug, description, image_url, sort_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'Veg Pickles', 'veg-pickles', 'Authentic homemade vegetable pickles', 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800', 1);

-- Step 5: Create Non-Veg Pickles category
INSERT INTO categories (id, name, slug, description, image_url, sort_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'Non-Veg Pickles', 'non-veg-pickles', 'Traditional non-vegetarian pickles', 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=800', 2);

-- Step 6: Reassign products to Veg Pickles now that the category exists
UPDATE products SET category_id = '11111111-1111-1111-1111-111111111111'
WHERE category_id = '9b36a444-a0c1-42e4-a91a-28a400b61aa1' AND name NOT IN (
  'Gavvalu', 'Minapa Sunnundalu', 'Sakinalu'
);

-- Step 7: Delete old categories
DELETE FROM categories WHERE id IN (
  '9d9d228b-f438-48e4-8401-accaf5ec3e40',
  '9cd98954-acfb-42a8-82ba-6f3d8eed19ab',
  '9e7bfb54-6515-4838-aaa5-92d0a6d0c647',
  'fb265bb6-11cb-43f4-9cd2-faa3fb496aec',
  'db6ded29-4b1b-4586-9b2f-8ec9b4a49010',
  '352db057-9dfd-41f1-a35e-f7277715f253'
);
