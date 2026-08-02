package mocks

import (
	"context"

	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type SettingsRepository struct {
	mock.Mock
}

func (m *SettingsRepository) Get(ctx context.Context) (*domain.Settings, error) {
	args := m.Called(ctx)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Settings), args.Error(1)
}

func (m *SettingsRepository) Update(ctx context.Context, s *domain.Settings) error {
	return m.Called(ctx, s).Error(0)
}
