package postgres

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type settingsRepo struct {
	pool *pgxpool.Pool
}

func NewSettingsRepo(pool *pgxpool.Pool) *settingsRepo {
	return &settingsRepo{pool: pool}
}

func (r *settingsRepo) Get(ctx context.Context) (*domain.Settings, error) {
	var paymentJSON, taxJSON, receiptJSON []byte
	err := r.pool.QueryRow(ctx,
		`SELECT payment, tax, receipt FROM settings WHERE id=1`,
	).Scan(&paymentJSON, &taxJSON, &receiptJSON)
	if err != nil {
		return nil, err
	}

	var s domain.Settings
	if err := json.Unmarshal(paymentJSON, &s.Payment); err != nil {
		return nil, err
	}
	if err := json.Unmarshal(taxJSON, &s.Tax); err != nil {
		return nil, err
	}
	if err := json.Unmarshal(receiptJSON, &s.Receipt); err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *settingsRepo) Update(ctx context.Context, settings *domain.Settings) error {
	paymentJSON, _ := json.Marshal(settings.Payment)
	taxJSON, _ := json.Marshal(settings.Tax)
	receiptJSON, _ := json.Marshal(settings.Receipt)

	_, err := r.pool.Exec(ctx,
		`UPDATE settings SET payment=$1, tax=$2, receipt=$3 WHERE id=1`,
		paymentJSON, taxJSON, receiptJSON,
	)
	return err
}
