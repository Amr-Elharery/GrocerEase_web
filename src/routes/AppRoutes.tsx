import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "@/features/auth/components/Login";
import ForgotPassword from "@/features/auth/components/ForgotPassword";
import ResetPassword from "@/features/auth/components/ResetPassword";
import Home from "@/features/auth/components/Home";
import Profile from "@/features/profile/components/Profile";
import SignUp from "@/features/auth/components/SignUp";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    children: [
      { index: true, Component: Login },
      { path: "signup", Component: SignUp },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password/:token", Component: ResetPassword },
    ],
  },
  {
    path: "/app",
    children: [
      { index: true, Component: Home },
      { path: "home", Component: Home },
      { path: "profile", Component: Profile },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}