package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type OutletUsecase struct{ repo repository.OutletRepository }

func NewOutletUsecase(r repository.OutletRepository) *OutletUsecase { return &OutletUsecase{repo: r} }

func (uc *OutletUsecase) List(ctx context.Context) ([]domain.Outlet, error)                    { return uc.repo.FindAll(ctx) }
func (uc *OutletUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Outlet, error)    { return uc.repo.FindByID(ctx, id) }
func (uc *OutletUsecase) Create(ctx context.Context, o *domain.Outlet) error                   { return uc.repo.Create(ctx, o) }
func (uc *OutletUsecase) Update(ctx context.Context, o *domain.Outlet) error                   { return uc.repo.Update(ctx, o) }
func (uc *OutletUsecase) UpdateStatus(ctx context.Context, id uuid.UUID, s domain.OutletStatus) error { return uc.repo.UpdateStatus(ctx, id, s) }
func (uc *OutletUsecase) Delete(ctx context.Context, id uuid.UUID) error                       { return uc.repo.Delete(ctx, id) }
