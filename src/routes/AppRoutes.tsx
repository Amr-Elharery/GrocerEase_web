import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import AuthLayout from "@/features/auth/components/AuthLayout";
import ProductList from "@/features/products/components/ProductList";
import CreateProductForm from "@/features/products/components/CreateProductForm";
import EditProductForm from "@/features/products/components/EditProductForm";
import CategoryManagement from "@/features/categories/components/CategoryManagement";
import SubmissionList from "@/features/submissions/components/SubmissionList";
import UserManagement from "@/features/users/components/UserManagement";
import AppLayout from "@/components/layouts/AdminLayout";
import StoreLayout from "@/components/layouts/StoreLayout";
import ShopInventory from "@/features/shop/components/ShopInventory";
import AuthGuard from "@/components/AuthGuard";
import Login from "@/features/auth/components/Login";
import SignUp from "@/features/auth/components/SignUp";
import ForgotPassword from "@/features/auth/components/ForgotPassword";
import ResetPassword from "@/features/auth/components/ResetPassword";
import Home from "@/features/auth/components/Home";
import Profile from "@/features/profile/components/Profile";
import OrderList from "@/features/orders/components/OrderList";
import StoreOrders from  "@/features/orders/components/StoreOrders";
import StoreDashboard from "@/features/analytics/components/StoreDashboard";
import AdminAnalyticsDashboard from "@/features/analytics/components/AdminAnalyticsDashboard";

const ComingSoon = ({ page }: { page: string }) => (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <h1 className="text-2xl font-bold text-muted-foreground">{page} Coming Soon</h1>
  </div>
);

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/app/home" replace /> },
      { path: "home", element: <AdminAnalyticsDashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "inventory", element: <ProductList /> },
      { path: "inventory/create", element: <CreateProductForm /> },
      { path: "inventory/:id/edit", element: <EditProductForm /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "submissions", element: <SubmissionList /> },
      { path: "users", element: <UserManagement /> },

{ path: "orders", element: <OrderList /> },
 ],
  },
  {
    path: "/store",
    element: (
      <AuthGuard>
        <StoreLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/store/inventory" replace /> },
      { path: "home", element: <StoreDashboard /> },
      { path: "inventory", element: <ShopInventory /> },
      { path: "orders", element: <StoreOrders /> },
      { path: "reports", element: <ComingSoon page="Reports" /> },
    ],
  },
  { path: "*", element: <Navigate to="/auth/login" replace /> },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}