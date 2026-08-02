package usecase_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/mocks"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func newCashierUsecase() (*usecase.CashierUsecase, *mocks.ProductRepository, *mocks.CategoryRepository, *mocks.ModifierRepository) {
	pr := new(mocks.ProductRepository)
	cr := new(mocks.CategoryRepository)
	mr := new(mocks.ModifierRepository)
	uc := usecase.NewCashierUsecase(pr, cr, mr)
	return uc, pr, cr, mr
}

func TestGetMenu_Success(t *testing.T) {
	uc, pr, cr, mr := newCashierUsecase()

	cr.On("FindAll", mock.Anything).Return([]domain.Category{{Name: "Kopi"}}, nil)
	pr.On("FindActiveWithModifiers", mock.Anything).Return([]domain.Product{{Name: "Latte"}}, nil)
	mr.On("FindAll", mock.Anything).Return([]domain.ModifierGroup{{Name: "Sugar"}}, nil)

	menu, err := uc.GetMenu(context.Background())

	assert.NoError(t, err)
	assert.NotNil(t, menu)
	assert.Len(t, menu.Categories, 1)
	assert.Len(t, menu.Items, 1)
	assert.Len(t, menu.ModifierGroups, 1)
}

func TestGetMenu_Fail_CategoryError(t *testing.T) {
	uc, _, cr, _ := newCashierUsecase()
	cr.On("FindAll", mock.Anything).Return([]domain.Category(nil), errors.New("db error"))

	menu, err := uc.GetMenu(context.Background())
	assert.Error(t, err)
	assert.Nil(t, menu)
}

func TestGetMenu_Fail_ProductError(t *testing.T) {
	uc, pr, cr, _ := newCashierUsecase()
	cr.On("FindAll", mock.Anything).Return([]domain.Category{}, nil)
	pr.On("FindActiveWithModifiers", mock.Anything).Return([]domain.Product(nil), errors.New("db error"))

	menu, err := uc.GetMenu(context.Background())
	assert.Error(t, err)
	assert.Nil(t, menu)
}

func TestGetMenu_Fail_ModifierError(t *testing.T) {
	uc, pr, cr, mr := newCashierUsecase()
	cr.On("FindAll", mock.Anything).Return([]domain.Category{}, nil)
	pr.On("FindActiveWithModifiers", mock.Anything).Return([]domain.Product{}, nil)
	mr.On("FindAll", mock.Anything).Return([]domain.ModifierGroup(nil), errors.New("db error"))

	menu, err := uc.GetMenu(context.Background())
	assert.Error(t, err)
	assert.Nil(t, menu)
}

// ─── CategoryUsecase ───────────────────────────────────────────

func TestCategory_List(t *testing.T) {
	cr := new(mocks.CategoryRepository)
	uc := usecase.NewCategoryUsecase(cr)
	cr.On("FindAll", mock.Anything).Return([]domain.Category{{Name: "Makanan"}}, nil)
	cats, err := uc.List(context.Background())
	assert.NoError(t, err)
	assert.Len(t, cats, 1)
}

func TestCategory_GetByID(t *testing.T) {
	cr := new(mocks.CategoryRepository)
	uc := usecase.NewCategoryUsecase(cr)
	id := uuid.New()
	cr.On("FindByID", mock.Anything, id).Return(&domain.Category{ID: id, Name: "Kopi"}, nil)
	cat, err := uc.GetByID(context.Background(), id)
	assert.NoError(t, err)
	assert.Equal(t, "Kopi", cat.Name)
}

func TestCategory_Create(t *testing.T) {
	cr := new(mocks.CategoryRepository)
	uc := usecase.NewCategoryUsecase(cr)
	cat := &domain.Category{Name: "Minuman"}
	cr.On("Create", mock.Anything, cat).Return(nil)
	assert.NoError(t, uc.Create(context.Background(), cat))
}

func TestCategory_Update(t *testing.T) {
	cr := new(mocks.CategoryRepository)
	uc := usecase.NewCategoryUsecase(cr)
	cat := &domain.Category{ID: uuid.New(), Name: "Updated"}
	cr.On("Update", mock.Anything, cat).Return(nil)
	assert.NoError(t, uc.Update(context.Background(), cat))
}

func TestCategory_Delete(t *testing.T) {
	cr := new(mocks.CategoryRepository)
	uc := usecase.NewCategoryUsecase(cr)
	id := uuid.New()
	cr.On("Delete", mock.Anything, id).Return(nil)
	assert.NoError(t, uc.Delete(context.Background(), id))
}

// ─── ModifierUsecase ───────────────────────────────────────────

func TestModifier_List(t *testing.T) {
	mr := new(mocks.ModifierRepository)
	uc := usecase.NewModifierUsecase(mr)
	mr.On("FindAll", mock.Anything).Return([]domain.ModifierGroup{{Name: "Sugar"}}, nil)
	mods, err := uc.List(context.Background())
	assert.NoError(t, err)
	assert.Len(t, mods, 1)
}

func TestModifier_GetByID(t *testing.T) {
	mr := new(mocks.ModifierRepository)
	uc := usecase.NewModifierUsecase(mr)
	id := uuid.New()
	mr.On("FindByID", mock.Anything, id).Return(&domain.ModifierGroup{ID: id}, nil)
	mod, err := uc.GetByID(context.Background(), id)
	assert.NoError(t, err)
	assert.Equal(t, id, mod.ID)
}

func TestModifier_Create(t *testing.T) {
	mr := new(mocks.ModifierRepository)
	uc := usecase.NewModifierUsecase(mr)
	g := &domain.ModifierGroup{Name: "Size"}
	mr.On("Create", mock.Anything, g).Return(nil)
	assert.NoError(t, uc.Create(context.Background(), g))
}

func TestModifier_Update(t *testing.T) {
	mr := new(mocks.ModifierRepository)
	uc := usecase.NewModifierUsecase(mr)
	g := &domain.ModifierGroup{ID: uuid.New(), Name: "Updated"}
	mr.On("Update", mock.Anything, g).Return(nil)
	assert.NoError(t, uc.Update(context.Background(), g))
}

func TestModifier_Delete(t *testing.T) {
	mr := new(mocks.ModifierRepository)
	uc := usecase.NewModifierUsecase(mr)
	id := uuid.New()
	mr.On("Delete", mock.Anything, id).Return(nil)
	assert.NoError(t, uc.Delete(context.Background(), id))
}
