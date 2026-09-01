import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ExternalLink, Trash2, Check, Plus } from "lucide-react"
import { toast } from "sonner"

interface Todo {
  _id: string;
  name: string;
  link: string;
}

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Form state
  const [newName, setNewName] = useState("")
  const [newLink, setNewLink] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  
  const navigate = useNavigate()

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/todos')
      setTodos(response.data.todos)
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to fetch to-do list.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newLink.trim()) {
      toast.error("Both name and link are required.")
      return
    }

    try {
      setIsAdding(true)
      await api.post('/todos', { name: newName, link: newLink })
      toast.success("Added to To-Do list!")
      setNewName("")
      setNewLink("")
      fetchTodos()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add to-do.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`)
      toast.success("To-Do deleted!")
      fetchTodos()
    } catch (error: any) {
      toast.error("Failed to delete to-do.")
    }
  }

  const handleComplete = (todo: Todo) => {
    // Navigate to Add Question page with prefilled data
    const searchParams = new URLSearchParams({
      todoId: todo._id,
      name: todo.name,
      link: todo.link
    })
    navigate(`/dashboard/add?${searchParams.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">To-Do List</h2>
        <p className="text-muted-foreground">
          Queue up questions you want to solve later. Check them off to add them to your revision tracker.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-card">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-sm font-medium">Question Name</label>
            <Input 
              placeholder="e.g. Merge Intervals" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
            />
          </div>
          <div className="flex-1 space-y-1 w-full">
            <label className="text-sm font-medium">URL Link</label>
            <Input 
              placeholder="https://leetcode.com/..." 
              value={newLink} 
              onChange={(e) => setNewLink(e.target.value)} 
            />
          </div>
          <Button type="submit" disabled={isAdding} className="w-full sm:w-auto">
            {isAdding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Add To-Do
          </Button>
        </form>
      </div>

      <div className="rounded-md border relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Solve</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  Your to-do list is empty. Add a question above!
                </TableCell>
              </TableRow>
            ) : (
              todos.map((todo) => (
                <TableRow key={todo._id}>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-dashed hover:border-solid hover:bg-green-500/10 hover:text-green-500 hover:border-green-500"
                      onClick={() => handleComplete(todo)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{todo.name}</TableCell>
                  <TableCell>
                    <a
                      href={todo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      View Problem
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(todo._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
