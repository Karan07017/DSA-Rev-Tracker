import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          DSA Revision Tracker
        </h1>
        <p className="text-xl text-muted-foreground">
          Master Data Structures and Algorithms with the 1-4-7 revision strategy.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
