import { useEffect, useState } from "react"
import api from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
import { useDebounce } from "@/hooks/useDebounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, FilterX, ExternalLink, Pencil, Trash2 } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"

interface Question {
  _id: string;
  name: string;
  link: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  platform: string;
  solvedDate: string;
}

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function AllQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter States
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<string>("all")
  
  const navigate = useNavigate()
  
  const debouncedSearch = useDebounce(search, 500)
  const debouncedTopic = useDebounce(topic, 500)

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, debouncedTopic, difficulty])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", "10")
      
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (debouncedTopic) params.append("topic", debouncedTopic)
      if (difficulty && difficulty !== "all") params.append("difficulty", difficulty)

      const response = await api.get(`/questions?${params.toString()}`)
      setQuestions(response.data.questions)
      setPagination(response.data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch questions.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [currentPage, debouncedSearch, debouncedTopic, difficulty])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this question? This will also delete its scheduled revisions.")) return;
    try {
      await api.delete(`/questions/${id}`)
      toast.success("Question deleted successfully!")
      fetchQuestions()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete question.")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "Hard": return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default: return "bg-secondary"
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && (!pagination || page <= pagination.totalPages)) {
      setCurrentPage(page)
    }
  }

  const resetFilters = () => {
    setSearch("")
    setTopic("")
    setDifficulty("all")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">All Questions</h2>
        <p className="text-muted-foreground">
          View and manage your entire DSA question library.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium leading-none">Search Name</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g. Two Sum"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium leading-none">Topic</label>
          <Input
            type="text"
            placeholder="e.g. Arrays, Graphs..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[200px] space-y-1">
          <label className="text-sm font-medium leading-none">Difficulty</label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(search || topic || difficulty !== "all") && (
          <Button variant="ghost" className="shrink-0 h-10 px-3" onClick={resetFilters}>
            <FilterX className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="rounded-md border relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Topic</TableHead>
              <TableHead className="hidden sm:table-cell">Platform</TableHead>
              <TableHead className="hidden lg:table-cell">Solved Date</TableHead>
              <TableHead className="text-right">Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No questions match your filters.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question._id}>
                  <TableCell className="font-medium">{question.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{question.topic}</TableCell>
                  <TableCell className="hidden sm:table-cell">{question.platform}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {new Date(question.solvedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Solve
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => navigate(`/dashboard/edit/${question._id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(question._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage - 1)
                }} 
                href="#"
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(i + 1)
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage + 1)
                }}
                className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
