package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type ModifierUsecase struct{ repo repository.ModifierRepository }

func NewModifierUsecase(r repository.ModifierRepository) *ModifierUsecase { return &ModifierUsecase{repo: r} }

func (uc *ModifierUsecase) List(ctx context.Context) ([]domain.ModifierGroup, error)                   { return uc.repo.FindAll(ctx) }
func (uc *ModifierUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.ModifierGroup, error)   { return uc.repo.FindByID(ctx, id) }
func (uc *ModifierUsecase) Create(ctx context.Context, g *domain.ModifierGroup) error                  { return uc.repo.Create(ctx, g) }
func (uc *ModifierUsecase) Update(ctx context.Context, g *domain.ModifierGroup) error                  { return uc.repo.Update(ctx, g) }
func (uc *ModifierUsecase) Delete(ctx context.Context, id uuid.UUID) error                             { return uc.repo.Delete(ctx, id) }
