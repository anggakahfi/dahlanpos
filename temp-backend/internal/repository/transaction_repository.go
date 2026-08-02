package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// TransactionFilter defines query parameters for listing transactions.
type TransactionFilter struct {
	OutletID      *uuid.UUID
	ShiftID       *uuid.UUID
	PaymentMethod *domain.PaymentMethod
	SearchQuery   *string
	DateFrom      *time.Time
	DateTo        *time.Time
	Page          int
	PerPage       int
}

// TransactionRepository defines the contract for transaction data access.
type TransactionRepository interface {
	Create(ctx context.Context, txn *domain.Transaction) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Transaction, error)
	FindAll(ctx context.Context, filter TransactionFilter) ([]domain.Transaction, int64, float64, error)
	Void(ctx context.Context, id uuid.UUID) error
	SumCashByShift(ctx context.Context, shiftID uuid.UUID) (float64, error)
	GetShiftSummary(ctx context.Context, shiftID uuid.UUID) (*domain.ShiftSummary, error)
}
