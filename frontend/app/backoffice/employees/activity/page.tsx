"use client"

import { useState, useEffect, useCallback } from "react"
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
import type { ActivityLog, Outlet, Employee, DateRange } from "@/lib/types"

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
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  // Inline page-reset handlers to avoid double-fetch race condition
  const handleOutletChange = (val: string) => { setOutletFilter(val); setPage(1) }
  const handleEmployeeChange = (val: string) => { setEmployeeFilter(val); setPage(1) }
  const handleActivityChange = (val: string) => { setActivityFilter(val); setPage(1) }
  const handleDateChange = (val: DateRange | null) => { setDateRange(val as DateRange); setPage(1) }

  const fetchLogs = useCallback(async () => {
    // Don't fetch until DateFilter has initialized the date range
    if (!dateRange) return
    
    setIsLoading(true)
    try {
      const { getActivityLogs } = await import("@/lib/api")
      const params: any = { page, per_page: 20 }
      if (outletFilter !== "all") params.outlet_id = outletFilter
      if (employeeFilter !== "all") params.employee_id = employeeFilter
      if (activityFilter !== "all") params.activity_type = activityFilter
      
      if (dateRange.start) params.start_date = dateRange.start.toISOString()
      if (dateRange.end) params.end_date = dateRange.end.toISOString()

      const res = await getActivityLogs(params)
      if (res && res.data) {
        const mappedLogs: ActivityLog[] = res.data.map((log: any) => ({
          id: log.id,
          timestamp: new Date(log.created_at).toLocaleString('id-ID'),
          employeeId: log.user_id,
          employeeName: log.user_name || 'Unknown User',
          outletId: log.outlet_id || '',
          outletName: log.outlet_name || 'N/A',
          activityType: log.activity_type,
          details: log.details || '-'
        }))
        setActivityLogs(mappedLogs)
        setTotalRecords(res.meta?.total || 0)
      } else {
         setActivityLogs([])
         setTotalRecords(0)
      }
    } catch (err) {
      console.error("Failed to fetch activity logs", err)
    } finally {
      setIsLoading(false)
    }
  }, [outletFilter, employeeFilter, activityFilter, page, dateRange])

  useEffect(() => {
    getOutlets().then((data) => setOutletList(data || [])).catch(() => {})
    getEmployees().then((data) => setEmployeeList(data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const totalPages = Math.ceil(totalRecords / 20) || 1

  const handleExport = () => {
    if (activityLogs.length === 0) return
    
    // Create CSV content
    const headers = ["Timestamp", "Employee", "Outlet", "Activity", "Details"]
    const csvContent = [
      headers.join(","),
      ...activityLogs.map(log => [
         `"${log.timestamp}"`,
         `"${log.employeeName}"`,
         `"${log.outletName}"`,
         `"${activityLabels[log.activityType]}"`,
         `"${log.details.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n")
    
    // Download as file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `activity_logs_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <PageHeader title="Activity Log">
        <div className="flex items-center gap-2">
          <DateFilter onDateChange={handleDateChange} defaultRange="last_7_days" />
          <Button variant="outline" onClick={handleExport} disabled={activityLogs.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Select value={outletFilter} onValueChange={handleOutletChange}>
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

          <Select value={employeeFilter} onValueChange={handleEmployeeChange}>
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

          <Select value={activityFilter} onValueChange={handleActivityChange}>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : activityLogs.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                       No activity logs found.
                     </TableCell>
                  </TableRow>
                ) : (
                  activityLogs.map((log) => {
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
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {activityLogs.length === 0 ? 0 : (page - 1) * 20 + 1}-{Math.min(page * 20, totalRecords)} of {totalRecords}
          </p>
          <div className="flex gap-2">
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center text-sm px-2">
              Page {page} of {totalPages}
            </div>
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
