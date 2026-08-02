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

// ─── Helper ────────────────────────────────────────────────────

func newShiftUsecase() (*usecase.ShiftUsecase, *mocks.ShiftRepository, *mocks.TransactionRepository, *mocks.ActivityLogRepository, *mocks.OutletRepository) {
	sr := new(mocks.ShiftRepository)
	tr := new(mocks.TransactionRepository)
	lr := new(mocks.ActivityLogRepository)
	or := new(mocks.OutletRepository)
	uc := usecase.NewShiftUsecase(sr, tr, lr, or)
	return uc, sr, tr, lr, or
}

// ─── OpenShift ─────────────────────────────────────────────────

func TestOpenShift_Success_NoOperationalHours(t *testing.T) {
	uc, sr, _, lr, or := newShiftUsecase()
	userID, outletID := uuid.New(), uuid.New()

	sr.On("FindOpenByUser", mock.Anything, userID).Return(nil, errors.New("no rows"))
	or.On("FindByID", mock.Anything, outletID).Return(&domain.Outlet{ID: outletID, Name: "Test"}, nil)
	sr.On("Create", mock.Anything, mock.AnythingOfType("*domain.Shift")).Return(nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	shift, err := uc.OpenShift(context.Background(), userID, outletID, 100000)

	assert.NoError(t, err)
	assert.NotNil(t, shift)
	assert.Equal(t, domain.ShiftOpen, shift.Status)
	assert.Equal(t, float64(100000), shift.StartingCash)
	sr.AssertExpectations(t)
	or.AssertExpectations(t)
}

func TestOpenShift_Fail_AlreadyHasActiveShift(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	userID, outletID := uuid.New(), uuid.New()

	existing := &domain.Shift{ID: uuid.New(), Status: domain.ShiftOpen}
	sr.On("FindOpenByUser", mock.Anything, userID).Return(existing, nil)

	shift, err := uc.OpenShift(context.Background(), userID, outletID, 100000)

	assert.Error(t, err)
	assert.Nil(t, shift)
	assert.Contains(t, err.Error(), "shift aktif")
}

func TestOpenShift_Fail_OutletNotFound(t *testing.T) {
	uc, sr, _, _, or := newShiftUsecase()
	userID, outletID := uuid.New(), uuid.New()

	sr.On("FindOpenByUser", mock.Anything, userID).Return(nil, errors.New("no rows"))
	or.On("FindByID", mock.Anything, outletID).Return(nil, errors.New("not found"))

	shift, err := uc.OpenShift(context.Background(), userID, outletID, 100000)

	assert.Error(t, err)
	assert.Nil(t, shift)
	assert.Contains(t, err.Error(), "outlet tidak ditemukan")
}

func TestOpenShift_Fail_OutsideOperationalHours(t *testing.T) {
	uc, sr, _, _, or := newShiftUsecase()
	userID, outletID := uuid.New(), uuid.New()

	sr.On("FindOpenByUser", mock.Anything, userID).Return(nil, errors.New("no rows"))
	// Outlet jam 08:00 - 10:00 (sangat sempit, pasti di luar jam saat test run real-time)
	// Ini menguji bahwa logika jam operasional berjalan, walaupun hasilnya tergantung waktu eksekusi.
	or.On("FindByID", mock.Anything, outletID).Return(&domain.Outlet{
		ID: outletID, Name: "Test",
		OpenTime: "03:00:00", CloseTime: "03:01:00",
	}, nil)

	shift, err := uc.OpenShift(context.Background(), userID, outletID, 100000)

	// Dengan window jam 1 menit di tengah malam, hampir pasti di luar jam operasional
	assert.Error(t, err)
	assert.Nil(t, shift)
	assert.Contains(t, err.Error(), "outlet sedang tutup")
}

func TestOpenShift_LogsActivity(t *testing.T) {
	uc, sr, _, lr, or := newShiftUsecase()
	userID, outletID := uuid.New(), uuid.New()

	sr.On("FindOpenByUser", mock.Anything, userID).Return(nil, errors.New("no rows"))
	or.On("FindByID", mock.Anything, outletID).Return(&domain.Outlet{ID: outletID}, nil)
	sr.On("Create", mock.Anything, mock.Anything).Return(nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	_, _ = uc.OpenShift(context.Background(), userID, outletID, 50000)

	lr.AssertCalled(t, "Create", mock.Anything, mock.MatchedBy(func(log *domain.ActivityLog) bool {
		return log.ActivityType == domain.ActivityStartShift
	}))
}

// ─── CloseShift ────────────────────────────────────────────────

func TestCloseShift_DiscrepancyCalculation(t *testing.T) {
	tests := []struct {
		name         string
		startingCash float64
		cashSales    float64
		endingCash   float64
		wantDiscrep  float64
	}{
		{"Positif (kelebihan kas)", 100000, 50000, 160000, 10000},
		{"Negatif (kekurangan kas)", 100000, 50000, 140000, -10000},
		{"Match (pas)", 100000, 50000, 150000, 0},
		{"Nol penjualan", 70000, 0, 70000, 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			uc, sr, tr, lr, _ := newShiftUsecase()
			userID, shiftID := uuid.New(), uuid.New()

			sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
				ID: shiftID, UserID: userID,
				StartingCash: tt.startingCash, Status: domain.ShiftOpen,
			}, nil)
			tr.On("SumCashByShift", mock.Anything, shiftID).Return(tt.cashSales, nil)
			sr.On("Close", mock.Anything, mock.Anything).Return(nil)
			lr.On("Create", mock.Anything, mock.Anything).Return(nil)

			shift, err := uc.CloseShift(context.Background(), shiftID, userID, tt.endingCash, "test note")

			assert.NoError(t, err)
			assert.NotNil(t, shift)
			assert.InDelta(t, tt.wantDiscrep, *shift.Discrepancy, 0.01)

			expectedCash := tt.startingCash + tt.cashSales
			assert.InDelta(t, expectedCash, *shift.ExpectedCash, 0.01)
		})
	}
}

