import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMyShop } from "@/features/shop/hooks/useShop";

export default function ShopGuard({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common");
  const { isLoading, isError } = useMyShop();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F8F5]">
        <p className="text-sm text-[#667085]">{t("status.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/store/create-shop" replace />;
  }

  return <>{children}</>;
}
