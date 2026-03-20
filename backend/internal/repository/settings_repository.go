package repository

import (
	"context"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// SettingsRepository defines the contract for settings data access.
type SettingsRepository interface {
	Get(ctx context.Context) (*domain.Settings, error)
	Update(ctx context.Context, settings *domain.Settings) error
}
