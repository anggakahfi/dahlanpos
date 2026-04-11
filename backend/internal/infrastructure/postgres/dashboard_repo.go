package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type dashboardRepo struct {
	pool *pgxpool.Pool
}

func NewDashboardRepo(pool *pgxpool.Pool) *dashboardRepo {
	return &dashboardRepo{pool: pool}
}

// GetMetrics returns aggregate KPIs for transactions in the given date range.
func (r *dashboardRepo) GetMetrics(ctx context.Context, filter repository.DashboardFilter) (*repository.DashboardMetrics, error) {
	query := `
		SELECT
			COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END), 0) AS total_revenue,
			COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) AS total_transactions,
			COUNT(CASE WHEN payment_status = 'void' THEN 1 END) AS void_transactions,
			COALESCE(AVG(CASE WHEN payment_status = 'paid' THEN total_amount END), 0) AS avg_order_value,
			COUNT(CASE WHEN payment_status = 'paid' AND payment_method = 'cash' THEN 1 END) AS cash_count,
			COALESCE(SUM(CASE WHEN payment_status = 'paid' AND payment_method = 'cash' THEN total_amount ELSE 0 END), 0) AS cash_amount,
			COUNT(CASE WHEN payment_status = 'paid' AND payment_method = 'qris' THEN 1 END) AS qris_count,
			COALESCE(SUM(CASE WHEN payment_status = 'paid' AND payment_method = 'qris' THEN total_amount ELSE 0 END), 0) AS qris_amount
		FROM transactions
		WHERE created_at >= $1 AND created_at <= $2`

	args := []interface{}{filter.DateFrom, filter.DateTo}
	argIdx := 3

	if filter.OutletID != nil {
		query += fmt.Sprintf(" AND outlet_id = $%d", argIdx)
		args = append(args, *filter.OutletID)
	}

	var m repository.DashboardMetrics
	err := r.pool.QueryRow(ctx, query, args...).Scan(
		&m.TotalRevenue, &m.TotalTransactions, &m.VoidTransactions,
		&m.AvgOrderValue, &m.CashCount, &m.CashAmount, &m.QrisCount, &m.QrisAmount,
	)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// GetPreviousPeriodMetrics computes metrics for the period immediately before the filter's range,
// with the same duration. Used for calculating % change.
func (r *dashboardRepo) GetPreviousPeriodMetrics(ctx context.Context, filter repository.DashboardFilter) (*repository.PeriodMetrics, error) {
	duration := filter.DateTo.Sub(filter.DateFrom)
	prevFrom := filter.DateFrom.Add(-duration)
	prevTo := filter.DateFrom.Add(-time.Second) // 1 second before current start

	query := `
		SELECT
			COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END), 0),
			COUNT(CASE WHEN payment_status = 'paid' THEN 1 END),
			COALESCE(AVG(CASE WHEN payment_status = 'paid' THEN total_amount END), 0)
		FROM transactions
		WHERE created_at >= $1 AND created_at <= $2`

	args := []interface{}{prevFrom, prevTo}
	argIdx := 3

	if filter.OutletID != nil {
		query += fmt.Sprintf(" AND outlet_id = $%d", argIdx)
		args = append(args, *filter.OutletID)
	}

	var m repository.PeriodMetrics
	err := r.pool.QueryRow(ctx, query, args...).Scan(
		&m.TotalRevenue, &m.TotalTransactions, &m.AvgOrderValue,
	)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// GetDailyRevenue returns revenue grouped by date.
func (r *dashboardRepo) GetDailyRevenue(ctx context.Context, filter repository.DashboardFilter) ([]repository.DailyRevenue, error) {
	query := `
		SELECT DATE(created_at AT TIME ZONE 'Asia/Jakarta') AS d, COALESCE(SUM(total_amount), 0) AS revenue
		FROM transactions
		WHERE payment_status = 'paid' AND created_at >= $1 AND created_at <= $2`

	args := []interface{}{filter.DateFrom, filter.DateTo}
	argIdx := 3

	if filter.OutletID != nil {
		query += fmt.Sprintf(" AND outlet_id = $%d", argIdx)
		args = append(args, *filter.OutletID)
	}

	query += " GROUP BY d ORDER BY d"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []repository.DailyRevenue
	for rows.Next() {
		var dr repository.DailyRevenue
		var d time.Time
		if err := rows.Scan(&d, &dr.Revenue); err != nil {
			return nil, err
		}
		dr.Date = d.Format("2006-01-02")
		result = append(result, dr)
	}
	return result, nil
}

// GetHourlyRevenue returns revenue grouped by hour of day.
func (r *dashboardRepo) GetHourlyRevenue(ctx context.Context, filter repository.DashboardFilter) ([]repository.HourlyRevenue, error) {
	query := `
		SELECT EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Jakarta')::int AS h, COALESCE(SUM(total_amount), 0) AS revenue
		FROM transactions
		WHERE payment_status = 'paid' AND created_at >= $1 AND created_at <= $2`

	args := []interface{}{filter.DateFrom, filter.DateTo}
	argIdx := 3

	if filter.OutletID != nil {
		query += fmt.Sprintf(" AND outlet_id = $%d", argIdx)
		args = append(args, *filter.OutletID)
	}

	query += " GROUP BY h ORDER BY h"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []repository.HourlyRevenue
	for rows.Next() {
		var hr repository.HourlyRevenue
		if err := rows.Scan(&hr.Hour, &hr.Revenue); err != nil {
			return nil, err
		}
		result = append(result, hr)
	}
	return result, nil
}

// GetTopItems returns the top N products by quantity sold.
func (r *dashboardRepo) GetTopItems(ctx context.Context, filter repository.DashboardFilter, limit int) ([]repository.TopItemStat, error) {
	query := `
		SELECT ti.product_name, SUM(ti.quantity) AS qty, SUM(ti.subtotal) AS rev
		FROM transaction_items ti
		JOIN transactions t ON t.id = ti.transaction_id
		WHERE t.payment_status = 'paid' AND t.created_at >= $1 AND t.created_at <= $2`

	args := []interface{}{filter.DateFrom, filter.DateTo}
	argIdx := 3

	if filter.OutletID != nil {
		query += fmt.Sprintf(" AND t.outlet_id = $%d", argIdx)
		args = append(args, *filter.OutletID)
		argIdx++
	}

	query += fmt.Sprintf(" GROUP BY ti.product_name ORDER BY qty DESC LIMIT $%d", argIdx)
	args = append(args, limit)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []repository.TopItemStat
	for rows.Next() {
		var item repository.TopItemStat
		if err := rows.Scan(&item.ProductName, &item.QuantitySold, &item.TotalRevenue); err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	return result, nil
}

// GetLowStockItems returns products where stock <= low_stock_threshold and product is active.
func (r *dashboardRepo) GetLowStockItems(ctx context.Context) ([]repository.LowStockItem, error) {
	query := `
		SELECT id, name, stock, unit, low_stock_threshold
		FROM products
		WHERE is_active = true AND stock <= low_stock_threshold
		ORDER BY stock ASC
		LIMIT 10`

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []repository.LowStockItem
	for rows.Next() {
		var item repository.LowStockItem
		var uid uuid.UUID
		if err := rows.Scan(&uid, &item.Name, &item.Stock, &item.Unit, &item.Threshold); err != nil {
			return nil, err
		}
		item.ID = uid
		result = append(result, item)
	}
	return result, nil
}
