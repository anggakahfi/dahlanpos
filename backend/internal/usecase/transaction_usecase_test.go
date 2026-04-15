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

// ─── Helper ────────────────────────────────────────────────────

func newTxnUsecase() (*usecase.TransactionUsecase, *mocks.TransactionRepository, *mocks.ActivityLogRepository, *mocks.ProductRepository, *mocks.ShiftRepository) {
	tr := new(mocks.TransactionRepository)
	lr := new(mocks.ActivityLogRepository)
	pr := new(mocks.ProductRepository)
	sr := new(mocks.ShiftRepository)
	uc := usecase.NewTransactionUsecase(tr, lr, pr, sr)
	return uc, tr, lr, pr, sr
}

func validCreateRequest(shiftID, outletID uuid.UUID) domain.CreateTransactionRequest {
	return domain.CreateTransactionRequest{
		ShiftID:       shiftID,
		OutletID:      outletID,
		PaymentMethod: domain.PayCash,
		Subtotal:      15000,
		TaxAmount:     1650,
		TotalAmount:   16650,
		Items: []domain.CreateTransactionItemInput{
			{
				ProductID:   uuid.New(),
				ProductName: "Kopi Susu",
				Quantity:    1,
				UnitPrice:   15000,
			},
		},
	}
}

// ─── CreateTransaction ─────────────────────────────────────────

func TestCreateTransaction_Success(t *testing.T) {
	uc, tr, lr, _, sr := newTxnUsecase()
	userID := uuid.New()
	shiftID := uuid.New()
	outletID := uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, Status: domain.ShiftOpen,
	}, nil)
	tr.On("Create", mock.Anything, mock.AnythingOfType("*domain.Transaction")).Return(nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	req := validCreateRequest(shiftID, outletID)
	txn, err := uc.CreateTransaction(context.Background(), req, userID)

	assert.NoError(t, err)
	assert.NotNil(t, txn)
	assert.Equal(t, domain.PaymentPaid, txn.PaymentStatus)
	assert.Equal(t, domain.PayCash, txn.PaymentMethod)
	tr.AssertExpectations(t)
}

func TestCreateTransaction_Fail_ShiftNotFound(t *testing.T) {
	uc, _, _, _, sr := newTxnUsecase()
	userID, shiftID, outletID := uuid.New(), uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(nil, errors.New("not found"))

	req := validCreateRequest(shiftID, outletID)
	txn, err := uc.CreateTransaction(context.Background(), req, userID)

	assert.Error(t, err)
	assert.Nil(t, txn)
	assert.Contains(t, err.Error(), "shift tidak ditemukan")
}

func TestCreateTransaction_Fail_ShiftAlreadyClosed(t *testing.T) {
	uc, _, _, _, sr := newTxnUsecase()
	userID, shiftID, outletID := uuid.New(), uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, Status: domain.ShiftClosed,
	}, nil)

	req := validCreateRequest(shiftID, outletID)
	txn, err := uc.CreateTransaction(context.Background(), req, userID)

	assert.Error(t, err)
	assert.Nil(t, txn)
	assert.Contains(t, err.Error(), "shift sudah ditutup")
}

func TestCreateTransaction_SubtotalFallback(t *testing.T) {
	uc, tr, lr, _, sr := newTxnUsecase()
	userID, shiftID, outletID := uuid.New(), uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, Status: domain.ShiftOpen,
	}, nil)
	tr.On("Create", mock.Anything, mock.AnythingOfType("*domain.Transaction")).Return(nil)
	lr.On("Create", mock.Anything, mock.Anything).Return(nil)

	req := validCreateRequest(shiftID, outletID)
	req.Subtotal = 0 // Frontend mengirim 0
	req.TotalAmount = 0

	txn, err := uc.CreateTransaction(context.Background(), req, userID)

	assert.NoError(t, err)
	assert.NotNil(t, txn)
	// Should be calculated from items: 1 × 15000 = 15000
	assert.Equal(t, float64(15000), txn.Subtotal)
}

func TestCreateTransaction_WithModifiers(t *testing.T) {
	uc, tr, lr, _, sr := newTxnUsecase()
	userID, shiftID, outletID := uuid.New(), uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, Status: domain.ShiftOpen,
	}, nil)
	tr.On("Create", mock.Anything, mock.AnythingOfType("*domain.Transaction")).Return(nil)
	lr.On("Create", mock.Anything, mock.Anything).Return(nil)

	req := domain.CreateTransactionRequest{
		ShiftID:       shiftID,
		OutletID:      outletID,
		PaymentMethod: domain.PayCash,
		Subtotal:      0,
		TotalAmount:   0,
		Items: []domain.CreateTransactionItemInput{
			{
				ProductID:   uuid.New(),
				ProductName: "Kopi Susu",
				Quantity:    2,
				UnitPrice:   15000,
				Modifiers: []domain.SelectedModifier{
					{GroupName: "Extra Shot", SelectedOption: "Double", PriceImpact: 5000},
				},
			},
		},
	}

	txn, err := uc.CreateTransaction(context.Background(), req, userID)

	assert.NoError(t, err)
	assert.NotNil(t, txn)
	// 2 × (15000 + 5000) = 40000
	assert.Equal(t, float64(40000), txn.Subtotal)
}

