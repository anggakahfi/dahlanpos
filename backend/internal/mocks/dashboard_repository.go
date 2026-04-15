package mocks

import (
	"context"

	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type DashboardRepository struct {
	mock.Mock
}

func (m *DashboardRepository) GetMetrics(ctx context.Context, filter repository.DashboardFilter) (*repository.DashboardMetrics, error) {
	args := m.Called(ctx, filter)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*repository.DashboardMetrics), args.Error(1)
}

func (m *DashboardRepository) GetPreviousPeriodMetrics(ctx context.Context, filter repository.DashboardFilter) (*repository.PeriodMetrics, error) {
	args := m.Called(ctx, filter)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*repository.PeriodMetrics), args.Error(1)
}

func (m *DashboardRepository) GetDailyRevenue(ctx context.Context, filter repository.DashboardFilter) ([]repository.DailyRevenue, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).([]repository.DailyRevenue), args.Error(1)
}

func (m *DashboardRepository) GetHourlyRevenue(ctx context.Context, filter repository.DashboardFilter) ([]repository.HourlyRevenue, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).([]repository.HourlyRevenue), args.Error(1)
}

func (m *DashboardRepository) GetTopItems(ctx context.Context, filter repository.DashboardFilter, limit int) ([]repository.TopItemStat, error) {
	args := m.Called(ctx, filter, limit)
	return args.Get(0).([]repository.TopItemStat), args.Error(1)
}

func (m *DashboardRepository) GetLowStockItems(ctx context.Context) ([]repository.LowStockItem, error) {
	args := m.Called(ctx)
	return args.Get(0).([]repository.LowStockItem), args.Error(1)
}
