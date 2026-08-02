package usecase_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/smallthingscoffee/pos-backend/internal/mocks"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func newDashboardUsecase() (*usecase.DashboardUsecase, *mocks.DashboardRepository) {
	dr := new(mocks.DashboardRepository)
	uc := usecase.NewDashboardUsecase(dr)
	return uc, dr
}

func TestDashboard_GetSummary_Success_WithPrevious(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}

	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{
		TotalRevenue: 1000000, TotalTransactions: 50, AvgOrderValue: 20000,
	}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(&repository.PeriodMetrics{
		TotalRevenue: 800000, TotalTransactions: 40, AvgOrderValue: 20000,
	}, nil)
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue{
		{Date: "2026-04-14", Revenue: 500000},
	}, nil)
	dr.On("GetHourlyRevenue", mock.Anything, filter).Return([]repository.HourlyRevenue{
		{Hour: 10, Revenue: 200000},
	}, nil)
	dr.On("GetTopItems", mock.Anything, filter, 10).Return([]repository.TopItemStat{
		{ProductName: "Latte", QuantitySold: 20},
	}, nil)
	dr.On("GetLowStockItems", mock.Anything).Return([]repository.LowStockItem{}, nil)

	summary, err := uc.GetSummary(context.Background(), filter)

	assert.NoError(t, err)
	assert.NotNil(t, summary)
	assert.NotNil(t, summary.PercentChanges)
	assert.NotNil(t, summary.PercentChanges.Revenue)
	assert.Equal(t, float64(1000000), summary.Metrics.TotalRevenue)
}

func TestDashboard_GetSummary_NoPreviousPeriod(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}

	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{TotalRevenue: 500000}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(nil, errors.New("no data"))
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue{}, nil)
	dr.On("GetHourlyRevenue", mock.Anything, filter).Return([]repository.HourlyRevenue{}, nil)
	dr.On("GetTopItems", mock.Anything, filter, 10).Return([]repository.TopItemStat{}, nil)
	dr.On("GetLowStockItems", mock.Anything).Return([]repository.LowStockItem{}, nil)

	summary, err := uc.GetSummary(context.Background(), filter)

	assert.NoError(t, err)
	assert.Nil(t, summary.PercentChanges)
}

func TestDashboard_GetSummary_PreviousPeriodZero(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}

	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{TotalRevenue: 100000}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(&repository.PeriodMetrics{
		TotalRevenue: 0, TotalTransactions: 0, AvgOrderValue: 0,
	}, nil)
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue{}, nil)
	dr.On("GetHourlyRevenue", mock.Anything, filter).Return([]repository.HourlyRevenue{}, nil)
	dr.On("GetTopItems", mock.Anything, filter, 10).Return([]repository.TopItemStat{}, nil)
	dr.On("GetLowStockItems", mock.Anything).Return([]repository.LowStockItem{}, nil)

	summary, err := uc.GetSummary(context.Background(), filter)

	assert.NoError(t, err)
	// When previous is 0, pctChange should be nil (cannot calculate)
	assert.Nil(t, summary.PercentChanges.Revenue)
}

func TestDashboard_Fail_GetMetrics(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}
	dr.On("GetMetrics", mock.Anything, filter).Return(nil, errors.New("db error"))

	summary, err := uc.GetSummary(context.Background(), filter)
	assert.Error(t, err)
	assert.Nil(t, summary)
}

func TestDashboard_Fail_GetDailyRevenue(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}
	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(nil, errors.New("no data"))
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue(nil), errors.New("db error"))

	summary, err := uc.GetSummary(context.Background(), filter)
	assert.Error(t, err)
	assert.Nil(t, summary)
}

func TestDashboard_Fail_GetHourlyRevenue(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}
	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(nil, errors.New("no data"))
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue{}, nil)
	dr.On("GetHourlyRevenue", mock.Anything, filter).Return([]repository.HourlyRevenue(nil), errors.New("db error"))

	summary, err := uc.GetSummary(context.Background(), filter)
	assert.Error(t, err)
	assert.Nil(t, summary)
}

func TestDashboard_Fail_GetTopItems(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}
	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(nil, errors.New("no data"))
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue{}, nil)
	dr.On("GetHourlyRevenue", mock.Anything, filter).Return([]repository.HourlyRevenue{}, nil)
	dr.On("GetTopItems", mock.Anything, filter, 10).Return([]repository.TopItemStat(nil), errors.New("db error"))

	summary, err := uc.GetSummary(context.Background(), filter)
	assert.Error(t, err)
	assert.Nil(t, summary)
}

func TestDashboard_Fail_GetLowStock(t *testing.T) {
	uc, dr := newDashboardUsecase()
	filter := repository.DashboardFilter{}
	dr.On("GetMetrics", mock.Anything, filter).Return(&repository.DashboardMetrics{}, nil)
	dr.On("GetPreviousPeriodMetrics", mock.Anything, filter).Return(nil, errors.New("no data"))
	dr.On("GetDailyRevenue", mock.Anything, filter).Return([]repository.DailyRevenue{}, nil)
	dr.On("GetHourlyRevenue", mock.Anything, filter).Return([]repository.HourlyRevenue{}, nil)
	dr.On("GetTopItems", mock.Anything, filter, 10).Return([]repository.TopItemStat{}, nil)
	dr.On("GetLowStockItems", mock.Anything).Return([]repository.LowStockItem(nil), errors.New("db error"))

	summary, err := uc.GetSummary(context.Background(), filter)
	assert.Error(t, err)
	assert.Nil(t, summary)
}
