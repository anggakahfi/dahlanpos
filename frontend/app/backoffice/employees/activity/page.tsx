"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { DateFilter } from "@/components/backoffice/date-filter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, LogIn, LogOut, Clock, Receipt } from "lucide-react"
import { getOutlets, getEmployees } from "@/lib/api"
import type { ActivityLog, Outlet, Employee } from "@/lib/types"

const activityIcons: Record<ActivityLog["activityType"], React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  start_shift: Clock,
  end_shift: Clock,
  transaction: Receipt,
}

const activityLabels: Record<ActivityLog["activityType"], string> = {
  login: "Login",
  logout: "Logout",
  start_shift: "Start Shift",
  end_shift: "End Shift",
  transaction: "Transaction",
}

export default function ActivityLogPage() {
  const [outletFilter, setOutletFilter] = useState("all")
  const [employeeFilter, setEmployeeFilter] = useState("all")
  const [activityFilter, setActivityFilter] = useState("all")
  const [outletList, setOutletList] = useState<Outlet[]>([])
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    getOutlets().then((data) => setOutletList(data || [])).catch(() => {})
    getEmployees().then((data) => setEmployeeList(data || [])).catch(() => {})
    // Activity logs would come from a dedicated endpoint — for now, start empty
    // In a full implementation, add getActivityLogs() to api.ts
  }, [])

  const filteredLogs = activityLogs.filter((log) => {
    if (outletFilter !== "all" && log.outletId !== outletFilter) return false
    if (employeeFilter !== "all" && log.employeeId !== employeeFilter) return false
    if (activityFilter !== "all" && log.activityType !== activityFilter) return false
    return true
  })

  return (
    <>
      <PageHeader title="Activity Log">
        <div className="flex items-center gap-2">
          <DateFilter />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Select value={outletFilter} onValueChange={setOutletFilter}>
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

          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employeeList.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="start_shift">Start Shift</SelectItem>
              <SelectItem value="end_shift">End Shift</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const Icon = activityIcons[log.activityType]
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.employeeName}</TableCell>
                      <TableCell>{log.outletName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <Icon className="h-3 w-3" />
                          {activityLabels[log.activityType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination placeholder */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-{filteredLogs.length} of {filteredLogs.length}
          </p>
        </div>
      </div>
    </>
  )
}
