import { useEffect, useState } from "react"
import { startOfMonth, endOfMonth, format } from "date-fns"
import api from "@/lib/api"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface CalendarData {
  date: string;
  count: number;
}

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true)
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)
        
        const response = await api.get(`/calendar`, {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString()
          }
        })
        
        setCalendarData(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch calendar data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendarData()
  }, [currentMonth])

  // Map dates to counts for quick lookup
  const countMap = new Map(
    calendarData.map(item => [item.date, item.count])
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Revision Calendar</h2>
        <p className="text-muted-foreground">
          Visualize your revision workload and history over time.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="flex flex-col relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Target revision workload per day</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-start justify-center overflow-x-auto pb-6">
            <Calendar
              mode="single"
              selected={new Date()}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border p-4 shadow-sm w-full max-w-[450px]"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex w-full justify-between",
                weekday: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
                week: "flex w-full mt-2 justify-between",
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 flex flex-col items-center justify-center",
                today: "bg-accent text-accent-foreground",
                outside: "text-muted-foreground opacity-50",
                disabled: "text-muted-foreground opacity-50",
                hidden: "invisible",
              }}
              components={{
                DayButton: ({ day, ...props }) => {
                  const dateStr = format(day.date, "yyyy-MM-dd")
                  const count = countMap.get(dateStr) || 0
                  
                  // Heatmap coloring logic
                  let intensityClass = ""
                  if (count > 0 && count <= 2) intensityClass = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  else if (count > 2 && count <= 5) intensityClass = "bg-green-300 dark:bg-green-700/50 text-green-800 dark:text-green-300 font-medium"
                  else if (count > 5) intensityClass = "bg-green-500 dark:bg-green-600 text-white font-bold"

                  return (
                    <button
                      {...props}
                      className={`h-full w-full rounded-md flex flex-col items-center justify-center transition-colors hover:bg-accent hover:text-accent-foreground ${intensityClass}`}
                    >
                      <span>{day.date.getDate()}</span>
                      {count > 0 && (
                        <span className="text-[10px] leading-tight opacity-80">
                          {count} rev
                        </span>
                      )}
                    </button>
                  )
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
            <CardDescription>Understanding the heatmap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center border bg-background text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">0 Revisions (Free Day)</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">1-2 Revisions (Light)</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-300 dark:bg-green-700/50 text-green-800 dark:text-green-300 font-medium text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">3-5 Revisions (Moderate)</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-500 dark:bg-green-600 text-white font-bold text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">6+ Revisions (Heavy)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
