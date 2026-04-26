import { useState } from "react";
import { useNavigate } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { Button } from "@/components/ui/button";
import type { Product } from "../api/productService";
import { useSearch } from "@/Context/SearchContext";

const categoryColors: Record<string, string> = {
  "Dairy": "bg-blue-50 text-blue-600",
  "Grains": "bg-yellow-50 text-yellow-600",
  "Beverages": "bg-cyan-50 text-cyan-600",
  "Snacks": "bg-orange-50 text-orange-600",
  "Meat": "bg-red-50 text-red-600",
  "Oils": "bg-lime-50 text-lime-600",
  "Bakery": "bg-amber-50 text-amber-600",
  "Canned Goods": "bg-slate-50 text-slate-600",
  "Frozen": "bg-sky-50 text-sky-600",
  "Spreads": "bg-pink-50 text-pink-600",
  "Condiments": "bg-violet-50 text-violet-600",
  "Baking": "bg-emerald-50 text-emerald-600",
};

export default function ProductList() {
  const [page, setPage] = useState(1);
  const { search } = useSearch();
  const { data, isLoading } = useProducts(page);
  const totalPages = Math.ceil((data?.total ?? 0) / 25);
  const navigate = useNavigate();

  const filtered = data?.data.filter(product =>
    product.product_name.toLowerCase().includes(search.toLowerCase()) ||
    product.barcode.includes(search) ||
    product.category_name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Catalogue</span>
        <span>›</span>
        <span className="text-foreground font-medium">Products</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/app/inventory/create")}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-border p-4 rounded-lg">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Products</p>
          <p className="text-2xl font-bold mt-1">{data?.total.toLocaleString()}</p>
          <p className="text-xs text-green-600 font-semibold mt-0.5">↑ 12% from last month</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-lg">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active SKUs</p>
          <p className="text-2xl font-bold mt-1">8,912</p>
          <p className="text-xs text-muted-foreground mt-0.5">— Steady</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-lg">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Out of Stock</p>
          <p className="text-2xl font-bold mt-1 text-destructive">142</p>
          <p className="text-xs text-destructive mt-0.5">⚠ Requires Attention</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-lg">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Store Coverage</p>
          <p className="text-2xl font-bold mt-1">94%</p>
          <div className="w-full bg-muted h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: "94%" }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Product Name</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Brand</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Sub-Category</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Barcode</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap text-center">Unit</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    Created At
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Store Count</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered?.map((product: Product, index: number) => (
                <tr key={index} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {product.product_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm whitespace-nowrap">{product.product_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{product.brand}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${categoryColors[product.category_name] ?? "bg-muted text-muted-foreground"}`}>
                      {product.category_name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{product.sub_category_name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{product.barcode}</td>
                  <td className="px-4 py-2.5 text-center text-sm text-muted-foreground whitespace-nowrap">{product.unit}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(product.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">Listed in {product.stores_count} stores</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => navigate(`/app/inventory/${index + 1}/edit`)}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{((page - 1) * 25) + 1}</span> to <span className="font-semibold text-foreground">{Math.min(page * 25, data?.total ?? 0)}</span> of <span className="font-semibold text-foreground">{data?.total.toLocaleString()}</span> products
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
    </div>
  );
}