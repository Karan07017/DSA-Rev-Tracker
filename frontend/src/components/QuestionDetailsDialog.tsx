import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, Database, Lightbulb, CheckCircle2, Bookmark } from "lucide-react"

export interface QuestionDetails {
  _id: string;
  name: string;
  link: string;
  difficulty: string;
  topic: string;
  platform: string;
  solvedDate: string;
  helpTaken?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  approach?: string;
  remarks?: string;
  veryImportant?: boolean;
}

interface QuestionDetailsDialogProps {
  question: QuestionDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionDetailsDialog({ question, isOpen, onClose }: QuestionDetailsDialogProps) {
  if (!question) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "Hard": return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default: return "bg-secondary"
    }
  }

  const getHelpColor = (help: string) => {
    if (help === "No Help") return "bg-green-500/10 text-green-500 border-green-500/20"
    return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {question.veryImportant && <Bookmark className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
              {question.name}
            </DialogTitle>
          </div>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline">{question.topic}</Badge>
            <Badge variant="outline">{question.platform}</Badge>
            {question.helpTaken && (
              <Badge variant="outline" className={getHelpColor(question.helpTaken)}>
                {question.helpTaken}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Complexities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border bg-card flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Time Complexity
              </span>
              <span className="font-mono text-sm">{question.timeComplexity || "Not specified"}</span>
            </div>
            <div className="p-3 rounded-lg border bg-card flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Database className="h-3 w-3" /> Space Complexity
              </span>
              <span className="font-mono text-sm">{question.spaceComplexity || "Not specified"}</span>
            </div>
          </div>

          {/* Approach */}
          {question.approach && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" /> Approach & Intuition
              </h4>
              <div className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap leading-relaxed">
                {question.approach}
              </div>
            </div>
          )}

          {/* Remarks */}
          {question.remarks && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Remarks & Edge Cases
              </h4>
              <div className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap leading-relaxed">
                {question.remarks}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Solved on: {new Date(question.solvedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full"
            >
              Solve again on {question.platform}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
