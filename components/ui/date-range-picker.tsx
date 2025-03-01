"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, startOfYear, endOfYear } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  className?: string
  onChange?: (dateRange: DateRange | undefined) => void
}

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  // When a year button is clicked, update the range to cover the entire year.
  function handleYearClick(year: number) {
    const from = startOfYear(new Date(year, 0, 1))
    const to = endOfYear(new Date(year, 0, 1))
    setRange({ from, to })
  }

  // Notify parent when range updates.
  React.useEffect(() => {
    if (onChange) {
      onChange(range)
    }
  }, [range, onChange])

  // Generate a list of years from 2023 to the current year.
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let y = 2023; y <= currentYear; y++) {
    years.push(y)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[300px] justify-start text-left font-normal bg-white")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range ? (
              <>
                {format(range.from, "yyyy")}
              </>
            ) : (
              <span>Select a year</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white" align="start">
          <div className="space-y-4">
            {years.map((year) => (
              <button
                key={year}
                className="py-2 px-3 border rounded hover:bg-gray-100 w-full text-left"
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
