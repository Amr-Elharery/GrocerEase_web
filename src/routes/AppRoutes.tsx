import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@/features/auth/components/Login";
import ForgotPassword from "@/features/auth/components/ForgotPassword";
import ResetPassword from "@/features/auth/components/ResetPassword";
import Home from "@/features/auth/components/Home";
import Profile from "@/features/profile/components/Profile";
import SignUp from "@/features/auth/components/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },

 
  {
    path: "*",
    element: (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Page not found
      </div>
    ),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}