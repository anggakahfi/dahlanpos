package usecase

import (
	"context"
	"math"

	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// DashboardSummary is the complete response DTO for the dashboard endpoint.
type DashboardSummary struct {
	Metrics        *repository.DashboardMetrics `json:"metrics"`
	PercentChanges *PercentChanges              `json:"percent_changes,omitempty"`
	DailyRevenue   []repository.DailyRevenue    `json:"daily_revenue"`
	HourlyRevenue  []repository.HourlyRevenue   `json:"hourly_revenue"`
	TopItems       []repository.TopItemStat     `json:"top_items"`
	LowStockItems  []repository.LowStockItem    `json:"low_stock_items"`
}

// PercentChanges holds the % delta vs the previous period.
type PercentChanges struct {
	Revenue      *float64 `json:"revenue"`
	Transactions *float64 `json:"transactions"`
	AvgOrder     *float64 `json:"avg_order"`
}

// DashboardUsecase orchestrates dashboard data aggregation.
type DashboardUsecase struct {
	dashRepo repository.DashboardRepository
}

func NewDashboardUsecase(dr repository.DashboardRepository) *DashboardUsecase {
	return &DashboardUsecase{dashRepo: dr}
}

func (uc *DashboardUsecase) GetSummary(ctx context.Context, filter repository.DashboardFilter) (*DashboardSummary, error) {
	metrics, err := uc.dashRepo.GetMetrics(ctx, filter)
	if err != nil {
		return nil, err
	}

	// Percent changes vs previous period
	var pctChanges *PercentChanges
	prevMetrics, err := uc.dashRepo.GetPreviousPeriodMetrics(ctx, filter)
	if err == nil && prevMetrics != nil {
		pctChanges = &PercentChanges{}
		pctChanges.Revenue = calcPctChange(prevMetrics.TotalRevenue, metrics.TotalRevenue)
		pctChanges.Transactions = calcPctChangeInt(prevMetrics.TotalTransactions, metrics.TotalTransactions)
		pctChanges.AvgOrder = calcPctChange(prevMetrics.AvgOrderValue, metrics.AvgOrderValue)
	}

	dailyRevenue, err := uc.dashRepo.GetDailyRevenue(ctx, filter)
	if err != nil {
		return nil, err
	}

	hourlyRevenue, err := uc.dashRepo.GetHourlyRevenue(ctx, filter)
	if err != nil {
		return nil, err
	}

	topItems, err := uc.dashRepo.GetTopItems(ctx, filter, 10)
	if err != nil {
		return nil, err
	}

	lowStock, err := uc.dashRepo.GetLowStockItems(ctx)
	if err != nil {
		return nil, err
	}

	return &DashboardSummary{
		Metrics:        metrics,
		PercentChanges: pctChanges,
		DailyRevenue:   dailyRevenue,
		HourlyRevenue:  hourlyRevenue,
		TopItems:       topItems,
		LowStockItems:  lowStock,
	}, nil
}

// calcPctChange computes (current - previous) / previous * 100, rounded to 1 decimal.
func calcPctChange(prev, curr float64) *float64 {
	if prev == 0 {
		return nil // Cannot compute % change from zero
	}
	pct := math.Round((curr-prev)/prev*1000) / 10
	return &pct
}

func calcPctChangeInt(prev, curr int64) *float64 {
	return calcPctChange(float64(prev), float64(curr))
}
