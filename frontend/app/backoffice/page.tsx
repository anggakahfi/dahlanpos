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
import { useState, useEffect } from "react"
import { getOutlets } from "@/lib/api"
import type { Outlet } from "@/lib/types"

export default function DashboardPage() {
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [outletList, setOutletList] = useState<Outlet[]>([])

  useEffect(() => {
    getOutlets()
      .then((data) => setOutletList(data || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHeader title="Dashboard">
        <div className="flex items-center gap-4">
          <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
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
          <DateFilter />
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Metric Cards */}
        <MetricCards />

        {/* Charts */}
        <RevenueCharts />

        {/* Top Items & Low Stock */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TopItemsTable />
          </div>
          <div>
            <LowStockAlert />
          </div>
        </div>
      </div>
    </>
  )
}
