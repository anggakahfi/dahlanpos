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
import {
  dailyRevenueData,
  weekdayRevenueData,
  hourlyRevenueData,
  paymentBreakdownData,
} from "@/lib/seed-data"

const COLORS = ["#3B82F6", "#10B981"]

function formatCurrency(value: number) {
  return `Rp ${(value / 1000).toFixed(0)}k`
}

export function RevenueCharts() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* Daily Revenue - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenueData}>
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
                    `Rp ${value.toLocaleString()}`,
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
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Day - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Revenue by Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {paymentBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props) => {
                    const payload = props.payload as typeof paymentBreakdownData[0]
                    return [
                      `${value}% (Rp ${payload.amount.toLocaleString()})`,
                      name,
                    ]
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
