package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type CategoryUsecase struct{ repo repository.CategoryRepository }

func NewCategoryUsecase(r repository.CategoryRepository) *CategoryUsecase { return &CategoryUsecase{repo: r} }

func (uc *CategoryUsecase) List(ctx context.Context) ([]domain.Category, error)             { return uc.repo.FindAll(ctx) }
func (uc *CategoryUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) { return uc.repo.FindByID(ctx, id) }
func (uc *CategoryUsecase) Create(ctx context.Context, c *domain.Category) error             { return uc.repo.Create(ctx, c) }
func (uc *CategoryUsecase) Update(ctx context.Context, c *domain.Category) error             { return uc.repo.Update(ctx, c) }
func (uc *CategoryUsecase) Delete(ctx context.Context, id uuid.UUID) error                   { return uc.repo.Delete(ctx, id) }
