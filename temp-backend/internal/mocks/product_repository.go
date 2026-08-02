package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type ProductRepository struct {
	mock.Mock
}

func (m *ProductRepository) FindAll(ctx context.Context, filter repository.ProductFilter) ([]domain.Product, int64, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).([]domain.Product), args.Get(1).(int64), args.Error(2)
}

func (m *ProductRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Product), args.Error(1)
}

func (m *ProductRepository) FindActiveWithModifiers(ctx context.Context) ([]domain.Product, error) {
	args := m.Called(ctx)
	return args.Get(0).([]domain.Product), args.Error(1)
}

func (m *ProductRepository) Create(ctx context.Context, product *domain.Product) error {
	args := m.Called(ctx, product)
	return args.Error(0)
}

func (m *ProductRepository) Update(ctx context.Context, product *domain.Product) error {
	args := m.Called(ctx, product)
	return args.Error(0)
}

func (m *ProductRepository) UpdateStock(ctx context.Context, id uuid.UUID, delta int) error {
	args := m.Called(ctx, id, delta)
	return args.Error(0)
}

func (m *ProductRepository) SetAbsoluteStock(ctx context.Context, id uuid.UUID, stock int) error {
	args := m.Called(ctx, id, stock)
	return args.Error(0)
}

func (m *ProductRepository) Delete(ctx context.Context, id uuid.UUID) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *ProductRepository) SetModifierGroups(ctx context.Context, productID uuid.UUID, groupIDs []uuid.UUID) error {
	args := m.Called(ctx, productID, groupIDs)
	return args.Error(0)
}

func (m *ProductRepository) GetModifierGroupIDs(ctx context.Context, productID uuid.UUID) ([]uuid.UUID, error) {
	args := m.Called(ctx, productID)
	return args.Get(0).([]uuid.UUID), args.Error(1)
}
