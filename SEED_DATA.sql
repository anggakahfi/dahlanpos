-- SEED_DATA.sql (Small Things Coffee POS)
-- Note: This is intended for local dev environments to inject initial data

BEGIN;

-- 1. Create Default Outlet
INSERT INTO outlets (id, name, address, phone) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Small Things Central', 'Jl. Utama', '081234567890')
ON CONFLICT DO NOTHING;

-- 2. Create Default Users for OAuth Matching (Email is primary key for OAuth)
INSERT INTO users (id, outlet_id, name, email, role)
VALUES 
    ('22222222-2222-2222-2222-222222222222', NULL, 'Owner', 'owner@smallthings.com', 'owner'),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Cashier 1', 'cashier@smallthings.com', 'cashier')
ON CONFLICT (email) DO NOTHING;

-- 3. Create Categories
INSERT INTO categories (id, name)
VALUES 
    ('44444444-4444-4444-4444-444444444441', 'Coffee'),
    ('44444444-4444-4444-4444-444444444442', 'Non-Coffee'),
    ('44444444-4444-4444-4444-444444444443', 'Pastry')
ON CONFLICT DO NOTHING;

-- 4. Create Modifiers
INSERT INTO modifier_groups (id, name, required)
VALUES ('55555555-5555-5555-5555-555555555551', 'Size', true)
ON CONFLICT DO NOTHING;

INSERT INTO modifier_options (modifier_group_id, name, price_impact)
VALUES 
    ('55555555-5555-5555-5555-555555555551', 'Regular', 0),
    ('55555555-5555-5555-5555-555555555551', 'Large', 5000);

-- 5. Create Products
INSERT INTO products (id, category_id, name, price, stock, is_active)
VALUES 
    ('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', 'Americano', 20000, 100, true),
    ('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444441', 'Café Latte', 25000, 100, true),
    ('66666666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444442', 'Matcha Latte', 28000, 50, true),
    ('66666666-6666-6666-6666-666666666664', '44444444-4444-4444-4444-444444444443', 'Butter Croissant', 18000, 20, true)
ON CONFLICT DO NOTHING;

-- Link Modifier to Americano & Latte
INSERT INTO product_modifier_groups (product_id, modifier_group_id)
VALUES 
    ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551'),
    ('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555551')
ON CONFLICT DO NOTHING;

COMMIT;
