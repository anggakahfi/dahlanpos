package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type EmployeeUsecase struct {
	userRepo repository.UserRepository
}

func NewEmployeeUsecase(ur repository.UserRepository) *EmployeeUsecase {
	return &EmployeeUsecase{userRepo: ur}
}

func (uc *EmployeeUsecase) List(ctx context.Context) ([]domain.User, error)                 { return uc.userRepo.FindAll(ctx) }
func (uc *EmployeeUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) { return uc.userRepo.FindByID(ctx, id) }

func (uc *EmployeeUsecase) Create(ctx context.Context, u *domain.User) error {
	if u.Status == "" {
		u.Status = domain.StatusActive
	}
	return uc.userRepo.Create(ctx, u)
}

func (uc *EmployeeUsecase) Update(ctx context.Context, u *domain.User) error              { return uc.userRepo.Update(ctx, u) }
func (uc *EmployeeUsecase) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.UserStatus) error { return uc.userRepo.UpdateStatus(ctx, id, status) }
func (uc *EmployeeUsecase) Delete(ctx context.Context, id uuid.UUID) error                 { return uc.userRepo.Delete(ctx, id) }
