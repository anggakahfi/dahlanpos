package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// ShiftUsecase handles shift lifecycle operations.
type ShiftUsecase struct {
	shiftRepo repository.ShiftRepository
	txnRepo   repository.TransactionRepository
	logRepo   repository.ActivityLogRepository
	outletRepo repository.OutletRepository
}

func NewShiftUsecase(sr repository.ShiftRepository, tr repository.TransactionRepository, lr repository.ActivityLogRepository, or repository.OutletRepository) *ShiftUsecase {
	return &ShiftUsecase{shiftRepo: sr, txnRepo: tr, logRepo: lr, outletRepo: or}
}

// ListShifts returns a paginated list of shifts for reports.
func (uc *ShiftUsecase) ListShifts(ctx context.Context, outletID *uuid.UUID, userID *uuid.UUID, startDate *time.Time, endDate *time.Time, page, perPage int) ([]domain.Shift, int64, error) {
	return uc.shiftRepo.FindAll(ctx, outletID, userID, startDate, endDate, page, perPage)
}

// GetShiftSummaryByID returns summary data for any specific shift (for backoffice).
func (uc *ShiftUsecase) GetShiftSummaryByID(ctx context.Context, shiftID uuid.UUID) (*domain.ShiftSummary, error) {
	return uc.GetShiftSummary(ctx, shiftID)
}

// OpenShift creates a new shift for a cashier.
func (uc *ShiftUsecase) OpenShift(ctx context.Context, userID, outletID uuid.UUID, startingCash float64) (*domain.Shift, error) {
	// Check for existing open shift
	existing, err := uc.shiftRepo.FindOpenByUser(ctx, userID)
	if err == nil && existing != nil {
		return nil, errors.New("anda masih memiliki shift aktif, tutup dulu sebelum membuka yang baru")
	}

	// Validate operasional hours
	outlet, err := uc.outletRepo.FindByID(ctx, outletID)
	if err != nil {
		return nil, errors.New("outlet tidak ditemukan")
	}

	if err := checkOperatingHours(outlet, 0); err != nil {
		return nil, err
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
func (uc *ShiftUsecase) CloseShift(ctx context.Context, shiftID uuid.UUID, userID uuid.UUID, endingCash float64, discrepancyNote string) (*domain.Shift, error) {
	shift, err := uc.shiftRepo.FindByID(ctx, shiftID)
	if err != nil {
		return nil, errors.New("shift tidak ditemukan")
	}
	if shift.Status == domain.ShiftClosed {
		return nil, errors.New("shift sudah ditutup")
	}

	// BUG-02 FIX: Validate that the shift belongs to the requesting user
	if shift.UserID != userID {
		return nil, errors.New("anda tidak berhak menutup shift milik karyawan lain")
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
	shift.DiscrepancyNote = &discrepancyNote

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

// GetShiftSummary returns the current calculated summary for a shift.
func (uc *ShiftUsecase) GetShiftSummary(ctx context.Context, shiftID uuid.UUID) (*domain.ShiftSummary, error) {
	shift, err := uc.shiftRepo.FindByID(ctx, shiftID)
	if err != nil {
		return nil, errors.New("shift tidak ditemukan")
	}

	summary, err := uc.txnRepo.GetShiftSummary(ctx, shiftID)
	if err != nil {
		return nil, err
	}

	summary.StartingCash = shift.StartingCash
	summary.ExpectedCash = shift.StartingCash + summary.CashSales
	
	// Add mock card sales to total if the frontend still needs Card sales mock, although we use QRIS
	// Or maybe card sales is just 0 since we don't have Card DB value yet.
	summary.CardSales = 0 

	return summary, nil
}
