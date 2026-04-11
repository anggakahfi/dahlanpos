"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface RevenueChartsProps {
  dailyRevenue: { date: string; revenue: number }[]
  hourlyRevenue: { hour: number; revenue: number }[]
  metrics?: {
    cash_amount: number
    qris_amount: number
    cash_count: number
    qris_count: number
  }
  isLoading?: boolean
}

const COLORS = ["#3B82F6", "#10B981"]

function formatCurrency(value: number) {
  return `Rp ${(value / 1000).toFixed(0)}k`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

export function RevenueCharts({ dailyRevenue, hourlyRevenue, metrics, isLoading }: RevenueChartsProps) {
  const chartDailyData = dailyRevenue.map(d => ({
    date: formatDate(d.date),
    revenue: d.revenue,
  }))

  const chartHourlyData = hourlyRevenue.map(h => ({
    hour: `${String(h.hour).padStart(2, '0')}.00`,
    revenue: h.revenue,
  }))

  const totalAmount = (metrics?.cash_amount ?? 0) + (metrics?.qris_amount ?? 0)
  const paymentData = totalAmount > 0
    ? [
        { name: "Cash", value: Math.round((metrics!.cash_amount / totalAmount) * 100), amount: metrics!.cash_amount },
        { name: "QRIS", value: Math.round((metrics!.qris_amount / totalAmount) * 100), amount: metrics!.qris_amount },
      ]
    : [
        { name: "Cash", value: 0, amount: 0 },
        { name: "QRIS", value: 0, amount: 0 },
      ]

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* Daily Revenue - Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {chartDailyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No revenue data for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `Rp ${value.toLocaleString('id-ID')}`,
                      "Revenue",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Revenue - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Hourly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {chartHourlyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No hourly data for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `Rp ${value.toLocaleString('id-ID')}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Breakdown - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {totalAmount === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No payment data for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props) => {
                      const payload = props.payload as typeof paymentData[0]
                      return [
                        `${value}% (Rp ${payload.amount.toLocaleString('id-ID')})`,
                        name,
                      ]
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
