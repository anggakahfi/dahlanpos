package usecase

import (
	"context"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// CashierMenuResponse bundles the full catalog for the cashier POS screen.
type CashierMenuResponse struct {
	Categories     []domain.Category      `json:"categories"`
	Items          []domain.Product       `json:"items"`
	ModifierGroups []domain.ModifierGroup `json:"modifier_groups"`
}

// CashierUsecase handles cashier-side catalog loading.
type CashierUsecase struct {
	productRepo  repository.ProductRepository
	categoryRepo repository.CategoryRepository
	modifierRepo repository.ModifierRepository
}

func NewCashierUsecase(pr repository.ProductRepository, cr repository.CategoryRepository, mr repository.ModifierRepository) *CashierUsecase {
	return &CashierUsecase{productRepo: pr, categoryRepo: cr, modifierRepo: mr}
}

// GetMenu builds the full active menu for the cashier POS screen.
func (uc *CashierUsecase) GetMenu(ctx context.Context) (*CashierMenuResponse, error) {
	categories, err := uc.categoryRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	products, err := uc.productRepo.FindActiveWithModifiers(ctx)
	if err != nil {
		return nil, err
	}

	modifiers, err := uc.modifierRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return &CashierMenuResponse{
		Categories:     categories,
		Items:          products,
		ModifierGroups: modifiers,
	}, nil
}
