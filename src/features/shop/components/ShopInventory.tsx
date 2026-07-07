import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useShopProducts, useUpdateShopProduct, useDeleteShopProduct, useMarkAvailable, useMarkUnavailable } from "../hooks/useShopProducts";
import { useMyShop } from "../hooks/useShop";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useSearch } from "@/Context/SearchContext";
import { type ShopProduct } from "../api/shopService";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddProductModal from "./AddProductModal";
import FilterDropdown from "./FilterDropdown";
import { Switch } from "@/components/ui/switch";

type EditingRow = {
  productId: string;
  price: string;
  stock: string;
};

type Toast = {
  id: number;
  message: string;
  type: "success" | "warning" | "error";
};

function readApiError(err: unknown, fallback: string): string {
  const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
  let message = fallback;
  if (typeof detail === "string") message = detail;
  else if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
    message = (detail[0] as { msg: string }).msg;
  }
  return message.replace(/^\d{3}:\s*/, "");
}

export default function ShopInventory() {
  const { t } = useTranslation(["common", "shop"]);
  const { search } = useSearch();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ShopProduct | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const [showAddModal, setShowAddModal] = useState(false);
const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const { data: myShop } = useMyShop();
  const SHOP_ID = myShop ? String(myShop.id) : "";

  const { data: flatCategories = [] } = useCategories();
  const categories = flatCategories
    .filter((c) => c.parent_id === null)
    .map((c) => ({
      id: c.id,
      name: c.name,
      sub_categories: flatCategories
        .filter((s) => s.parent_id === c.id)
        .map((s) => ({ id: s.id, name: s.name })),
    }));

  const searchTerm = search.trim().toLowerCase();
  const isFiltering = Boolean(categoryFilter || subCategoryFilter || searchTerm);
  const { data, isLoading } = useShopProducts(SHOP_ID, isFiltering ? 1 : page, isFiltering ? 100 : undefined);
  const updateProduct = useUpdateShopProduct();
  const deleteProduct = useDeleteShopProduct();
  const markAvailable = useMarkAvailable();
  const markUnavailable = useMarkUnavailable();

  const addToast = (message: string, type: "success" | "warning" | "error" = "success") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    deleteProduct.mutate(confirmDelete.product_id, {
      onSuccess: () => {
        addToast(t("shop:inventory.toastRemoved", { name: confirmDelete.product_name }));
        setConfirmDelete(null);
      },
      onError: (err) => {
        addToast(readApiError(err, t("shop:inventory.toastRemoveError")), "error");
        setConfirmDelete(null);
      },
    });
  };
