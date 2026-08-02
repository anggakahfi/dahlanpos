package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type CategoryRepository struct {
	mock.Mock
}

func (m *CategoryRepository) FindAll(ctx context.Context) ([]domain.Category, error) {
	args := m.Called(ctx)
	return args.Get(0).([]domain.Category), args.Error(1)
}

func (m *CategoryRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Category), args.Error(1)
}

func (m *CategoryRepository) Create(ctx context.Context, cat *domain.Category) error {
	return m.Called(ctx, cat).Error(0)
}

func (m *CategoryRepository) Update(ctx context.Context, cat *domain.Category) error {
	return m.Called(ctx, cat).Error(0)
}

func (m *CategoryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return m.Called(ctx, id).Error(0)
}
