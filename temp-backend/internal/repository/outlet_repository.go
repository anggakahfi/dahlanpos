package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// OutletRepository defines the contract for outlet data access.
type OutletRepository interface {
	FindAll(ctx context.Context) ([]domain.Outlet, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Outlet, error)
	Create(ctx context.Context, outlet *domain.Outlet) error
	Update(ctx context.Context, outlet *domain.Outlet) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.OutletStatus) error
	Delete(ctx context.Context, id uuid.UUID) error
}

