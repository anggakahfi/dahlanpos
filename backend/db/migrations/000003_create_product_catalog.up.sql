BEGIN;

CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
    name                VARCHAR(255) NOT NULL,
    price               NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock               INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    unit                product_unit NOT NULL DEFAULT 'pcs',
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    description         TEXT,
    image_url           VARCHAR(512),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_favorite         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE modifier_groups (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    required    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE modifier_options (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modifier_group_id   UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    price_impact        NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sort_order          INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_modifier_options_group ON modifier_options(modifier_group_id);

CREATE TABLE product_modifier_groups (
    product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    modifier_group_id   UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, modifier_group_id)
);

COMMIT;
