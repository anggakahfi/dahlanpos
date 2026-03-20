BEGIN;

CREATE TABLE shifts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id),
    outlet_id           UUID NOT NULL REFERENCES outlets(id),
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at           TIMESTAMPTZ,
    starting_cash       NUMERIC(12, 2) NOT NULL CHECK (starting_cash >= 0),
    ending_cash         NUMERIC(12, 2),
    expected_cash       NUMERIC(12, 2),
    discrepancy         NUMERIC(12, 2),
    discrepancy_note    TEXT,
    status              shift_status NOT NULL DEFAULT 'open'
);

CREATE INDEX idx_shifts_user ON shifts(user_id);
CREATE INDEX idx_shifts_outlet ON shifts(outlet_id);
CREATE INDEX idx_shifts_status ON shifts(status) WHERE status = 'open';

CREATE TABLE transactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id            UUID NOT NULL REFERENCES shifts(id),
    outlet_id           UUID NOT NULL REFERENCES outlets(id),
    order_id            VARCHAR(50) NOT NULL UNIQUE,
    customer_name       VARCHAR(255),
    subtotal            NUMERIC(12, 2) NOT NULL,
    discount_amount     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount          NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount        NUMERIC(12, 2) NOT NULL,
    payment_method      payment_method NOT NULL,
    payment_status      payment_status NOT NULL DEFAULT 'paid',
    paid_at             TIMESTAMPTZ DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_shift ON transactions(shift_id);
CREATE INDEX idx_transactions_outlet ON transactions(outlet_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);

CREATE TABLE transaction_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name    VARCHAR(255) NOT NULL,
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    unit_price      NUMERIC(12, 2) NOT NULL,
    subtotal        NUMERIC(12, 2) NOT NULL,
    modifiers       JSONB NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_transaction_items_txn ON transaction_items(transaction_id);

COMMIT;
