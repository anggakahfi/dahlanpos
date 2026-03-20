BEGIN;

CREATE TABLE outlets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    open_time       TIME,
    close_time      TIME,
    status          outlet_status NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id       UUID REFERENCES outlets(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    role            user_role NOT NULL DEFAULT 'cashier',
    status          user_status NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_outlet ON users(outlet_id);

COMMIT;
