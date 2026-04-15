package usecase_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/mocks"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func TestSettings_Get(t *testing.T) {
	sr := new(mocks.SettingsRepository)
	uc := usecase.NewSettingsUsecase(sr)
	sr.On("Get", mock.Anything).Return(&domain.Settings{
		Tax: domain.SettingsTax{Enabled: true, Rate: 11, Name: "PPN", Type: "exclusive"},
	}, nil)
	s, err := uc.Get(context.Background())
	assert.NoError(t, err)
	assert.True(t, s.Tax.Enabled)
	assert.Equal(t, float64(11), s.Tax.Rate)
}

func TestSettings_Get_Error(t *testing.T) {
	sr := new(mocks.SettingsRepository)
	uc := usecase.NewSettingsUsecase(sr)
	sr.On("Get", mock.Anything).Return(nil, errors.New("not found"))
	s, err := uc.Get(context.Background())
	assert.Error(t, err)
	assert.Nil(t, s)
}

func TestSettings_Update(t *testing.T) {
	sr := new(mocks.SettingsRepository)
	uc := usecase.NewSettingsUsecase(sr)
	s := &domain.Settings{
		Payment: domain.SettingsPayment{CashEnabled: true, QRISEnabled: false},
	}
	sr.On("Update", mock.Anything, s).Return(nil)
	assert.NoError(t, uc.Update(context.Background(), s))
}

func TestSettings_Update_Error(t *testing.T) {
	sr := new(mocks.SettingsRepository)
	uc := usecase.NewSettingsUsecase(sr)
	s := &domain.Settings{}
	sr.On("Update", mock.Anything, s).Return(errors.New("constraint violation"))
	assert.Error(t, uc.Update(context.Background(), s))
}
