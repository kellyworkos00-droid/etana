CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Groceries', 'Home & Living', 'Health & Beauty')),
  price NUMERIC(10, 2) NOT NULL,
  bulk_price NUMERIC(10, 2) NOT NULL,
  min_order INTEGER NOT NULL,
  image TEXT NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO products (id, name, category, price, bulk_price, min_order, image, discount)
VALUES
  (1, 'Premium Rice (50kg Bag)', 'Groceries', 4500, 4200, 10, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=80', 15),
  (2, 'Cooking Oil (20L Jerry Can)', 'Groceries', 3200, 2950, 20, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&q=80', 10),
  (3, 'Maize Flour (90kg Bag)', 'Groceries', 5800, 5400, 15, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=80', 12),
  (4, 'Detergent Powder (25kg)', 'Home & Living', 2800, 2500, 30, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=900&q=80', 20),
  (5, 'Sugar (50kg Bag)', 'Groceries', 6500, 6100, 10, 'https://images.unsplash.com/photo-1587735243574-7c28a5c525e5?w=900&q=80', 8),
  (6, 'Wheat Flour (50kg)', 'Groceries', 4800, 4500, 20, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80', 15),
  (7, 'Tissue Paper (Pack of 100)', 'Home & Living', 1800, 1600, 50, 'https://images.unsplash.com/photo-1584736286279-4af932d3e4d1?w=900&q=80', 18),
  (8, 'Hand Sanitizer (5L)', 'Health & Beauty', 3500, 3200, 25, 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=900&q=80', 12)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  bulk_price = EXCLUDED.bulk_price,
  min_order = EXCLUDED.min_order,
  image = EXCLUDED.image,
  discount = EXCLUDED.discount;
