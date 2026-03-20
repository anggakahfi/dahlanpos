package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// ShiftRepository defines the contract for shift data access.
type ShiftRepository interface {
	FindOpenByUser(ctx context.Context, userID uuid.UUID) (*domain.Shift, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Shift, error)
	FindAll(ctx context.Context, outletID *uuid.UUID, page, perPage int) ([]domain.Shift, int64, error)
	Create(ctx context.Context, shift *domain.Shift) error
	Close(ctx context.Context, shift *domain.Shift) error
}
