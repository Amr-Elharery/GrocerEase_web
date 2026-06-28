import { useState } from "react";
import { useAvailableProducts, useAddShopProduct } from "../hooks/useShopProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { type CatalogProduct } from "../api/shopService";
import { X, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RequestProductModal from "./RequestProductModal";
import FilterDropdown from "./FilterDropdown";


type Step = "pick" | "configure";

type Props = {
  shopId: string;
  onClose: () => void;
};

export default function AddProductModal({ shopId, onClose }: Props) {
  const SHOP_ID = shopId;

  const { data: flatCategories = [] } = useCategories();
  const categories = flatCategories
    .filter((c) => c.parent_id === null)
    .map((c) => ({ id: c.id, name: c.name }));
  const [step, setStep] = useState<Step>("pick");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [threshold, setThreshold] = useState("5");
  const [errors, setErrors] = useState<{ price?: string; stock?: string }>({});
  const [apiError, setApiError] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);

  const { data: availableProducts = [], isLoading } = useAvailableProducts(SHOP_ID, search, categoryFilter);
  const addShopProduct = useAddShopProduct();

  const handleSelectProduct = (product: CatalogProduct) => {
    setSelectedProduct(product);
    setStep("configure");
    setErrors({});
    setApiError("");
  };

  const handleSubmit = () => {
    const newErrors: { price?: string; stock?: string } = {};
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (stock === "" || isNaN(parsedStock) || parsedStock < 0) {
      newErrors.stock = "Stock must be 0 or more";
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (!selectedProduct) return;

    addShopProduct.mutate({
      shopId: SHOP_ID,
      payload: {
        product_id: selectedProduct.product_id,
        price: parsedPrice,
        available_stock: parsedStock,
        low_stock_threshold: parseInt(threshold) || 5,
      },
    }, {
      onSuccess: () => onClose(),
      onError: (err: unknown) => {
        const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
        let message = "Couldn't add the product. Please try again.";
        if (typeof detail === "string") message = detail;
        else if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
          message = (detail[0] as { msg: string }).msg;
        } else if (err instanceof Error && err.message) {
          message = err.message;
        }
        message = message.replace(/^\d{3}:\s*/, "");
        setApiError(message);
      },
    });
  };

  if (showRequestModal) {
    return (
      <RequestProductModal
        shopId={SHOP_ID}
        onClose={onClose}
        onBack={() => setShowRequestModal(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold">Add to Shop Inventory</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === "pick"
                ? "Search and select a product from the global catalog"
                : `Setting up ${selectedProduct?.product_name} for your store`}
            </p>
          </div>
          <button onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1 — Pick Product */}
        {step === "pick" && (
          <div className="p-5 space-y-4">

            {/* Search + Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by product name..."
                  className="w-full h-8 bg-muted/50 rounded pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <FilterDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="All Categories"
                options={[
                  { value: "", label: "All Categories" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>

            {/* Product List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
              ) : availableProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No products found</p>
              ) : (
                availableProducts.map(product => (
                  <button key={product.product_id} type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-muted/30 hover:border-primary/30 transition-colors text-left">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden text-xs font-bold text-muted-foreground shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        product.product_name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.product_name}</p>
                      <p className="text-xs text-muted-foreground">{product.category_name} · {product.sub_category_name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{product.brand}</span>
                  </button>
                ))
              )}
            </div>

            {/* Request Link */}
            <div className="pt-2 border-t border-border">
              <button type="button"
                onClick={() => setShowRequestModal(true)}
                className="text-xs text-primary hover:underline">
                Cannot find what you are looking for? Request a new product
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Configure */}
        {step === "configure" && selectedProduct && (
          <div className="p-5 space-y-4">

            {/* Product Confirmation */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden text-sm font-bold text-muted-foreground shrink-0">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  selectedProduct.product_name.charAt(0)
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{selectedProduct.product_name}</p>
                <p className="text-xs text-muted-foreground">{selectedProduct.brand} · {selectedProduct.category_name}</p>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label className="text-xs">Shop Price (EGP) *</Label>
              <div className="relative">
                <Input
                  type="number" value={price} step="0.01"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? "border-destructive pr-12" : "pr-12"}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">EGP</span>
              </div>
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <Label className="text-xs">Initial Stock Level *</Label>
              <Input
                type="number" value={stock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(e.target.value)}
                placeholder="0"
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-1.5">
              <Label className="text-xs">Low Stock Alert</Label>
              <Input
                type="number" value={threshold}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThreshold(e.target.value)}
                placeholder="5"
              />
              <p className="text-[11px] text-muted-foreground">You'll be warned when stock drops to this number.</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium">Active Status</p>
                <p className="text-xs text-muted-foreground">Product will be visible in the store app</p>
              </div>
              <div className="relative w-10 h-5 rounded-full bg-primary">
                <span className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                <p className="text-xs text-destructive">{apiError}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border">
          {step === "configure" && (
            <button onClick={() => { setStep("pick"); setApiError(""); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mr-auto">
              ← Back
            </button>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          {step === "configure" && (
            <Button size="sm" onClick={handleSubmit} disabled={addShopProduct.isPending}
              className="gap-1.5">
              <Check className="w-3.5 h-3.5" />
              {addShopProduct.isPending ? "Adding..." : "Add to Inventory"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}