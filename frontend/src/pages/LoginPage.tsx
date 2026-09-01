import { GoogleLogin } from "@react-oauth/google"
import { useAuthStore } from "@/store/useAuthStore"
import { useNavigate, Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse.credential)
        navigate("/dashboard")
      } catch (err) {
        console.error("Login failed:", err)
      }
    }
  }

  const handleError = () => {
    console.error("Google Login Failed")
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 h-[calc(100vh-3.5rem)]">
      <div className="max-w-sm w-full p-8 border rounded-xl shadow-sm bg-card text-card-foreground space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to access your DSA Revision Tracker.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center pt-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="outline"
              shape="pill"
            />
          )}
        </div>
      </div>
    </div>
  )
}
