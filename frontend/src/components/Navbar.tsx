import { Link, useNavigate } from "react-router-dom"
import { BookOpen, User as UserIcon, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/useAuthStore"

export function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Title (Only visible if not authenticated to prevent double titles when sidebar takes over) */}
      {!isAuthenticated && (
        <Link to="/" className="flex items-center gap-2 font-bold md:hidden">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>DSA Tracker</span>
        </Link>
      )}

      {/* Desktop Title for Public routes */}
      {!isAuthenticated && (
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>DSA Tracker</span>
          </Link>
        </div>
      )}

      {/* spacer for when authenticated on mobile, pushing items right */}
      {isAuthenticated && <div className="md:hidden flex-1" />}
      {isAuthenticated && <div className="hidden md:block flex-1" />}

      <div className="flex justify-end items-center gap-4 flex-1">
        <ThemeToggle />
        
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.picture || ""} alt={user.name} />
                  <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          !isAuthenticated && (
            <Button size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )
        )}
      </div>
    </div>
  )
}
