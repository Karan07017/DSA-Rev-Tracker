import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RootLayout } from "@/layouts/RootLayout"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { AddQuestionPage } from "@/pages/AddQuestionPage"
import { AllQuestionsPage } from "@/pages/AllQuestionsPage"
import { StatisticsPage } from "@/pages/StatisticsPage"
import { CalendarPage } from "@/pages/CalendarPage"

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
        path: "questions",
        element: <AllQuestionsPage />,
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
