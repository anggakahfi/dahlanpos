BEGIN;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('owner', 'cashier');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE outlet_status AS ENUM ('active', 'inactive');
CREATE TYPE product_unit AS ENUM ('pcs', 'kg', 'liter', 'porsi', 'cup');
CREATE TYPE shift_status AS ENUM ('open', 'closed');
CREATE TYPE payment_method AS ENUM ('cash', 'qris');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'void');
CREATE TYPE activity_type AS ENUM ('login', 'logout', 'start_shift', 'end_shift', 'transaction');
COMMIT;
