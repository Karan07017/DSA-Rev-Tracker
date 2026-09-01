import { useEffect } from "react"
import { AppRouter } from "@/routes"
import { useAuthStore } from "@/store/useAuthStore"
import { Loader2 } from "lucide-react"

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <AppRouter />
}

export default App
