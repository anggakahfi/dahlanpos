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

func TestOutlet_List(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	or.On("FindAll", mock.Anything).Return([]domain.Outlet{{Name: "Main"}}, nil)
	outlets, err := uc.List(context.Background())
	assert.NoError(t, err)
	assert.Len(t, outlets, 1)
}

func TestOutlet_List_Error(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	or.On("FindAll", mock.Anything).Return([]domain.Outlet(nil), errors.New("db"))
	_, err := uc.List(context.Background())
	assert.Error(t, err)
}

func TestOutlet_GetByID(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	id := uuid.New()
	or.On("FindByID", mock.Anything, id).Return(&domain.Outlet{ID: id, Name: "Main"}, nil)
	o, err := uc.GetByID(context.Background(), id)
	assert.NoError(t, err)
	assert.Equal(t, "Main", o.Name)
}

func TestOutlet_GetByID_NotFound(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	id := uuid.New()
	or.On("FindByID", mock.Anything, id).Return(nil, errors.New("not found"))
	o, err := uc.GetByID(context.Background(), id)
	assert.Error(t, err)
	assert.Nil(t, o)
}

func TestOutlet_Create(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	o := &domain.Outlet{Name: "New"}
	or.On("Create", mock.Anything, o).Return(nil)
	assert.NoError(t, uc.Create(context.Background(), o))
}

func TestOutlet_Update(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	o := &domain.Outlet{ID: uuid.New(), Name: "Updated"}
	or.On("Update", mock.Anything, o).Return(nil)
	assert.NoError(t, uc.Update(context.Background(), o))
}

func TestOutlet_UpdateStatus(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	id := uuid.New()
	or.On("UpdateStatus", mock.Anything, id, domain.OutletInactive).Return(nil)
	assert.NoError(t, uc.UpdateStatus(context.Background(), id, domain.OutletInactive))
}

func TestOutlet_Delete(t *testing.T) {
	or := new(mocks.OutletRepository)
	uc := usecase.NewOutletUsecase(or)
	id := uuid.New()
	or.On("Delete", mock.Anything, id).Return(nil)
	assert.NoError(t, uc.Delete(context.Background(), id))
}
