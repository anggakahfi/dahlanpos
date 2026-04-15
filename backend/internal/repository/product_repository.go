package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// ProductFilter defines query parameters for listing products.
type ProductFilter struct {
	CategoryID *uuid.UUID
	Search     string
	IsActive   *bool
	Page       int
	PerPage    int
}

// ProductRepository defines the contract for product data access.
type ProductRepository interface {
	FindAll(ctx context.Context, filter ProductFilter) ([]domain.Product, int64, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error)
	FindActiveWithModifiers(ctx context.Context) ([]domain.Product, error) // For cashier menu
	Create(ctx context.Context, product *domain.Product) error
	Update(ctx context.Context, product *domain.Product) error
	UpdateStock(ctx context.Context, id uuid.UUID, delta int) error          // Atomic stock delta (used by transactions)
	SetAbsoluteStock(ctx context.Context, id uuid.UUID, stock int) error     // Set absolute stock value (used by backoffice)
	Delete(ctx context.Context, id uuid.UUID) error
	SetModifierGroups(ctx context.Context, productID uuid.UUID, groupIDs []uuid.UUID) error
	GetModifierGroupIDs(ctx context.Context, productID uuid.UUID) ([]uuid.UUID, error)
}
