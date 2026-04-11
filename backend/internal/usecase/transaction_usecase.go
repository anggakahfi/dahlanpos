package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// TransactionUsecase handles transaction creation and voiding.
type TransactionUsecase struct {
	txnRepo     repository.TransactionRepository
	logRepo     repository.ActivityLogRepository
	productRepo repository.ProductRepository
}

func NewTransactionUsecase(tr repository.TransactionRepository, lr repository.ActivityLogRepository, pr repository.ProductRepository) *TransactionUsecase {
	return &TransactionUsecase{txnRepo: tr, logRepo: lr, productRepo: pr}
}

// CreateTransaction processes a new sale with stock deduction.
func (uc *TransactionUsecase) CreateTransaction(ctx context.Context, req domain.CreateTransactionRequest, userID uuid.UUID) (*domain.Transaction, error) {
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

	// 🔽 Deduct stock for each item
	for _, item := range req.Items {
		_ = uc.productRepo.UpdateStock(ctx, item.ProductID, -item.Quantity)
	}

	_ = uc.logRepo.Create(ctx, &domain.ActivityLog{
		UserID: userID, OutletID: &req.OutletID,
		ActivityType: domain.ActivityTransaction,
		Details:      "Transaction " + txn.OrderID,
	})

	return txn, nil
}

// VoidTransaction voids a transaction and restores stock.
func (uc *TransactionUsecase) VoidTransaction(ctx context.Context, id uuid.UUID) error {
	return uc.txnRepo.Void(ctx, id)
}

// ListTransactions returns a filtered, paginated list of transactions.
func (uc *TransactionUsecase) ListTransactions(ctx context.Context, filter repository.TransactionFilter) ([]domain.Transaction, int64, error) {
	return uc.txnRepo.FindAll(ctx, filter)
}

// GetTransaction returns a single transaction with items.
func (uc *TransactionUsecase) GetTransaction(ctx context.Context, id uuid.UUID) (*domain.Transaction, error) {
	return uc.txnRepo.FindByID(ctx, id)
}
