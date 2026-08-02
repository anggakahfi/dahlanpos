BEGIN;

CREATE TABLE settings (
    id          INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    payment     JSONB NOT NULL DEFAULT '{"cash_enabled": true, "qris_enabled": true}',
    tax         JSONB NOT NULL DEFAULT '{"enabled": false, "rate": 10, "name": "PPN", "type": "exclusive"}',
    receipt     JSONB NOT NULL DEFAULT '{"logo_url": null, "header_text": "Small Things Coffee", "footer_message": "Thank you for supporting small businesses!", "show_tax_breakdown": true}',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the singleton row
INSERT INTO settings (id) VALUES (1);

CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    outlet_id       UUID REFERENCES outlets(id),
    activity_type   activity_type NOT NULL,
    details         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

COMMIT;