func TestCloseShift_Fail_ShiftNotFound(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	shiftID, userID := uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(nil, errors.New("not found"))

	shift, err := uc.CloseShift(context.Background(), shiftID, userID, 100000, "")

	assert.Error(t, err)
	assert.Nil(t, shift)
	assert.Contains(t, err.Error(), "shift tidak ditemukan")
}

func TestCloseShift_Fail_AlreadyClosed(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	shiftID, userID := uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, UserID: userID, Status: domain.ShiftClosed,
	}, nil)

	shift, err := uc.CloseShift(context.Background(), shiftID, userID, 100000, "")

	assert.Error(t, err)
	assert.Nil(t, shift)
	assert.Contains(t, err.Error(), "sudah ditutup")
}

func TestCloseShift_Fail_NotOwner(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	shiftID := uuid.New()
	ownerID := uuid.New()
	attackerID := uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, UserID: ownerID, Status: domain.ShiftOpen,
	}, nil)

	shift, err := uc.CloseShift(context.Background(), shiftID, attackerID, 100000, "")

	assert.Error(t, err)
	assert.Nil(t, shift)
	assert.Contains(t, err.Error(), "tidak berhak")
}

func TestCloseShift_LogsActivity(t *testing.T) {
	uc, sr, tr, lr, _ := newShiftUsecase()
	userID, shiftID := uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, UserID: userID, StartingCash: 100000, Status: domain.ShiftOpen,
	}, nil)
	tr.On("SumCashByShift", mock.Anything, shiftID).Return(float64(0), nil)
	sr.On("Close", mock.Anything, mock.Anything).Return(nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	_, _ = uc.CloseShift(context.Background(), shiftID, userID, 100000, "")

	lr.AssertCalled(t, "Create", mock.Anything, mock.MatchedBy(func(log *domain.ActivityLog) bool {
		return log.ActivityType == domain.ActivityEndShift
	}))
}

// ─── GetShiftSummary ───────────────────────────────────────────

func TestGetShiftSummary_Success(t *testing.T) {
	uc, sr, tr, _, _ := newShiftUsecase()
	shiftID := uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, StartingCash: 100000,
	}, nil)
	tr.On("GetShiftSummary", mock.Anything, shiftID).Return(&domain.ShiftSummary{
		ShiftID: shiftID, CashSales: 50000, TotalSales: 80000,
	}, nil)

	summary, err := uc.GetShiftSummary(context.Background(), shiftID)

	assert.NoError(t, err)
	assert.NotNil(t, summary)
	assert.Equal(t, float64(100000), summary.StartingCash)
	assert.Equal(t, float64(150000), summary.ExpectedCash) // 100000 + 50000
}

func TestGetShiftSummary_Fail_ShiftNotFound(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	shiftID := uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(nil, errors.New("not found"))

	summary, err := uc.GetShiftSummary(context.Background(), shiftID)

	assert.Error(t, err)
	assert.Nil(t, summary)
	assert.Contains(t, err.Error(), "shift tidak ditemukan")
}

// ─── ListShifts ────────────────────────────────────────────────

func TestListShifts(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	
	sr.On("FindAll", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, 1, 10).
		Return([]domain.Shift{{ID: uuid.New()}}, int64(1), nil)

	shifts, total, err := uc.ListShifts(context.Background(), nil, nil, nil, nil, 1, 10)

	assert.NoError(t, err)
	assert.Len(t, shifts, 1)
	assert.Equal(t, int64(1), total)
}

// ─── GetShiftSummaryByID ───────────────────────────────────────

func TestGetShiftSummaryByID(t *testing.T) {
	uc, sr, tr, _, _ := newShiftUsecase()
	shiftID := uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{ID: shiftID, StartingCash: 100}, nil)
	tr.On("GetShiftSummary", mock.Anything, shiftID).Return(&domain.ShiftSummary{ShiftID: shiftID}, nil)

	summary, err := uc.GetShiftSummaryByID(context.Background(), shiftID)

	assert.NoError(t, err)
	assert.NotNil(t, summary)
	assert.Equal(t, shiftID, summary.ShiftID)
}

// ─── GetCurrentShift ───────────────────────────────────────────

func TestGetCurrentShift(t *testing.T) {
	uc, sr, _, _, _ := newShiftUsecase()
	userID := uuid.New()

	sr.On("FindOpenByUser", mock.Anything, userID).Return(&domain.Shift{UserID: userID, Status: domain.ShiftOpen}, nil)

	shift, err := uc.GetCurrentShift(context.Background(), userID)

	assert.NoError(t, err)
	assert.NotNil(t, shift)
	assert.Equal(t, userID, shift.UserID)
}

