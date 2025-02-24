"use client"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}

export default function DateRangeSelector({ dateRange, setDateRange }: DateRangeSelectorProps) {
  return <DateRangePicker onChange={setDateRange} value={dateRange} />
}
