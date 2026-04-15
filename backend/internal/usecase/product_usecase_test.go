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
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func TestProduct_List(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	filter := repository.ProductFilter{Page: 1, PerPage: 20}
	pr.On("FindAll", mock.Anything, filter).Return([]domain.Product{{Name: "Latte"}}, int64(1), nil)
	products, total, err := uc.List(context.Background(), filter)
	assert.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Len(t, products, 1)
}

func TestProduct_GetByID(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	id := uuid.New()
	pr.On("FindByID", mock.Anything, id).Return(&domain.Product{ID: id, Name: "Latte"}, nil)
	p, err := uc.GetByID(context.Background(), id)
	assert.NoError(t, err)
	assert.Equal(t, "Latte", p.Name)
}

func TestProduct_GetByID_NotFound(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	id := uuid.New()
	pr.On("FindByID", mock.Anything, id).Return(nil, errors.New("not found"))
	p, err := uc.GetByID(context.Background(), id)
	assert.Error(t, err)
	assert.Nil(t, p)
}

func TestProduct_Create_WithModifiers(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	p := &domain.Product{Name: "New Product"}
	modIDs := []uuid.UUID{uuid.New(), uuid.New()}
	pr.On("Create", mock.Anything, p).Return(nil)
	pr.On("SetModifierGroups", mock.Anything, p.ID, modIDs).Return(nil)
	assert.NoError(t, uc.Create(context.Background(), p, modIDs))
}

func TestProduct_Create_WithoutModifiers(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	p := &domain.Product{Name: "Simple Product"}
	pr.On("Create", mock.Anything, p).Return(nil)
	assert.NoError(t, uc.Create(context.Background(), p, nil))
}

func TestProduct_Create_Error(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	p := &domain.Product{Name: "Fail"}
	pr.On("Create", mock.Anything, p).Return(errors.New("duplicate"))
	assert.Error(t, uc.Create(context.Background(), p, nil))
}

func TestProduct_Update(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	p := &domain.Product{ID: uuid.New(), Name: "Updated"}
	modIDs := []uuid.UUID{uuid.New()}
	pr.On("Update", mock.Anything, p).Return(nil)
	pr.On("SetModifierGroups", mock.Anything, p.ID, modIDs).Return(nil)
	assert.NoError(t, uc.Update(context.Background(), p, modIDs))
}

func TestProduct_Update_Error(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	p := &domain.Product{ID: uuid.New(), Name: "Fail"}
	pr.On("Update", mock.Anything, p).Return(errors.New("fail"))
	assert.Error(t, uc.Update(context.Background(), p, nil))
}

func TestProduct_UpdateStock(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	id := uuid.New()
	pr.On("UpdateStock", mock.Anything, id, -5).Return(nil)
	assert.NoError(t, uc.UpdateStock(context.Background(), id, -5))
}

func TestProduct_SetAbsoluteStock(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	id := uuid.New()
	pr.On("SetAbsoluteStock", mock.Anything, id, 100).Return(nil)
	assert.NoError(t, uc.SetAbsoluteStock(context.Background(), id, 100))
}

func TestProduct_Delete(t *testing.T) {
	pr := new(mocks.ProductRepository)
	uc := usecase.NewProductUsecase(pr)
	id := uuid.New()
	pr.On("Delete", mock.Anything, id).Return(nil)
	assert.NoError(t, uc.Delete(context.Background(), id))
}
