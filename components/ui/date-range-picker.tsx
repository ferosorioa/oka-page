"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRange {
  from: Date
  to?: Date // Make the 'to' property optional
}

interface DateRangePickerProps {
  className?: string
  onChange?: (dateRange: DateRange | undefined) => void
}

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  // We keep the selected range as a state
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)
  // Track whether we're selecting the start or the end of the range
  const [selectingStart, setSelectingStart] = React.useState<boolean>(true)

  // When a month button is clicked, update the range accordingly
  function handleMonthClick(year: number, month: number) {
    // Create a date from the first day of the clicked month
    const clickedDate = new Date(year, month, 1)

    if (selectingStart) {
      // Set the start of the range to the beginning of the month
      setRange({ from: startOfMonth(clickedDate) }) // No need to set 'to' as undefined
      setSelectingStart(false)
    } else {
      // Ensure the end month is not before the start month
      if (range?.from && clickedDate < range.from) {
        // If so, treat this as a new start
        setRange({ from: startOfMonth(clickedDate) }) // No need to set 'to' as undefined
        setSelectingStart(false)
      } else {
        // Otherwise, set the end to the end of the clicked month
        setRange({ from: range!.from, to: endOfMonth(clickedDate) })
        setSelectingStart(true)
      }
    }
  }

  // Call the onChange callback whenever the range updates
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

  // Month abbreviations
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-[300px] justify-start text-left font-normal bg-white")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL yyyy")} - {format(range.to, "LLL yyyy")}
                </>
              ) : (
                format(range.from, "LLL yyyy")
              )
            ) : (
              <span>Pick a month range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white" align="start">
          <div className="space-y-4">
            {years.map((year) => (
              <div key={year}>
                <h3 className="font-semibold mb-2">{year}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {monthNames.map((month, index) => (
                    <button
                      key={index}
                      className="py-2 px-3 border rounded hover:bg-gray-100"
                      onClick={() => handleMonthClick(year, index)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

