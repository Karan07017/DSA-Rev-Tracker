import { useEffect, useState } from "react"
import { startOfMonth, endOfMonth, format } from "date-fns"
import api from "@/lib/api"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, ExternalLink, Clock, CalendarDays, CheckCircle2 } from "lucide-react"
import { QuestionDetailsDialog } from "@/components/QuestionDetailsDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CalendarData {
  date: string;
  count: number;
}

interface Question {
  _id: string;
  name: string;
  link: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  platform: string;
}

interface Revision {
  _id: string;
  question: Question;
  revisionDate: string;
  revisionStage: 1 | 4 | 7;
  isCompleted: boolean;
}

export function CalendarPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData[]>([])
  const [dayRevisions, setDayRevisions] = useState<Revision[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDay, setIsLoadingDay] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch Monthly Data
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

  // Fetch Selected Day Data
  useEffect(() => {
    if (!selectedDate) return;

    const fetchDayRevisions = async () => {
      try {
        setIsLoadingDay(true)
        const dateStr = format(selectedDate, "yyyy-MM-dd")
        const response = await api.get(`/revisions/date?date=${dateStr}`)
        setDayRevisions(response.data.revisions)
      } catch (err: any) {
        console.error("Failed to fetch day revisions", err)
      } finally {
        setIsLoadingDay(false)
      }
    }

    fetchDayRevisions()
  }, [selectedDate])

  const countMap = new Map(
    calendarData.map(item => [item.date, item.count])
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-secondary"
    }
  }

  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 1: return "Day 1"
      case 4: return "Day 4"
      case 7: return "Day 7"
      default: return `Stage ${stage}`
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Revision Calendar</h2>
        <p className="text-muted-foreground">
          Visualize your revision workload and click a date to see scheduled tasks.
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
              selected={selectedDate}
              onSelect={setSelectedDate}
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
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 flex flex-col items-center justify-center relative",
                today: "font-bold text-primary",
                outside: "text-muted-foreground opacity-50",
                disabled: "text-muted-foreground opacity-50",
                hidden: "invisible",
              }}
              components={{
                DayButton: ({ day, modifiers, ...props }) => {
                  const dateStr = format(day.date, "yyyy-MM-dd")
                  const count = countMap.get(dateStr) || 0
                  
                  let intensityClass = ""
                  if (count > 0 && count <= 2) intensityClass = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  else if (count > 2 && count <= 5) intensityClass = "bg-green-300 dark:bg-green-700/50 text-green-800 dark:text-green-300 font-medium"
                  else if (count > 5) intensityClass = "bg-green-500 dark:bg-green-600 text-white font-bold"
                  
                  const isSelected = modifiers.selected
                  
                  return (
                    <button
                      {...props}
                      className={`h-full w-full rounded-md flex flex-col items-center justify-center transition-colors hover:ring-2 hover:ring-primary hover:ring-offset-1 ${intensityClass} ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
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
              <span className="text-sm text-muted-foreground">0 Revisions</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">1-2 Revisions</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-300 dark:bg-green-700/50 text-green-800 dark:text-green-300 font-medium text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">3-5 Revisions</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-500 dark:bg-green-600 text-white font-bold text-sm">
                X
              </div>
              <span className="text-sm text-muted-foreground">6+ Revisions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Tasks for {format(selectedDate, "MMMM do, yyyy")}
            </CardTitle>
            <CardDescription>
              {dayRevisions.length} scheduled revision{dayRevisions.length === 1 ? '' : 's'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDay ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : dayRevisions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                No revisions scheduled for this day.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dayRevisions.map((rev) => (
                  <Card 
                    key={rev._id} 
                    className={`flex flex-col cursor-pointer hover:border-primary transition-colors ${rev.isCompleted ? 'opacity-60' : ''}`}
                    onClick={() => {
                      setSelectedQuestion(rev.question as any)
                      setIsDialogOpen(true)
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="line-clamp-1 text-base" title={rev.question.name}>
                          {rev.question.name}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getStageLabel(rev.revisionStage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className={getDifficultyColor(rev.question.difficulty)}>
                          {rev.question.difficulty}
                        </Badge>
                        <Badge variant="outline">{rev.question.platform}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {rev.isCompleted ? (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium w-full justify-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Completed
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full h-8 text-xs" asChild onClick={(e) => e.stopPropagation()}>
                          <a href={rev.question.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-2" />
                            View Problem
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <QuestionDetailsDialog 
        question={selectedQuestion as any} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  )
}
