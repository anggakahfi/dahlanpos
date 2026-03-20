package usecase

import (
	"context"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type SettingsUsecase struct{ repo repository.SettingsRepository }

func NewSettingsUsecase(r repository.SettingsRepository) *SettingsUsecase { return &SettingsUsecase{repo: r} }

func (uc *SettingsUsecase) Get(ctx context.Context) (*domain.Settings, error)              { return uc.repo.Get(ctx) }
func (uc *SettingsUsecase) Update(ctx context.Context, s *domain.Settings) error           { return uc.repo.Update(ctx, s) }
