package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// ModifierRepository defines the contract for modifier group/option data access.
type ModifierRepository interface {
	FindAll(ctx context.Context) ([]domain.ModifierGroup, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.ModifierGroup, error)
	FindByIDs(ctx context.Context, ids []uuid.UUID) ([]domain.ModifierGroup, error)
	Create(ctx context.Context, group *domain.ModifierGroup) error
	Update(ctx context.Context, group *domain.ModifierGroup) error
	Delete(ctx context.Context, id uuid.UUID) error
}
