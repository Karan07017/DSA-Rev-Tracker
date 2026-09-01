import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, Flame, Activity, TrendingUp, AlertTriangle } from "lucide-react"

interface TopicMastery {
  topic: string;
  total: number;
  strongCount: number;
  masteryPercentage: number;
}

interface Statistics {
  totalQuestions: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  topStrong: TopicMastery[];
  topWeak: TopicMastery[];
}

export function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/statistics")
        setStats(response.data.statistics)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch statistics.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
          <p className="text-muted-foreground">Loading your performance metrics...</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
        {error}
      </div>
    )
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
        <p className="text-muted-foreground">
          Track your DSA journey and identify areas for improvement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Questions */}
        <Card className="md:col-span-3 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mt-2">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Questions tracked in your library
            </p>
          </CardContent>
        </Card>

        {/* Difficulty Breakdown (Compact) */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="flex-1 p-3 rounded-lg border-green-500/20 bg-green-500/5 border">
                <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 flex items-center justify-between">
                  Easy <Target className="h-3 w-3" />
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.difficulty.easy}</div>
              </div>
              <div className="flex-1 p-3 rounded-lg border-yellow-500/20 bg-yellow-500/5 border">
                <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1 flex items-center justify-between">
                  Medium <TrendingUp className="h-3 w-3" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.difficulty.medium}</div>
              </div>
              <div className="flex-1 p-3 rounded-lg border-red-500/20 bg-red-500/5 border">
                <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1 flex items-center justify-between">
                  Hard <Flame className="h-3 w-3" />
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.difficulty.hard}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {/* Top Strong Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-500" />
              Strong Topics
            </CardTitle>
            <CardDescription>
              Topics where you rarely need help (highest mastery %)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats.topStrong.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">No data available yet.</div>
            ) : (
              stats.topStrong.map((t, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-4">{t.topic}</span>
                    <span className="text-green-500 font-bold shrink-0">{Math.round(t.masteryPercentage)}%</span>
                  </div>
                  <Progress value={t.masteryPercentage} className="h-2 bg-secondary" indicatorColor="bg-green-500" />
                  <p className="text-[10px] text-muted-foreground text-right">
                    {t.strongCount} / {t.total} solved without help
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Weak Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Topics to Improve
            </CardTitle>
            <CardDescription>
              Topics where you frequently use hints or tutorials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats.topWeak.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">No weak topics found! 🎉</div>
            ) : (
              stats.topWeak.map((t, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-4">{t.topic}</span>
                    <span className="text-red-500 font-bold shrink-0">{Math.round(t.masteryPercentage)}%</span>
                  </div>
                  <Progress value={t.masteryPercentage} className="h-2 bg-secondary" indicatorColor="bg-red-500" />
                  <p className="text-[10px] text-muted-foreground text-right">
                    {t.total - t.strongCount} / {t.total} required help
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
