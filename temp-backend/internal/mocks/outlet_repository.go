package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type OutletRepository struct {
	mock.Mock
}

func (m *OutletRepository) FindAll(ctx context.Context) ([]domain.Outlet, error) {
	args := m.Called(ctx)
	return args.Get(0).([]domain.Outlet), args.Error(1)
}

func (m *OutletRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Outlet, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Outlet), args.Error(1)
}

func (m *OutletRepository) Create(ctx context.Context, outlet *domain.Outlet) error {
	args := m.Called(ctx, outlet)
	return args.Error(0)
}

func (m *OutletRepository) Update(ctx context.Context, outlet *domain.Outlet) error {
	args := m.Called(ctx, outlet)
	return args.Error(0)
}

func (m *OutletRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.OutletStatus) error {
	args := m.Called(ctx, id, status)
	return args.Error(0)
}

func (m *OutletRepository) Delete(ctx context.Context, id uuid.UUID) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}
