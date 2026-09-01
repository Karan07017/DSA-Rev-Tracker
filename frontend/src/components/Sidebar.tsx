import { NavLink } from "react-router-dom"
import { BarChart3, CalendarDays, LayoutDashboard, List, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    end: true // Exact match for dashboard root
  },
  {
    title: "All Questions",
    href: "/dashboard/questions",
    icon: List,
  },
  {
    title: "Statistics",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
]

export function Sidebar() {
  return (
    <div className="pb-12 h-full flex flex-col">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start p-0"
                asChild
              >
                <NavLink 
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) => 
                    cn(
                      "flex items-center w-full px-4 py-2 rounded-md transition-colors",
                      isActive 
                        ? "bg-secondary text-secondary-foreground font-medium" 
                        : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                    )
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </NavLink>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Actions
          </h2>
          <div className="space-y-1">
            <Button
              variant="default"
              className="w-full justify-start"
              asChild
            >
              <NavLink 
                to="/dashboard/add"
                className={({ isActive }) => 
                  isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
