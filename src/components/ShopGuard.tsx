import { Navigate } from "react-router";
import { useMyShop } from "@/features/shop/hooks/useShop";

export default function ShopGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useMyShop();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F8F5]">
        <p className="text-sm text-[#667085]">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/store/create-shop" replace />;
  }

  return <>{children}</>;
}
