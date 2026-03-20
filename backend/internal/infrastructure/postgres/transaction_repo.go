package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type transactionRepo struct {
	pool *pgxpool.Pool
}

func NewTransactionRepo(pool *pgxpool.Pool) *transactionRepo {
	return &transactionRepo{pool: pool}
}

func (r *transactionRepo) Create(ctx context.Context, txn *domain.Transaction) error {
	dbTx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer dbTx.Rollback(ctx)

	// Generate order ID: ORD-YYYYMMDD-XXX
	var seq int
	err = dbTx.QueryRow(ctx,
		`SELECT COUNT(*) + 1 FROM transactions WHERE DATE(created_at) = CURRENT_DATE`,
	).Scan(&seq)
	if err != nil {
		return err
	}
	txn.OrderID = fmt.Sprintf("ORD-%s-%03d", time.Now().Format("20060102"), seq)

	// Insert transaction
	err = dbTx.QueryRow(ctx,
		`INSERT INTO transactions (shift_id, outlet_id, order_id, customer_name, subtotal,
		 discount_amount, tax_amount, total_amount, payment_method, payment_status)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		 RETURNING id, created_at, updated_at, paid_at`,
		txn.ShiftID, txn.OutletID, txn.OrderID, txn.CustomerName, txn.Subtotal,
		txn.DiscountAmount, txn.TaxAmount, txn.TotalAmount, txn.PaymentMethod, txn.PaymentStatus,
	).Scan(&txn.ID, &txn.CreatedAt, &txn.UpdatedAt, &txn.PaidAt)
	if err != nil {
		return err
	}

	// Insert items and deduct stock
	for i := range txn.Items {
		item := &txn.Items[i]
		item.TransactionID = txn.ID
		item.Subtotal = float64(item.Quantity) * item.UnitPrice
		for _, m := range item.Modifiers {
			item.Subtotal += float64(item.Quantity) * m.PriceImpact
		}

		modJSON, _ := json.Marshal(item.Modifiers)

		err = dbTx.QueryRow(ctx,
			`INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price, subtotal, modifiers)
			 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
			item.TransactionID, item.ProductID, item.ProductName, item.Quantity, item.UnitPrice, item.Subtotal, modJSON,
		).Scan(&item.ID)
		if err != nil {
			return err
		}

		// Deduct stock
		_, err = dbTx.Exec(ctx,
			`UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1`,
			item.Quantity, item.ProductID,
		)
		if err != nil {
			return err
		}
	}

	return dbTx.Commit(ctx)
}

func (r *transactionRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Transaction, error) {
	var txn domain.Transaction
	err := r.pool.QueryRow(ctx,
		`SELECT id, shift_id, outlet_id, order_id, customer_name, subtotal,
		        discount_amount, tax_amount, total_amount, payment_method, payment_status,
		        paid_at, created_at, updated_at
		 FROM transactions WHERE id = $1`, id,
	).Scan(
		&txn.ID, &txn.ShiftID, &txn.OutletID, &txn.OrderID, &txn.CustomerName, &txn.Subtotal,
		&txn.DiscountAmount, &txn.TaxAmount, &txn.TotalAmount, &txn.PaymentMethod, &txn.PaymentStatus,
		&txn.PaidAt, &txn.CreatedAt, &txn.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	txn.Items, err = r.loadItems(ctx, txn.ID)
	if err != nil {
		return nil, err
	}
	return &txn, nil
}

func (r *transactionRepo) FindAll(ctx context.Context, filter repository.TransactionFilter) ([]domain.Transaction, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if filter.OutletID != nil {
		conditions = append(conditions, fmt.Sprintf("t.outlet_id = $%d", argIdx))
		args = append(args, *filter.OutletID)
		argIdx++
	}
	if filter.ShiftID != nil {
		conditions = append(conditions, fmt.Sprintf("t.shift_id = $%d", argIdx))
		args = append(args, *filter.ShiftID)
		argIdx++
	}
	if filter.PaymentMethod != nil {
		conditions = append(conditions, fmt.Sprintf("t.payment_method = $%d", argIdx))
		args = append(args, *filter.PaymentMethod)
		argIdx++
	}
	if filter.DateFrom != nil {
		conditions = append(conditions, fmt.Sprintf("t.created_at >= $%d", argIdx))
		args = append(args, *filter.DateFrom)
		argIdx++
	}
	if filter.DateTo != nil {
		conditions = append(conditions, fmt.Sprintf("t.created_at <= $%d", argIdx))
		args = append(args, *filter.DateTo)
		argIdx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}

	var total int64
	if err := r.pool.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM transactions t %s", where), args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	page := filter.Page
	if page < 1 {
		page = 1
	}
	perPage := filter.PerPage
	if perPage < 1 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	dataSQL := fmt.Sprintf(
		`SELECT t.id, t.shift_id, t.outlet_id, t.order_id, t.customer_name, t.subtotal,
		        t.discount_amount, t.tax_amount, t.total_amount, t.payment_method, t.payment_status,
		        t.paid_at, t.created_at, t.updated_at
		 FROM transactions t %s ORDER BY t.created_at DESC LIMIT $%d OFFSET $%d`, where, argIdx, argIdx+1)
	args = append(args, perPage, offset)

	rows, err := r.pool.Query(ctx, dataSQL, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var txns []domain.Transaction
	for rows.Next() {
		var txn domain.Transaction
		if err := rows.Scan(
			&txn.ID, &txn.ShiftID, &txn.OutletID, &txn.OrderID, &txn.CustomerName, &txn.Subtotal,
			&txn.DiscountAmount, &txn.TaxAmount, &txn.TotalAmount, &txn.PaymentMethod, &txn.PaymentStatus,
			&txn.PaidAt, &txn.CreatedAt, &txn.UpdatedAt,
		); err != nil {
			return nil, 0, err
		}
		txns = append(txns, txn)
	}
	return txns, total, rows.Err()
}

func (r *transactionRepo) Void(ctx context.Context, id uuid.UUID) error {
	dbTx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer dbTx.Rollback(ctx)

	// Restore stock for each item
	items, err := r.loadItems(ctx, id)
	if err != nil {
		return err
	}
	for _, item := range items {
		if item.ProductID != nil {
			_, err = dbTx.Exec(ctx, `UPDATE products SET stock = stock + $1 WHERE id = $2`, item.Quantity, item.ProductID)
			if err != nil {
				return err
			}
		}
	}

	_, err = dbTx.Exec(ctx, `UPDATE transactions SET payment_status='void' WHERE id=$1`, id)
	if err != nil {
		return err
	}

	return dbTx.Commit(ctx)
}

func (r *transactionRepo) SumCashByShift(ctx context.Context, shiftID uuid.UUID) (float64, error) {
	var sum float64
	err := r.pool.QueryRow(ctx,
		`SELECT COALESCE(SUM(total_amount), 0)
		 FROM transactions WHERE shift_id=$1 AND payment_method='cash' AND payment_status='paid'`, shiftID,
	).Scan(&sum)
	return sum, err
}

func (r *transactionRepo) loadItems(ctx context.Context, txnID uuid.UUID) ([]domain.TransactionItem, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, transaction_id, product_id, product_name, quantity, unit_price, subtotal, modifiers
		 FROM transaction_items WHERE transaction_id=$1 ORDER BY id`, txnID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []domain.TransactionItem
	for rows.Next() {
		var item domain.TransactionItem
		var modJSON []byte
		if err := rows.Scan(&item.ID, &item.TransactionID, &item.ProductID, &item.ProductName,
			&item.Quantity, &item.UnitPrice, &item.Subtotal, &modJSON); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(modJSON, &item.Modifiers); err != nil {
			item.Modifiers = []domain.SelectedModifier{}
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
