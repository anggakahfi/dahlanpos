"use client"

import { PageHeader } from "@/components/backoffice/page-header"
import { DateFilter } from "@/components/backoffice/date-filter"
import { MetricCards } from "@/components/backoffice/dashboard/metric-cards"
import { RevenueCharts } from "@/components/backoffice/dashboard/revenue-charts"
import { TopItemsTable } from "@/components/backoffice/dashboard/top-items-table"
import { LowStockAlert } from "@/components/backoffice/dashboard/low-stock-alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, useCallback } from "react"
import { getOutlets, getDashboardSummary } from "@/lib/api"
import type { Outlet } from "@/lib/types"

interface DateRange {
  start: Date
  end: Date
}

export default function DashboardPage() {
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [outletList, setOutletList] = useState<Outlet[]>([])
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOutlets()
      .then((data) => setOutletList(data || []))
      .catch(() => {})
  }, [])

  const fetchDashboard = useCallback(async () => {
    if (!dateRange) return

    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (selectedOutlet !== "all") params.outlet_id = selectedOutlet
      if (dateRange.start) params.start_date = dateRange.start.toISOString()
      if (dateRange.end) params.end_date = dateRange.end.toISOString()

      const data = await getDashboardSummary(params)
      setDashboardData(data)
    } catch (err) {
      console.error("Failed to fetch dashboard", err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedOutlet, dateRange])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const handleOutletChange = (val: string) => {
    setSelectedOutlet(val)
  }

  const handleDateChange = (val: DateRange | null) => {
    setDateRange(val as DateRange)
  }

  return (
    <>
      <PageHeader title="Dashboard">
        <div className="flex items-center gap-4">
          <Select value={selectedOutlet} onValueChange={handleOutletChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outletList.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateFilter onDateChange={handleDateChange} />
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Metric Cards */}
        <MetricCards
          metrics={dashboardData?.metrics}
          percentChanges={dashboardData?.percent_changes}
          isLoading={isLoading}
        />

        {/* Charts */}
        <RevenueCharts
          dailyRevenue={dashboardData?.daily_revenue ?? []}
          hourlyRevenue={dashboardData?.hourly_revenue ?? []}
          metrics={dashboardData?.metrics}
          isLoading={isLoading}
        />

        {/* Top Items & Low Stock */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TopItemsTable
              topItems={dashboardData?.top_items ?? []}
              totalRevenue={dashboardData?.metrics?.total_revenue ?? 0}
              isLoading={isLoading}
            />
          </div>
          <div>
            <LowStockAlert
              lowStockItems={dashboardData?.low_stock_items ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  )
}
