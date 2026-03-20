BEGIN;
DROP TRIGGER IF EXISTS set_updated_at ON settings;
DROP TRIGGER IF EXISTS set_updated_at ON transactions;
DROP TRIGGER IF EXISTS set_updated_at ON products;
DROP TRIGGER IF EXISTS set_updated_at ON users;
DROP TRIGGER IF EXISTS set_updated_at ON outlets;
DROP FUNCTION IF EXISTS trigger_set_updated_at();
COMMIT;
