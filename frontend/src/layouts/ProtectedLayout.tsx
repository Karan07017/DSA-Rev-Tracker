import { Navigate, Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/store/useAuthStore"

export function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-muted/20 md:flex">
          <div className="flex h-14 items-center gap-2 border-b px-4 lg:px-6 font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>DSA Tracker</span>
          </div>
          <div className="flex-1 overflow-auto py-4 px-3">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header area containing mobile trigger and Navbar content */}
          <header className="sticky top-0 z-40 flex h-14 w-full items-center border-b bg-background/95 backdrop-blur">
            <div className="flex items-center px-4 md:hidden">
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex h-14 items-center gap-2 border-b px-6 font-bold">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>DSA Tracker</span>
                  </div>
                  <div className="py-4 px-3">
                    <Sidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="flex-1">
              <Navbar isAuthenticated={true} />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