const handleToggleAvailability = (product: ShopProduct) => {
  if (loadingProductId) return;

  setLoadingProductId(product.product_id);

  if (product.is_available) {
    markUnavailable.mutate(
      { shopId: SHOP_ID, productId: product.product_id },
      {
        onSuccess: () =>
          addToast(t("shop:inventory.toastNowHidden", { name: product.product_name }), "warning"),

        onError: (err) =>
          addToast(readApiError(err, t("shop:inventory.toastStatusError")), "error"),

        onSettled: () => setLoadingProductId(null),
      }
    );
  } else {
    markAvailable.mutate(
      { shopId: SHOP_ID, productId: product.product_id },
      {
        onSuccess: () =>
          addToast(t("shop:inventory.toastNowVisible", { name: product.product_name })),

        onError: (err) =>
          addToast(readApiError(err, t("shop:inventory.toastStatusError")), "error"),

        onSettled: () => setLoadingProductId(null),
      }
    );
  }
};

  const totalPages = Math.ceil((data?.total ?? 0) / (data?.limit ?? 25));

  const filtered = data?.data.filter(p => {
    if (categoryFilter && p.category_id !== categoryFilter) return false;
    if (subCategoryFilter && p.sub_category_id !== subCategoryFilter) return false;
    if (searchTerm &&
        !p.product_name.toLowerCase().includes(searchTerm) &&
        !(p.brand ?? "").toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  const handleStartEdit = (product: ShopProduct) => {
    setEditingRow({
      productId: product.product_id,
      price: String(product.price),
      stock: String(product.available_stock),
    });
  };

  const handleSaveEdit = (product: ShopProduct) => {
    if (!editingRow) return;
    const newPrice = parseFloat(editingRow.price);
    const newStock = parseInt(editingRow.stock);
    const oldPrice = product.price;
    const oldStock = product.available_stock;

    updateProduct.mutate({
      shopId: SHOP_ID,
      productId: product.product_id,
      payload: { price: newPrice, available_stock: newStock },
    }, {
      onSuccess: () => {
        if (newPrice !== oldPrice) {
          addToast(t("shop:inventory.toastPriceUpdated", { oldPrice, newPrice }));
        }
        if (oldStock === 0 && newStock > 0) {
          addToast(t("shop:inventory.toastVisibleAgain"), "warning");
        }
        setEditingRow(null);
      },
      onError: (err) => {
        addToast(readApiError(err, t("shop:inventory.toastSaveError")), "error");
      },
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <p className="text-muted-foreground">{t("shop:inventory.loading")}</p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Toasts */}
      <div className="fixed top-4 end-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : toast.type === "warning"
              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}>
            {toast.type === "error"
              ? <X className="w-4 h-4 shrink-0" />
              : <Check className="w-4 h-4 shrink-0" />}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("shop:inventory.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("shop:inventory.subtitle")}</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowAddModal(true)}>
          <Plus className="w-3.5 h-3.5" />
          {t("shop:inventory.addProduct")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <FilterDropdown
          value={categoryFilter}
          onChange={(v) => { setCategoryFilter(v); setSubCategoryFilter(""); }}
          placeholder={t("shop:inventory.allCategories")}
          options={[
            { value: "", label: t("shop:inventory.allCategories") },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        {(categoryFilter || subCategoryFilter) && (
          <button onClick={() => { setCategoryFilter(""); setSubCategoryFilter(""); }}
            className="h-9 px-3 rounded-lg border border-[#DDE7DF] text-xs font-medium text-[#5F7168] hover:bg-[#F8FAF8] flex items-center gap-1.5">
            <X className="w-3 h-3" /> {t("common:actions.clear")}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-scroll">
          <table className="min-w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2.5 text-start text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t("shop:inventory.columns.productName")}</th>
                <th className="px-4 py-2.5 text-start text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t("shop:inventory.columns.category")}</th>
                <th className="px-4 py-2.5 text-start text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t("shop:inventory.columns.price")}</th>
                <th className="px-4 py-2.5 text-start text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t("shop:inventory.columns.stock")}</th>
                <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t("shop:inventory.columns.availability")}</th>
                <th className="px-4 py-2.5 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered?.map((product: ShopProduct) => {
                const isEditing = editingRow?.productId === product.product_id;
                return (
                  <tr key={product.product_id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-muted flex items-center justify-center overflow-hidden text-xs font-bold text-muted-foreground shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            product.product_name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold whitespace-nowrap">{product.product_name}</p>
                          {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm whitespace-nowrap">{product.category_name}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {isEditing ? (
                        <input type="number" value={editingRow.price} step="0.01"
                          onChange={e => setEditingRow(p => p ? { ...p, price: e.target.value } : p)}
                          className="w-24 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring" />
                      ) : (
                        <span className="text-sm font-medium">EGP {product.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {isEditing ? (
                        <input type="number" value={editingRow.stock}
                          onChange={e => setEditingRow(p => p ? { ...p, stock: e.target.value } : p)}
                          className="w-20 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring" />
                      ) : (
                        <span className={`text-sm font-medium ${product.available_stock === 0 ? "text-destructive" : ""}`}>
                          {product.available_stock === 0 ? t("shop:inventory.outOfStock") : t("shop:inventory.unitsCount", { n: product.available_stock })}
                        </span>
                      )}
                    </td>
                 <td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center">
  <Switch
   checked={product.is_available}
   disabled={loadingProductId === product.product_id}
   onCheckedChange={() => handleToggleAvailability(product)}
  />
 </div>
</td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => handleSaveEdit(product)}
                            className="w-7 h-7 flex items-center justify-center rounded border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingRow(null)}
                            className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/50 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => handleStartEdit(product)}
                            className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setConfirmDelete(product)}
                            className="w-7 h-7 flex items-center justify-center rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
         <p className="text-sm text-muted-foreground">
  {(data?.total ?? 0) === 0 ? (
    t("shop:inventory.showingZero")
  ) : (
    t("shop:inventory.showing", {
      from: ((page - 1) * 25) + 1,
      to: Math.min(page * 25, data?.total ?? 0),
      total: data?.total,
    })
  )}
</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 h-7 flex items-center justify-center rounded border border-border text-xs font-medium text-muted-foreground disabled:opacity-40 hover:bg-muted/50">
              {t("common:actions.previous")}
            </button>
            {[...Array(Math.min(3, totalPages))].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-7 h-7 flex items-center justify-center rounded border text-xs font-semibold transition-colors ${
                  page === i + 1 ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted/50"
                }`}>
                {i + 1}
              </button>
            ))}
            {totalPages > 4 && <span className="text-muted-foreground text-xs">...</span>}
            {totalPages > 3 && (
              <button onClick={() => setPage(totalPages)}
                className={`w-7 h-7 flex items-center justify-center rounded border text-xs font-semibold transition-colors ${
                  page === totalPages ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted/50"
                }`}>
                {totalPages}
              </button>
            )}
           <button
  onClick={() => setPage(p => p + 1)}
  disabled={(data?.total ?? 0) === 0 || page >= totalPages}
  className="px-3 h-7 flex items-center justify-center rounded border border-border text-xs font-medium text-muted-foreground disabled:opacity-40 hover:bg-muted/50"
>
  {t("common:actions.next")}
</button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="text-base font-semibold">{t("shop:inventory.removeProductTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("shop:inventory.removeProductMessage", { name: confirmDelete.product_name })}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>{t("common:actions.cancel")}</Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmDelete}
                disabled={deleteProduct.isPending}>
                {deleteProduct.isPending ? t("shop:inventory.removing") : t("shop:inventory.remove")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal shopId={SHOP_ID} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}