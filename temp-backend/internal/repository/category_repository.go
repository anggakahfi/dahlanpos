package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// CategoryRepository defines the contract for category data access.
type CategoryRepository interface {
	FindAll(ctx context.Context) ([]domain.Category, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Category, error)
	Create(ctx context.Context, cat *domain.Category) error
	Update(ctx context.Context, cat *domain.Category) error
	Delete(ctx context.Context, id uuid.UUID) error
}
