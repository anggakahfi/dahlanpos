package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// ProductUsecase handles product CRUD operations.
type ProductUsecase struct {
	productRepo repository.ProductRepository
}

func NewProductUsecase(pr repository.ProductRepository) *ProductUsecase {
	return &ProductUsecase{productRepo: pr}
}

func (uc *ProductUsecase) List(ctx context.Context, filter repository.ProductFilter) ([]domain.Product, int64, error) {
	return uc.productRepo.FindAll(ctx, filter)
}

func (uc *ProductUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	return uc.productRepo.FindByID(ctx, id)
}

func (uc *ProductUsecase) Create(ctx context.Context, p *domain.Product, modifierGroupIDs []uuid.UUID) error {
	if err := uc.productRepo.Create(ctx, p); err != nil {
		return err
	}
	if len(modifierGroupIDs) > 0 {
		return uc.productRepo.SetModifierGroups(ctx, p.ID, modifierGroupIDs)
	}
	return nil
}

func (uc *ProductUsecase) Update(ctx context.Context, p *domain.Product, modifierGroupIDs []uuid.UUID) error {
	if err := uc.productRepo.Update(ctx, p); err != nil {
		return err
	}
	return uc.productRepo.SetModifierGroups(ctx, p.ID, modifierGroupIDs)
}

func (uc *ProductUsecase) UpdateStock(ctx context.Context, id uuid.UUID, stock int) error {
	return uc.productRepo.UpdateStock(ctx, id, stock)
}

func (uc *ProductUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	return uc.productRepo.Delete(ctx, id)
}
