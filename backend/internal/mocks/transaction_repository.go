package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type TransactionRepository struct {
	mock.Mock
}

func (m *TransactionRepository) Create(ctx context.Context, txn *domain.Transaction) error {
	args := m.Called(ctx, txn)
	return args.Error(0)
}

func (m *TransactionRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Transaction, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Transaction), args.Error(1)
}

func (m *TransactionRepository) FindAll(ctx context.Context, filter repository.TransactionFilter) ([]domain.Transaction, int64, float64, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).([]domain.Transaction), args.Get(1).(int64), args.Get(2).(float64), args.Error(3)
}

func (m *TransactionRepository) Void(ctx context.Context, id uuid.UUID) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *TransactionRepository) SumCashByShift(ctx context.Context, shiftID uuid.UUID) (float64, error) {
	args := m.Called(ctx, shiftID)
	return args.Get(0).(float64), args.Error(1)
}

func (m *TransactionRepository) GetShiftSummary(ctx context.Context, shiftID uuid.UUID) (*domain.ShiftSummary, error) {
	args := m.Called(ctx, shiftID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.ShiftSummary), args.Error(1)
}
