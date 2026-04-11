package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// DashboardFilter defines query parameters for dashboard aggregation.
type DashboardFilter struct {
	OutletID *uuid.UUID
	DateFrom time.Time
	DateTo   time.Time
}

// DashboardMetrics contains the top-level KPI metrics.
type DashboardMetrics struct {
	TotalRevenue      float64 `json:"total_revenue"`
	TotalTransactions int64   `json:"total_transactions"`
	VoidTransactions  int64   `json:"void_transactions"`
	AvgOrderValue     float64 `json:"avg_order_value"`
	CashCount         int64   `json:"cash_count"`
	CashAmount        float64 `json:"cash_amount"`
	QrisCount         int64   `json:"qris_count"`
	QrisAmount        float64 `json:"qris_amount"`
}

// DailyRevenue is one data point for revenue-per-date chart.
type DailyRevenue struct {
	Date    string  `json:"date"`
	Revenue float64 `json:"revenue"`
}

// HourlyRevenue is one data point for revenue-per-hour chart.
type HourlyRevenue struct {
	Hour    int     `json:"hour"`
	Revenue float64 `json:"revenue"`
}

// TopItemStat is an aggregated product sales stat.
type TopItemStat struct {
	ProductName  string  `json:"product_name"`
	QuantitySold int64   `json:"quantity_sold"`
	TotalRevenue float64 `json:"total_revenue"`
}

// LowStockItem represents a product below its stock threshold.
type LowStockItem struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Stock     int       `json:"stock"`
	Unit      string    `json:"unit"`
	Threshold int       `json:"threshold"`
}

// PeriodMetrics is a slimmed-down set for computing % change vs previous period.
type PeriodMetrics struct {
	TotalRevenue      float64
	TotalTransactions int64
	AvgOrderValue     float64
}

// DashboardRepository defines the contract for dashboard aggregation queries.
type DashboardRepository interface {
	GetMetrics(ctx context.Context, filter DashboardFilter) (*DashboardMetrics, error)
	GetPreviousPeriodMetrics(ctx context.Context, filter DashboardFilter) (*PeriodMetrics, error)
	GetDailyRevenue(ctx context.Context, filter DashboardFilter) ([]DailyRevenue, error)
	GetHourlyRevenue(ctx context.Context, filter DashboardFilter) ([]HourlyRevenue, error)
	GetTopItems(ctx context.Context, filter DashboardFilter, limit int) ([]TopItemStat, error)
	GetLowStockItems(ctx context.Context) ([]LowStockItem, error)
}
