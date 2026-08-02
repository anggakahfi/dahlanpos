package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type ModifierRepository struct {
	mock.Mock
}

func (m *ModifierRepository) FindAll(ctx context.Context) ([]domain.ModifierGroup, error) {
	args := m.Called(ctx)
	return args.Get(0).([]domain.ModifierGroup), args.Error(1)
}

func (m *ModifierRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.ModifierGroup, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.ModifierGroup), args.Error(1)
}

func (m *ModifierRepository) FindByIDs(ctx context.Context, ids []uuid.UUID) ([]domain.ModifierGroup, error) {
	args := m.Called(ctx, ids)
	return args.Get(0).([]domain.ModifierGroup), args.Error(1)
}

func (m *ModifierRepository) Create(ctx context.Context, group *domain.ModifierGroup) error {
	return m.Called(ctx, group).Error(0)
}

func (m *ModifierRepository) Update(ctx context.Context, group *domain.ModifierGroup) error {
	return m.Called(ctx, group).Error(0)
}

func (m *ModifierRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return m.Called(ctx, id).Error(0)
}
