import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
      <p className="text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-4">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}
