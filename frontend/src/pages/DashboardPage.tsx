import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle2, Clock, CalendarDays } from "lucide-react"
import { toast } from "sonner"

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

export function DashboardPage() {
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTodayRevisions = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/revisions/today")
        setRevisions(response.data.revisions)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch revisions.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayRevisions()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "Hard": return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default: return "bg-secondary"
    }
  }

  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 1: return "Day 1 Review"
      case 4: return "Day 4 Review"
      case 7: return "Day 7 Review"
      default: return `Stage ${stage}`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Today's Revisions</h2>
          <p className="text-muted-foreground">Loading your scheduled tasks...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="gap-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Today's Revisions</h2>
        <p className="text-muted-foreground">
          You have {revisions.length} {revisions.length === 1 ? 'question' : 'questions'} scheduled for review today.
        </p>
      </div>

      {revisions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl mb-2">All Caught Up!</CardTitle>
          <CardDescription className="text-base max-w-sm">
            You've completed all your scheduled revisions for today. Take a break or solve new problems.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {revisions.map((revision) => (
            <Card key={revision._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="line-clamp-2 text-lg">
                    {revision.question.name}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getStageLabel(revision.revisionStage)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1.5 mt-2">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Due: {new Date(revision.revisionDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className={getDifficultyColor(revision.question.difficulty)}>
                    {revision.question.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {revision.question.topic}
                  </Badge>
                  <Badge variant="outline">
                    {revision.question.platform}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href={revision.question.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Solve
                  </a>
                </Button>
                <Button 
                  className="w-full"
                  onClick={async () => {
                    try {
                      await api.patch(`/revisions/${revision._id}/complete`)
                      setRevisions(prev => prev.filter(r => r._id !== revision._id))
                      toast.success("Revision marked as complete!")
                    } catch (err: any) {
                      toast.error("Failed to mark revision as complete.")
                    }
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Done
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
