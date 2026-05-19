import { useState } from "react";
import { useShopProducts, useUpdateShopProduct, useToggleShopProduct } from "../hooks/useShopProducts";
import { type ShopProduct } from "../api/shopService";
import { Pencil, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddProductModal from "./AddProductModal";

const SHOP_ID = "shop-1";

const categories = [
  { id: "1", name: "Dairy", sub_categories: [
    { id: "1-1", name: "Milk" }, { id: "1-2", name: "Cheese" },
    { id: "1-3", name: "Yogurt" }, { id: "1-4", name: "Eggs" },
  ]},
  { id: "2", name: "Grains", sub_categories: [
    { id: "2-1", name: "Rice" }, { id: "2-2", name: "Pasta" }, { id: "2-3", name: "Bread" },
  ]},
  { id: "3", name: "Beverages", sub_categories: [
    { id: "3-1", name: "Juice" }, { id: "3-2", name: "Water" },
    { id: "3-3", name: "Tea" }, { id: "3-4", name: "Coffee" },
  ]},
  { id: "4", name: "Snacks", sub_categories: [
    { id: "4-1", name: "Chips" }, { id: "4-2", name: "Chocolate" }, { id: "4-3", name: "Biscuits" },
  ]},
  { id: "5", name: "Meat", sub_categories: [
    { id: "5-1", name: "Poultry" }, { id: "5-2", name: "Beef" }, { id: "5-3", name: "Fish" },
  ]},
  { id: "6", name: "Oils", sub_categories: [
    { id: "6-1", name: "Cooking Oil" }, { id: "6-2", name: "Olive Oil" },
  ]},
  { id: "7", name: "Bakery", sub_categories: [
    { id: "7-1", name: "Bread" }, { id: "7-2", name: "Pastry" },
  ]},
  { id: "8", name: "Canned Goods", sub_categories: [
    { id: "8-1", name: "Paste" }, { id: "8-2", name: "Fish" }, { id: "8-3", name: "Vegetables" },
  ]},
  { id: "10", name: "Spreads", sub_categories: [
    { id: "10-1", name: "Honey" }, { id: "10-2", name: "Jam" },
  ]},
  { id: "11", name: "Condiments", sub_categories: [
    { id: "11-1", name: "Sauces" }, { id: "11-2", name: "Vinegar" },
  ]},
  { id: "12", name: "Baking", sub_categories: [
    { id: "12-1", name: "Sugar" }, { id: "12-2", name: "Salt" },
  ]},
];

type EditingRow = {
  productId: string;
  price: string;
  stock: string;
};

type Toast = {
  id: number;
  message: string;
  type: "success" | "warning";
};

export default function ShopInventory() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<ShopProduct | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading } = useShopProducts(SHOP_ID, page);
  const updateProduct = useUpdateShopProduct();
  const toggleProduct = useToggleShopProduct();

  const totalPages = Math.ceil((data?.total ?? 0) / 25);
  const selectedCategory = categories.find(c => c.id === categoryFilter);

  const filtered = data?.data.filter(p => {
    if (categoryFilter && p.category_id !== categoryFilter) return false;
    if (subCategoryFilter && p.sub_category_id !== subCategoryFilter) return false;
    return true;
  });

  const addToast = (message: string, type: "success" | "warning" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

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
          addToast(`Price updated EGP ${oldPrice} to EGP ${newPrice}`);
        }
        if (oldStock === 0 && newStock > 0) {
          addToast("Product is now visible to customers again", "warning");
        }
        setEditingRow(null);
      },
    });
  };

  const handleToggleClick = (product: ShopProduct) => {
    if (product.is_active) {
      setConfirmToggle(product);
    } else {
      toggleProduct.mutate({ shopId: SHOP_ID, productId: product.product_id, is_active: true });
    }
  };

  const handleConfirmToggle = () => {
    if (!confirmToggle) return;
    toggleProduct.mutate({
      shopId: SHOP_ID,
      productId: confirmToggle.product_id,
      is_active: false,
    }, {
      onSuccess: () => setConfirmToggle(null),
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
            toast.type === "warning"
              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}>
            <Check className="w-4 h-4 shrink-0" />
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shop Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your store's product listings, prices, and stock.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowAddModal(true)}>
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setSubCategoryFilter(""); }}
          className="h-8 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {selectedCategory && (
          <select value={subCategoryFilter}
            onChange={e => setSubCategoryFilter(e.target.value)}
            className="h-8 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring">
            <option value="">All Sub-Categories</option>
            {selectedCategory.sub_categories.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}

        {(categoryFilter || subCategoryFilter) && (
          <button onClick={() => { setCategoryFilter(""); setSubCategoryFilter(""); }}
            className="h-8 px-3 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/50 flex items-center gap-1.5">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-scroll">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Product Name</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Sub-Category</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Price (EGP)</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Stock</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Active</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered?.map((product: ShopProduct) => {
                const isEditing = editingRow?.productId === product.product_id;
                return (
                  <tr key={product.product_id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                          {product.product_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold whitespace-nowrap">{product.product_name}</p>
                          {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm whitespace-nowrap">{product.category_name}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{product.sub_category_name}</td>
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
                          {product.available_stock === 0 ? "Out of stock" : `${product.available_stock} units`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <button type="button"
                        onClick={() => handleToggleClick(product)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${product.is_active ? "bg-primary" : "bg-muted-foreground/30"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${product.is_active ? "left-5" : "left-0.5"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
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
                        <button onClick={() => handleStartEdit(product)}
                          className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
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
            Showing <span className="font-semibold text-foreground">{((page - 1) * 25) + 1}</span> to <span className="font-semibold text-foreground">{Math.min(page * 25, data?.total ?? 0)}</span> of <span className="font-semibold text-foreground">{data?.total}</span> products
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 h-7 flex items-center justify-center rounded border border-border text-xs font-medium text-muted-foreground disabled:opacity-40 hover:bg-muted/50">
              Previous
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
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
              className="px-3 h-7 flex items-center justify-center rounded border border-border text-xs font-medium text-muted-foreground disabled:opacity-40 hover:bg-muted/50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Toggle Modal */}
      {confirmToggle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="text-base font-semibold">Hide Product</h3>
            <p className="text-sm text-muted-foreground">
              This will hide <span className="font-semibold text-foreground">"{confirmToggle.product_name}"</span> from all customers. Continue?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmToggle(null)}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmToggle}
                disabled={toggleProduct.isPending}>
                {toggleProduct.isPending ? "Hiding..." : "Hide Product"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}