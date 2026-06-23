/*
# Add RLS policies for orders and reviews tables

1. Security Changes
- Add owner-scoped RLS policies on `orders` table:
  - SELECT: users can only view their own orders
  - INSERT: users can only create orders with their own user_id
  - UPDATE: users can only update their own orders
  - DELETE: users can only delete their own orders
- Add owner-scoped RLS policies on `reviews` table:
  - SELECT: users can only view their own reviews
  - INSERT: users can only create reviews with their own user_id
  - UPDATE: users can only update their own reviews
  - DELETE: users can only delete their own reviews

2. Important Notes
- Email confirmation is OFF by default (Supabase auth.users)
- The `user_id` column on orders and reviews is already a string field; the policies
  compare it to `auth.uid()` to enforce ownership.
- The `user_id` default is already set in the schema so inserts from authenticated
  clients naturally populate the owner.
*/

-- Orders table policies
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Reviews table policies
DROP POLICY IF EXISTS "select_own_reviews" ON reviews;
CREATE POLICY "select_own_reviews" ON reviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews;
CREATE POLICY "update_own_reviews" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews;
CREATE POLICY "delete_own_reviews" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
