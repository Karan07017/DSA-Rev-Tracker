import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RootLayout } from "@/layouts/RootLayout"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { AddQuestionPage } from "@/pages/AddQuestionPage"
import { EditQuestionPage } from "@/pages/EditQuestionPage"
import { AllQuestionsPage } from "@/pages/AllQuestionsPage"
import { StatisticsPage } from "@/pages/StatisticsPage"
import { CalendarPage } from "@/pages/CalendarPage"
import { TodosPage } from "@/pages/TodosPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "add",
        element: <AddQuestionPage />,
      },
      {
        path: "edit/:id",
        element: <EditQuestionPage />,
      },
      {
        path: "questions",
        element: <AllQuestionsPage />,
      },
      {
        path: "todos",
        element: <TodosPage />,
      },
      {
        path: "statistics",
        element: <StatisticsPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      }
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
