package usecase_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/mocks"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func newEmployeeUsecase() (*usecase.EmployeeUsecase, *mocks.UserRepository, *mocks.ActivityLogRepository) {
	ur := new(mocks.UserRepository)
	lr := new(mocks.ActivityLogRepository)
	uc := usecase.NewEmployeeUsecase(ur, lr, "") // no resend key
	return uc, ur, lr
}

func TestEmployee_List(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	ur.On("FindAll", mock.Anything).Return([]domain.User{{Name: "Kahfi"}}, nil)
	users, err := uc.List(context.Background())
	assert.NoError(t, err)
	assert.Len(t, users, 1)
}

func TestEmployee_List_Error(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	ur.On("FindAll", mock.Anything).Return([]domain.User(nil), errors.New("db error"))
	_, err := uc.List(context.Background())
	assert.Error(t, err)
}

func TestEmployee_GetByID(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	id := uuid.New()
	ur.On("FindByID", mock.Anything, id).Return(&domain.User{ID: id, Name: "Kahfi"}, nil)
	user, err := uc.GetByID(context.Background(), id)
	assert.NoError(t, err)
	assert.Equal(t, "Kahfi", user.Name)
}

func TestEmployee_GetByID_NotFound(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	id := uuid.New()
	ur.On("FindByID", mock.Anything, id).Return(nil, errors.New("not found"))
	user, err := uc.GetByID(context.Background(), id)
	assert.Error(t, err)
	assert.Nil(t, user)
}

func TestEmployee_Create_DefaultStatus(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	user := &domain.User{Name: "New Employee", Email: "new@test.com"}
	ur.On("Create", mock.Anything, mock.AnythingOfType("*domain.User")).Return(nil)

	err := uc.Create(context.Background(), user)
	assert.NoError(t, err)
	assert.Equal(t, domain.StatusActive, user.Status)
}

func TestEmployee_Create_Error(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	user := &domain.User{Name: "Fail"}
	ur.On("Create", mock.Anything, mock.Anything).Return(errors.New("duplicate email"))

	err := uc.Create(context.Background(), user)
	assert.Error(t, err)
}

func TestEmployee_Create_WithEmail(t *testing.T) {
	ur := new(mocks.UserRepository)
	lr := new(mocks.ActivityLogRepository)
	uc := usecase.NewEmployeeUsecase(ur, lr, "fake-api-key") // set resend key

	user := &domain.User{Name: "New Employee", Email: "new@test.com"}
	ur.On("Create", mock.Anything, mock.AnythingOfType("*domain.User")).Return(nil)

	err := uc.Create(context.Background(), user)
	assert.NoError(t, err)
	// sendWelcomeEmail runs in goroutine but gets covered
	time.Sleep(50 * time.Millisecond)
}



func TestEmployee_Update(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	user := &domain.User{ID: uuid.New(), Name: "Updated"}
	ur.On("Update", mock.Anything, user).Return(nil)
	assert.NoError(t, uc.Update(context.Background(), user))
}

func TestEmployee_UpdateStatus(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	id := uuid.New()
	ur.On("UpdateStatus", mock.Anything, id, domain.StatusInactive).Return(nil)
	assert.NoError(t, uc.UpdateStatus(context.Background(), id, domain.StatusInactive))
}

func TestEmployee_Delete(t *testing.T) {
	uc, ur, _ := newEmployeeUsecase()
	id := uuid.New()
	ur.On("Delete", mock.Anything, id).Return(nil)
	assert.NoError(t, uc.Delete(context.Background(), id))
}

func TestEmployee_ListActivityLogs(t *testing.T) {
	uc, _, lr := newEmployeeUsecase()
	filter := repository.ActivityLogFilter{Page: 1, PerPage: 20}
	lr.On("FindAll", mock.Anything, filter).Return([]domain.ActivityLog{{Details: "login"}}, int64(1), nil)
	logs, total, err := uc.ListActivityLogs(context.Background(), filter)
	assert.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Len(t, logs, 1)
}

func TestEmployee_ListActivityLogs_Error(t *testing.T) {
	uc, _, lr := newEmployeeUsecase()
	filter := repository.ActivityLogFilter{}
	lr.On("FindAll", mock.Anything, filter).Return([]domain.ActivityLog(nil), int64(0), errors.New("db error"))
	_, _, err := uc.ListActivityLogs(context.Background(), filter)
	assert.Error(t, err)
}
