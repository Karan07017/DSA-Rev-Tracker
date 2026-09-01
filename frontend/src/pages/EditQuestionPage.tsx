import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  name: z.string().min(2, { message: "Question name is required." }),
  link: z.string().url({ message: "Must be a valid URL." }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topic: z.string().min(2, { message: "Topic is required." }),
  platform: z.string().min(2, { message: "Platform is required." }),
  helpTaken: z.enum(["No Help", "Hint", "Discussion", "Editorial", "YouTube", "AI"]),
  approach: z.string().optional(),
  remarks: z.string().optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  veryImportant: z.boolean().default(false),
})

type QuestionFormValues = z.infer<typeof formSchema>

export function EditQuestionPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFetching, setIsFetching] = useState(true)

  const form = useForm<any>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      link: "",
      difficulty: undefined,
      topic: "",
      platform: "LeetCode",
      helpTaken: undefined,
      approach: "",
      remarks: "",
      timeComplexity: "",
      spaceComplexity: "",
      veryImportant: false,
    },
  })

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/questions/${id}`)
        const q = response.data.question
        form.reset({
          name: q.name,
          link: q.link,
          difficulty: q.difficulty,
          topic: q.topic,
          platform: q.platform,
          helpTaken: q.helpTaken,
          approach: q.approach || "",
          remarks: q.remarks || "",
          timeComplexity: q.timeComplexity || "",
          spaceComplexity: q.spaceComplexity || "",
          veryImportant: q.veryImportant || false,
        })
      } catch (error: any) {
        toast.error("Failed to fetch question details.")
        navigate("/dashboard/questions")
      } finally {
        setIsFetching(false)
      }
    }
    fetchQuestion()
  }, [id, form, navigate])

  async function onSubmit(data: QuestionFormValues) {
    try {
      await api.put(`/questions/${id}`, data)
      toast.success("Question updated successfully!")
      navigate("/dashboard/questions")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update question.")
    }
  }

  const isLoading = form.formState.isSubmitting

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Question</h3>
        <p className="text-sm text-muted-foreground">
          Update the details of your tracked DSA question. Note: This will not change scheduled revision dates.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Two Sum" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control as any}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://leetcode.com/problems/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Input placeholder="LeetCode, Codeforces, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Arrays, DP, Graphs..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="helpTaken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Help Taken</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Did you take help?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="No Help">No Help</SelectItem>
                      <SelectItem value="Hint">Hint</SelectItem>
                      <SelectItem value="Discussion">Discussion</SelectItem>
                      <SelectItem value="Editorial">Editorial</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="AI">AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="timeComplexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Complexity</FormLabel>
                  <FormControl>
                    <Input placeholder="O(N log N)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="spaceComplexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Complexity</FormLabel>
                  <FormControl>
                    <Input placeholder="O(1)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control as any}
            name="approach"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approach / Intuition</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Briefly explain your thought process..." 
                    className="resize-y"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks (Edge cases, bugs, etc.)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What should you remember next time?" 
                    className="resize-y"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="veryImportant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Mark as Very Important
                  </FormLabel>
                  <FormDescription>
                    Pin this question for intensive review later.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  )
}
