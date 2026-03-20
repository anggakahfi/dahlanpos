"use client"

import { useState } from "react"
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
}

const quickRanges: { value: QuickDateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
]

export function DateFilter({ onDateChange }: DateFilterProps) {
  const [quickRange, setQuickRange] = useState<QuickDateRange>("today")
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date(),
  })

  const handleQuickRangeChange = (value: QuickDateRange) => {
    setQuickRange(value)
    const now = new Date()
    let start = new Date()
    let end = new Date()

    switch (value) {
      case "today":
        break
      case "yesterday":
        start.setDate(now.getDate() - 1)
        end.setDate(now.getDate() - 1)
        break
      case "this_week":
        start.setDate(now.getDate() - now.getDay())
        break
      case "last_week":
        start.setDate(now.getDate() - now.getDay() - 7)
        end.setDate(now.getDate() - now.getDay() - 1)
        break
      case "this_month":
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "last_month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case "this_year":
        start = new Date(now.getFullYear(), 0, 1)
        break
      case "last_year":
        start = new Date(now.getFullYear() - 1, 0, 1)
        end = new Date(now.getFullYear() - 1, 11, 31)
        break
      case "custom":
        // Keep current date range for custom
        return
    }

    const newRange = { start, end }
    setDateRange(newRange)
    onDateChange?.(newRange)
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
                    const newRange = { ...dateRange, start: date }
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
                    const newRange = { ...dateRange, end: date }
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
