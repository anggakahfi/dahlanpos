package mocks

import (
	"context"

	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type ActivityLogRepository struct {
	mock.Mock
}

func (m *ActivityLogRepository) Create(ctx context.Context, log *domain.ActivityLog) error {
	args := m.Called(ctx, log)
	return args.Error(0)
}

func (m *ActivityLogRepository) FindAll(ctx context.Context, filter repository.ActivityLogFilter) ([]domain.ActivityLog, int64, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).([]domain.ActivityLog), args.Get(1).(int64), args.Error(2)
}
