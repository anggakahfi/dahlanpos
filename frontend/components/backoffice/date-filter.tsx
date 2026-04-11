"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { QuickDateRange, DateRange } from "@/lib/types"

interface DateFilterProps {
  onDateChange?: (range: DateRange) => void
  defaultRange?: QuickDateRange
}

const quickRanges: { value: QuickDateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
]

/** Normalize start to 00:00:00.000 */
function startOfDay(d: Date): Date {
  const n = new Date(d)
  n.setHours(0, 0, 0, 0)
  return n
}

/** Normalize end to 23:59:59.999 */
function endOfDay(d: Date): Date {
  const n = new Date(d)
  n.setHours(23, 59, 59, 999)
  return n
}

function buildRange(value: QuickDateRange, currentRange: DateRange): DateRange | null {
  const now = new Date()
  let start: Date
  let end: Date

  switch (value) {
    case "last_7_days":
      start = new Date(now)
      start.setDate(now.getDate() - 6)
      start = startOfDay(start)
      end = endOfDay(now)
      break
    case "today":
      start = startOfDay(now)
      end = endOfDay(now)
      break
    case "yesterday":
      start = new Date(now)
      start.setDate(now.getDate() - 1)
      start = startOfDay(start)
      end = endOfDay(start)
      break
    case "this_week":
      start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start = startOfDay(start)
      end = endOfDay(now)
      break
    case "last_week":
      start = new Date(now)
      start.setDate(now.getDate() - now.getDay() - 7)
      start = startOfDay(start)
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      end = endOfDay(end)
      break
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = endOfDay(now)
      break
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      end = new Date(now.getFullYear(), now.getMonth(), 0)
      end = endOfDay(end)
      break
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1)
      end = endOfDay(now)
      break
    case "last_year":
      start = new Date(now.getFullYear() - 1, 0, 1)
      end = new Date(now.getFullYear() - 1, 11, 31)
      end = endOfDay(end)
      break
    case "custom":
      return null
    default:
      return null
  }
  return { start, end }
}

export function DateFilter({ onDateChange, defaultRange = "today" }: DateFilterProps) {
  const [quickRange, setQuickRange] = useState<QuickDateRange>(defaultRange)
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    return buildRange(defaultRange, { start: startOfDay(new Date()), end: endOfDay(new Date()) })!
  })

  // Bug #1 fix: fire onDateChange on mount with the initial range
  useEffect(() => {
    onDateChange?.(dateRange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleQuickRangeChange = (value: QuickDateRange) => {
    setQuickRange(value)

    const newRange = buildRange(value, dateRange)
    if (newRange) {
      setDateRange(newRange)
      onDateChange?.(newRange)
    }
    // for "custom" we just reveal the calendar pickers without firing a range yet
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={quickRange} onValueChange={(v) => handleQuickRangeChange(v as QuickDateRange)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {quickRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {quickRange === "custom" && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-36 justify-start text-left font-normal",
                  !dateRange.start && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.start
                  ? format(dateRange.start, "dd/MM/yyyy")
                  : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.start}
                onSelect={(date) => {
                  if (date) {
                    const newRange = { ...dateRange, start: startOfDay(date) }
                    setDateRange(newRange)
                    onDateChange?.(newRange)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">-</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-36 justify-start text-left font-normal",
                  !dateRange.end && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.end
                  ? format(dateRange.end, "dd/MM/yyyy")
                  : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.end}
                onSelect={(date) => {
                  if (date) {
                    const newRange = { ...dateRange, end: endOfDay(date) }
                    setDateRange(newRange)
                    onDateChange?.(newRange)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}
