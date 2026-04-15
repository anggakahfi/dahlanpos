package mocks

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type ShiftRepository struct {
	mock.Mock
}

func (m *ShiftRepository) FindOpenByUser(ctx context.Context, userID uuid.UUID) (*domain.Shift, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Shift), args.Error(1)
}

func (m *ShiftRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Shift, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Shift), args.Error(1)
}

func (m *ShiftRepository) FindAll(ctx context.Context, outletID *uuid.UUID, userID *uuid.UUID, startDate *time.Time, endDate *time.Time, page, perPage int) ([]domain.Shift, int64, error) {
	args := m.Called(ctx, outletID, userID, startDate, endDate, page, perPage)
	return args.Get(0).([]domain.Shift), args.Get(1).(int64), args.Error(2)
}

func (m *ShiftRepository) Create(ctx context.Context, shift *domain.Shift) error {
	args := m.Called(ctx, shift)
	return args.Error(0)
}

func (m *ShiftRepository) Close(ctx context.Context, shift *domain.Shift) error {
	args := m.Called(ctx, shift)
	return args.Error(0)
}

func (m *ShiftRepository) AutoCloseExpiredShifts(ctx context.Context) (int64, error) {
	args := m.Called(ctx)
	return args.Get(0).(int64), args.Error(1)
}
