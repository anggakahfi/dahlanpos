package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// UserRepository defines the contract for user data access.
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	FindAll(ctx context.Context) ([]domain.User, error)
	Create(ctx context.Context, user *domain.User) error
	Update(ctx context.Context, user *domain.User) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.UserStatus) error
	Delete(ctx context.Context, id uuid.UUID) error
}