func TestCreateTransaction_LogsActivity(t *testing.T) {
	uc, tr, lr, _, sr := newTxnUsecase()
	userID, shiftID, outletID := uuid.New(), uuid.New(), uuid.New()

	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, Status: domain.ShiftOpen,
	}, nil)
	tr.On("Create", mock.Anything, mock.Anything).Return(nil)
	lr.On("Create", mock.Anything, mock.AnythingOfType("*domain.ActivityLog")).Return(nil)

	req := validCreateRequest(shiftID, outletID)
	_, _ = uc.CreateTransaction(context.Background(), req, userID)

	lr.AssertCalled(t, "Create", mock.Anything, mock.MatchedBy(func(log *domain.ActivityLog) bool {
		return log.ActivityType == domain.ActivityTransaction
	}))
}

// ─── VoidTransaction ───────────────────────────────────────────

func TestVoidTransaction_Success(t *testing.T) {
	uc, tr, lr, _, sr := newTxnUsecase()
	userID := uuid.New()
	txnID := uuid.New()
	shiftID := uuid.New()

	tr.On("FindByID", mock.Anything, txnID).Return(&domain.Transaction{
		ID: txnID, ShiftID: shiftID, PaymentStatus: domain.PaymentPaid,
	}, nil)
	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, UserID: userID,
	}, nil)
	tr.On("Void", mock.Anything, txnID).Return(nil)
	lr.On("Create", mock.Anything, mock.Anything).Return(nil)

	err := uc.VoidTransaction(context.Background(), txnID, userID)

	assert.NoError(t, err)
	tr.AssertCalled(t, "Void", mock.Anything, txnID)
}

func TestVoidTransaction_Fail_NotFound(t *testing.T) {
	uc, tr, _, _, _ := newTxnUsecase()

	txnID := uuid.New()
	tr.On("FindByID", mock.Anything, txnID).Return(nil, errors.New("not found"))

	err := uc.VoidTransaction(context.Background(), txnID, uuid.New())

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "transaksi tidak ditemukan")
}

func TestVoidTransaction_Fail_AlreadyVoided(t *testing.T) {
	uc, tr, _, _, _ := newTxnUsecase()

	txnID := uuid.New()
	tr.On("FindByID", mock.Anything, txnID).Return(&domain.Transaction{
		ID: txnID, PaymentStatus: domain.PaymentVoid,
	}, nil)

	err := uc.VoidTransaction(context.Background(), txnID, uuid.New())

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "sudah di-void")
}

func TestVoidTransaction_Fail_NotShiftOwner(t *testing.T) {
	uc, tr, _, _, sr := newTxnUsecase()
	ownerID := uuid.New()
	attackerID := uuid.New()
	txnID := uuid.New()
	shiftID := uuid.New()

	tr.On("FindByID", mock.Anything, txnID).Return(&domain.Transaction{
		ID: txnID, ShiftID: shiftID, PaymentStatus: domain.PaymentPaid,
	}, nil)
	sr.On("FindByID", mock.Anything, shiftID).Return(&domain.Shift{
		ID: shiftID, UserID: ownerID,
	}, nil)

	err := uc.VoidTransaction(context.Background(), txnID, attackerID)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "tidak berhak")
}

// ─── ListTransactions ──────────────────────────────────────────

func TestListTransactions(t *testing.T) {
	uc, tr, _, _, _ := newTxnUsecase()
	filter := repository.TransactionFilter{Page: 1, PerPage: 10}
	
	tr.On("FindAll", mock.Anything, filter).Return([]domain.Transaction{{ID: uuid.New()}}, int64(1), float64(100), nil)

	txns, total, rev, err := uc.ListTransactions(context.Background(), filter)
	
	assert.NoError(t, err)
	assert.Len(t, txns, 1)
	assert.Equal(t, int64(1), total)
	assert.Equal(t, float64(100), rev)
}

// ─── GetTransaction ────────────────────────────────────────────

func TestGetTransaction(t *testing.T) {
	uc, tr, _, _, _ := newTxnUsecase()
	id := uuid.New()

	tr.On("FindByID", mock.Anything, id).Return(&domain.Transaction{ID: id}, nil)

	txn, err := uc.GetTransaction(context.Background(), id)

	assert.NoError(t, err)
	assert.NotNil(t, txn)
	assert.Equal(t, id, txn.ID)
}

