package usecase_test

import (
	"context"
	"errors"
	"os"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/mocks"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

const testJWTSecret = "unit-test-secret-key-12345"

func newAuthUsecase() (*usecase.AuthUsecase, *mocks.UserRepository, *mocks.ActivityLogRepository) {
	ur := new(mocks.UserRepository)
	lr := new(mocks.ActivityLogRepository)
	// Empty googleClientID triggers dev bypass when GIN_MODE != release
	uc := usecase.NewAuthUsecase(ur, lr, testJWTSecret, "")
	return uc, ur, lr
}

// ─── LoginWithOAuth (Dev Bypass Mode) ──────────────────────────

func TestLogin_DevBypass_Success(t *testing.T) {
	os.Setenv("GIN_MODE", "debug")
	defer os.Unsetenv("GIN_MODE")

	uc, ur, lr := newAuthUsecase()

	userID := uuid.New()
	outletID := uuid.New()
	user := &domain.User{
		ID:       userID,
		Email:    "kahfi@test.com",
		Name:     "Kahfi",
		Role:     domain.RoleCashier,
		Status:   domain.StatusActive,
		OutletID: &outletID,
	}

	ur.On("FindByEmail", mock.Anything, "kahfi@test.com").Return(user, nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	resp, err := uc.LoginWithOAuth(context.Background(), "kahfi@test.com")

	assert.NoError(t, err)
	assert.NotNil(t, resp)
	assert.NotEmpty(t, resp.Token)
	assert.Equal(t, "kahfi@test.com", resp.User.Email)
	assert.Equal(t, domain.RoleCashier, resp.User.Role)
}

func TestLogin_Fail_EmailNotRegistered(t *testing.T) {
	os.Setenv("GIN_MODE", "debug")
	defer os.Unsetenv("GIN_MODE")

	uc, ur, _ := newAuthUsecase()
	ur.On("FindByEmail", mock.Anything, "unknown@test.com").Return(nil, errors.New("not found"))

	resp, err := uc.LoginWithOAuth(context.Background(), "unknown@test.com")

	assert.Error(t, err)
	assert.Nil(t, resp)
	assert.Contains(t, err.Error(), "email tidak terdaftar")
}

func TestLogin_Fail_InactiveAccount(t *testing.T) {
	os.Setenv("GIN_MODE", "debug")
	defer os.Unsetenv("GIN_MODE")

	uc, ur, _ := newAuthUsecase()
	user := &domain.User{
		ID:     uuid.New(),
		Email:  "inactive@test.com",
		Status: domain.StatusInactive,
	}
	ur.On("FindByEmail", mock.Anything, "inactive@test.com").Return(user, nil)

	resp, err := uc.LoginWithOAuth(context.Background(), "inactive@test.com")

	assert.Error(t, err)
	assert.Nil(t, resp)
	assert.Contains(t, err.Error(), "dinonaktifkan")
}

func TestLogin_JWT_ContainsCorrectClaims(t *testing.T) {
	os.Setenv("GIN_MODE", "debug")
	defer os.Unsetenv("GIN_MODE")

	uc, ur, lr := newAuthUsecase()
	userID := uuid.New()
	outletID := uuid.New()
	user := &domain.User{
		ID:       userID,
		Email:    "test@test.com",
		Role:     domain.RoleCashier,
		Status:   domain.StatusActive,
		OutletID: &outletID,
	}

	ur.On("FindByEmail", mock.Anything, "test@test.com").Return(user, nil)
	lr.On("Create", mock.Anything, mock.Anything).Return(nil)

	resp, err := uc.LoginWithOAuth(context.Background(), "test@test.com")
	assert.NoError(t, err)

	// Parse the JWT token to verify claims
	token, parseErr := jwt.Parse(resp.Token, func(token *jwt.Token) (interface{}, error) {
		return []byte(testJWTSecret), nil
	})
	assert.NoError(t, parseErr)
	assert.True(t, token.Valid)

	claims := token.Claims.(jwt.MapClaims)
	assert.Equal(t, userID.String(), claims["user_id"])
	assert.Equal(t, "test@test.com", claims["email"])
	assert.Equal(t, "cashier", claims["role"])
	assert.Equal(t, outletID.String(), claims["outlet_id"])
}

func TestLogin_JWT_OwnerHasEmptyOutletID(t *testing.T) {
	os.Setenv("GIN_MODE", "debug")
	defer os.Unsetenv("GIN_MODE")

	uc, ur, lr := newAuthUsecase()
	user := &domain.User{
		ID:       uuid.New(),
		Email:    "owner@test.com",
		Role:     domain.RoleOwner,
		Status:   domain.StatusActive,
		OutletID: nil, // Owner has no outlet
	}

	ur.On("FindByEmail", mock.Anything, "owner@test.com").Return(user, nil)
	lr.On("Create", mock.Anything, mock.Anything).Return(nil)

	resp, err := uc.LoginWithOAuth(context.Background(), "owner@test.com")
	assert.NoError(t, err)

	token, _ := jwt.Parse(resp.Token, func(token *jwt.Token) (interface{}, error) {
		return []byte(testJWTSecret), nil
	})
	claims := token.Claims.(jwt.MapClaims)
	assert.Equal(t, "", claims["outlet_id"])
}

func TestLogin_LogsActivity(t *testing.T) {
	os.Setenv("GIN_MODE", "debug")
	defer os.Unsetenv("GIN_MODE")

	uc, ur, lr := newAuthUsecase()
	user := &domain.User{
		ID: uuid.New(), Email: "log@test.com",
		Role: domain.RoleCashier, Status: domain.StatusActive,
	}
	ur.On("FindByEmail", mock.Anything, "log@test.com").Return(user, nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	_, _ = uc.LoginWithOAuth(context.Background(), "log@test.com")

	lr.AssertCalled(t, "Create", mock.Anything, mock.MatchedBy(func(log *domain.ActivityLog) bool {
		return log.ActivityType == domain.ActivityLogin
	}))
}

func TestLogin_ReleaseMode_GoogleValidationFail(t *testing.T) {
	os.Setenv("GIN_MODE", "release")
	defer os.Setenv("GIN_MODE", "debug") // Reset back

	uc, _, _ := newAuthUsecase()

	// Should fail because it attempts to validate against Google using a dummy token
	resp, err := uc.LoginWithOAuth(context.Background(), "invalid-google-token-xxxxx")

	assert.Error(t, err)
	assert.Nil(t, resp)
}

