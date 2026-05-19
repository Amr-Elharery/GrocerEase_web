import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, MoreVertical } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { Button } from "@/components/ui/button";
import type { Product } from "../api/productService";
import { useSearch } from "@/Context/SearchContext";

const categoryColors: Record<string, string> = {
  Dairy: "bg-blue-50 text-blue-600",
  Grains: "bg-yellow-50 text-yellow-600",
  Beverages: "bg-cyan-50 text-cyan-600",
  Snacks: "bg-orange-50 text-orange-600",
  Meat: "bg-red-50 text-red-600",
  Oils: "bg-lime-50 text-lime-600",
  Bakery: "bg-amber-50 text-amber-600",
  "Canned Goods": "bg-slate-50 text-slate-600",
  Frozen: "bg-sky-50 text-sky-600",
  Spreads: "bg-pink-50 text-pink-600",
  Condiments: "bg-violet-50 text-violet-600",
  Baking: "bg-emerald-50 text-emerald-600",
};

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function StatCard({
  label,
  value,
  helper,
  danger = false,
}: {
  label: string;
  value: string | number | undefined;
  helper?: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#DDE7DF] bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
        {label}
      </p>

      <p
        className={`mt-0.5 text-[22px] font-bold ${
          danger ? "text-red-600" : "text-[#101828]"
        }`}
      >
        {value}
      </p>

      {helper && (
        <p
          className={`mt-0.5 text-xs font-medium ${
            danger ? "text-red-600" : "text-green-600"
          }`}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

export default function ProductList() {
  const [page, setPage] = useState(1);
  const { search } = useSearch();
  const { data, isLoading } = useProducts(page);
  const navigate = useNavigate();

  const totalPages = Math.ceil((data?.total ?? 0) / 25);

  const filtered = data?.data.filter((product) => {
    const searchValue = search.toLowerCase();

    return (
      product.product_name.toLowerCase().includes(searchValue) ||
      product.barcode.includes(search) ||
      product.category_name.toLowerCase().includes(searchValue) ||
      product.brand.toLowerCase().includes(searchValue)
    );
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading products...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1420px] space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#667085]">
        <span>Catalogue</span>
        <span>›</span>
        <span className="font-semibold text-[#101828]">Products</span>
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[23px] font-bold tracking-tight text-[#101828]">
            Product Management
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Manage product catalogue, inventory status, and store coverage.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate("/app/inventory/create")}
          className="h-10 w-fit gap-2 rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#00571C]"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={data?.total.toLocaleString()}
          helper="↑ 12% from last month"
        />

        <StatCard label="Active SKUs" value="8,912" helper="— Steady" />

        <StatCard
          label="Out of Stock"
          value="142"
          helper="⚠ Requires attention"
          danger
        />

        <div className="rounded-xl border border-[#DDE7DF] bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
            Store Coverage
          </p>

          <p className="mt-0.5 text-[22px] font-bold text-[#101828]">94%</p>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E8F0EA]">
            <div
              className="h-full rounded-full bg-[#006B22]"
              style={{ width: "94%" }}
            />
          </div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8] text-[11px] font-semibold uppercase tracking-wide text-[#5F7168]">
              <th className="w-[220px] px-4 py-3">Product</th>
              <th className="w-[105px] px-3 py-3">Brand</th>
              <th className="w-[95px] px-3 py-3">Category</th>
              <th className="w-[115px] px-3 py-3">Sub-Category</th>
              <th className="w-[115px] px-3 py-3">Barcode</th>
              <th className="w-[65px] px-2 py-3 text-center">Unit</th>
              <th className="w-[85px] px-2 py-3">Created</th>
              <th className="w-[65px] px-2 py-3 text-center">Stores</th>
              <th className="w-[36px] px-2 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#DDE7DF]">
            {filtered?.map((product: Product, index: number) => (
              <tr key={index} className="transition hover:bg-[#F8FAF8]">
                <td className="px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F0EA] text-xs font-bold text-[#5F7168]">
                      {product.product_name.charAt(0)}
                    </div>

                    <span className="truncate text-sm font-semibold text-[#101828]">
                      {product.product_name}
                    </span>
                  </div>
                </td>

                <td className="truncate px-3 py-2.5 text-sm text-[#5F7168]">
                  {product.brand}
                </td>

                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      categoryColors[product.category_name] ??
                      "bg-[#F3F4F6] text-[#667085]"
                    }`}
                  >
                    {product.category_name}
                  </span>
                </td>

                <td className="truncate px-3 py-2.5 text-sm text-[#5F7168]">
                  {product.sub_category_name}
                </td>

                <td className="truncate px-3 py-2.5 font-mono text-[11px] text-[#5F7168]">
                  {product.barcode}
                </td>

                <td className="whitespace-nowrap px-2 py-2.5 text-center text-sm text-[#5F7168]">
                  {product.unit}
                </td>

                <td className="whitespace-nowrap px-2 py-2.5 text-sm text-[#5F7168]">
                  {formatShortDate(product.created_at)}
                </td>

                <td className="whitespace-nowrap px-2 py-2.5 text-center text-sm text-[#5F7168]">
                  {product.stores_count}
                </td>

                <td className="px-2 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/app/inventory/${index + 1}/edit`)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-[#E8F0EA] hover:text-[#101828]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#DDE7DF] px-4 py-2.5">
          <p className="text-xs text-[#667085]">
            Showing{" "}
            <span className="font-semibold text-[#101828]">
              {(page - 1) * 25 + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#101828]">
              {Math.min(page * 25, data?.total ?? 0)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#101828]">
              {data?.total.toLocaleString()}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 items-center justify-center rounded-lg border border-[#DDE7DF] px-3 text-xs font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40"
            >
              Previous
            </button>

            {[...Array(Math.min(3, totalPages))].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  page === i + 1
                    ? "border-[#006B22] bg-[#006B22] text-white"
                    : "border-[#DDE7DF] text-[#5F7168] hover:bg-[#F8FAF8]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {totalPages > 4 && (
              <span className="text-xs text-[#667085]">...</span>
            )}

            {totalPages > 3 && (
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  page === totalPages
                    ? "border-[#006B22] bg-[#006B22] text-white"
                    : "border-[#DDE7DF] text-[#5F7168] hover:bg-[#F8FAF8]"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="flex h-8 items-center justify-center rounded-lg border border-[#DDE7DF] px-3 text-xs font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}