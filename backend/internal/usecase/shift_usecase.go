package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// ShiftUsecase handles shift lifecycle operations.
type ShiftUsecase struct {
	shiftRepo repository.ShiftRepository
	txnRepo   repository.TransactionRepository
	logRepo   repository.ActivityLogRepository
}

func NewShiftUsecase(sr repository.ShiftRepository, tr repository.TransactionRepository, lr repository.ActivityLogRepository) *ShiftUsecase {
	return &ShiftUsecase{shiftRepo: sr, txnRepo: tr, logRepo: lr}
}

// ListShifts returns a paginated list of shifts for reports.
func (uc *ShiftUsecase) ListShifts(ctx context.Context, outletID *uuid.UUID, page, perPage int) ([]domain.Shift, int64, error) {
	return uc.shiftRepo.FindAll(ctx, outletID, page, perPage)
}

// OpenShift creates a new shift for a cashier.
func (uc *ShiftUsecase) OpenShift(ctx context.Context, userID, outletID uuid.UUID, startingCash float64) (*domain.Shift, error) {
	// Check for existing open shift
	existing, err := uc.shiftRepo.FindOpenByUser(ctx, userID)
	if err == nil && existing != nil {
		return nil, errors.New("anda masih memiliki shift aktif, tutup dulu sebelum membuka yang baru")
	}

	shift := &domain.Shift{
		UserID:       userID,
		OutletID:     outletID,
		StartingCash: startingCash,
		Status:       domain.ShiftOpen,
	}
	if err := uc.shiftRepo.Create(ctx, shift); err != nil {
		return nil, err
	}

	_ = uc.logRepo.Create(ctx, &domain.ActivityLog{
		UserID: userID, OutletID: &outletID,
		ActivityType: domain.ActivityStartShift,
		Details:      "Shift opened",
	})

	return shift, nil
}

// GetCurrentShift returns the currently open shift for a user.
func (uc *ShiftUsecase) GetCurrentShift(ctx context.Context, userID uuid.UUID) (*domain.Shift, error) {
	return uc.shiftRepo.FindOpenByUser(ctx, userID)
}

// CloseShift closes the active shift and calculates cash discrepancy.
func (uc *ShiftUsecase) CloseShift(ctx context.Context, shiftID uuid.UUID, endingCash float64, discrepancyNote string) (*domain.Shift, error) {
	shift, err := uc.shiftRepo.FindByID(ctx, shiftID)
	if err != nil {
		return nil, errors.New("shift tidak ditemukan")
	}
	if shift.Status == domain.ShiftClosed {
		return nil, errors.New("shift sudah ditutup")
	}

	// Calculate expected cash = starting_cash + total cash transactions in this shift
	cashSales, err := uc.txnRepo.SumCashByShift(ctx, shiftID)
	if err != nil {
		return nil, err
	}

	expectedCash := shift.StartingCash + cashSales
	discrepancy := endingCash - expectedCash

	shift.EndingCash = &endingCash
	shift.ExpectedCash = &expectedCash
	shift.Discrepancy = &discrepancy
	shift.DiscrepancyNote = discrepancyNote

	if err := uc.shiftRepo.Close(ctx, shift); err != nil {
		return nil, err
	}

	_ = uc.logRepo.Create(ctx, &domain.ActivityLog{
		UserID: shift.UserID, OutletID: &shift.OutletID,
		ActivityType: domain.ActivityEndShift,
		Details:      "Shift closed",
	})

	return shift, nil
}
