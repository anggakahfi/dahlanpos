package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// TransactionUsecase handles transaction creation and voiding.
type TransactionUsecase struct {
	txnRepo     repository.TransactionRepository
	logRepo     repository.ActivityLogRepository
	productRepo repository.ProductRepository
	shiftRepo   repository.ShiftRepository
	outletRepo  repository.OutletRepository
}

func NewTransactionUsecase(tr repository.TransactionRepository, lr repository.ActivityLogRepository, pr repository.ProductRepository, sr repository.ShiftRepository, or repository.OutletRepository) *TransactionUsecase {
	return &TransactionUsecase{txnRepo: tr, logRepo: lr, productRepo: pr, shiftRepo: sr, outletRepo: or}
}

// CreateTransaction processes a new sale with stock deduction.
func (uc *TransactionUsecase) CreateTransaction(ctx context.Context, req domain.CreateTransactionRequest, userID uuid.UUID) (*domain.Transaction, error) {
	// BUG-01 FIX: Validate that the shift is still open before creating transaction
	shift, err := uc.shiftRepo.FindByID(ctx, req.ShiftID)
	if err != nil {
		return nil, errors.New("shift tidak ditemukan")
	}
	if shift.Status != domain.ShiftOpen {
		return nil, errors.New("shift sudah ditutup, tidak bisa membuat transaksi baru")
	}

	outlet, err := uc.outletRepo.FindByID(ctx, req.OutletID)
	if err != nil {
		return nil, errors.New("outlet tidak ditemukan")
	}

	if err := checkShiftExpiration(shift, outlet); err != nil {
		return nil, err
	}

	// Calculate subtotal
	var subtotal float64
	items := make([]domain.TransactionItem, len(req.Items))
	for i, item := range req.Items {
		itemTotal := float64(item.Quantity) * item.UnitPrice
		for _, m := range item.Modifiers {
			itemTotal += float64(item.Quantity) * m.PriceImpact
		}
		subtotal += itemTotal

		items[i] = domain.TransactionItem{
			ProductID:   &item.ProductID,
			ProductName: item.ProductName,
			Quantity:    item.Quantity,
			UnitPrice:   item.UnitPrice,
			Subtotal:    itemTotal,
			Modifiers:   item.Modifiers,
		}
	}

	txn := &domain.Transaction{
		ShiftID:        req.ShiftID,
		OutletID:       req.OutletID,
		CustomerName:   req.CustomerName,
		Subtotal:       req.Subtotal,
		TaxAmount:      req.TaxAmount,
		DiscountAmount: req.DiscountAmount,
		TotalAmount:    req.TotalAmount,
		PaymentMethod:  req.PaymentMethod,
		PaymentStatus:  domain.PaymentPaid,
		Items:          items,
	}

	// Just in case the frontend sends 0 subtotal but calculates from items, let's fallback to calculated items
	if txn.Subtotal == 0 && subtotal > 0 {
		txn.Subtotal = subtotal
		txn.TotalAmount = subtotal + txn.TaxAmount - txn.DiscountAmount
	}

	if err := uc.txnRepo.Create(ctx, txn); err != nil {
		return nil, err
	}

	// BUG-05 FIX: Stock deduction is already handled inside txnRepo.Create() within the
	// database transaction. The duplicate deduction here has been REMOVED to prevent
	// stock being deducted twice per transaction.

	_ = uc.logRepo.Create(ctx, &domain.ActivityLog{
		UserID: userID, OutletID: &req.OutletID,
		ActivityType: domain.ActivityTransaction,
		Details:      "Transaction " + txn.OrderID,
	})

	return txn, nil
}

// VoidTransaction voids a transaction and restores stock.
func (uc *TransactionUsecase) VoidTransaction(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	// BUG-03 FIX: Validate transaction exists and check ownership before voiding
	txn, err := uc.txnRepo.FindByID(ctx, id)
	if err != nil {
		return errors.New("transaksi tidak ditemukan")
	}

	// Prevent double-void
	if txn.PaymentStatus == domain.PaymentVoid {
		return errors.New("transaksi sudah di-void sebelumnya")
	}

	// Verify the transaction belongs to a shift owned by this user
	shift, err := uc.shiftRepo.FindByID(ctx, txn.ShiftID)
	if err != nil {
		return errors.New("shift transaksi tidak ditemukan")
	}
	if shift.UserID != userID {
		return errors.New("anda tidak berhak men-void transaksi milik kasir lain")
	}

	outlet, err := uc.outletRepo.FindByID(ctx, txn.OutletID)
	if err != nil {
		return errors.New("outlet tidak ditemukan")
	}

	if err := checkShiftExpiration(shift, outlet); err != nil {
		return err
	}

	if err := uc.txnRepo.Void(ctx, id); err != nil {
		return err
	}

	_ = uc.logRepo.Create(ctx, &domain.ActivityLog{
		UserID: userID, OutletID: &txn.OutletID,
		ActivityType: domain.ActivityTransaction,
		Details:      "Void Transaction " + txn.OrderID,
	})

	return nil
}

// ListTransactions returns a filtered, paginated list of transactions, and total revenue.
func (uc *TransactionUsecase) ListTransactions(ctx context.Context, filter repository.TransactionFilter) ([]domain.Transaction, int64, float64, error) {
	return uc.txnRepo.FindAll(ctx, filter)
}

// GetTransaction returns a single transaction with items.
func (uc *TransactionUsecase) GetTransaction(ctx context.Context, id uuid.UUID) (*domain.Transaction, error) {
	return uc.txnRepo.FindByID(ctx, id)
}
