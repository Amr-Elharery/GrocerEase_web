import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import { Plus, MoreVertical, Pencil, Trash2, ChevronDown, Check, Filter } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Button } from "@/components/ui/button";
import type { Product } from "../api/productService";
import { useSearch } from "@/Context/SearchContext";
import StoreCoverageModal from "./StoreCoverageModal";

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

function getProductImage(product: Product): string | null {
  const images = product.product_images ?? [];
  if (images.length === 0) return null;
  const primary = images.find((img) => img.is_primary && img.image_url);
  return primary?.image_url ?? images.find((img) => img.image_url)?.image_url ?? null;
}

function CategoryFilterDropdown({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { t } = useTranslation("products");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];
  const resolvedPlaceholder = placeholder ?? t("list.filter.categoryPlaceholder");

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-[200px]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-[#078A2D] bg-white px-3 text-sm font-semibold text-[#101828] shadow-sm transition hover:bg-[#F0FDF4]"
      >
        <span className={value === "all" ? "text-[#667085] font-medium" : ""}>
          {value === "all" ? resolvedPlaceholder : selected.label}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#078A2D] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute start-0 top-[44px] z-30 max-h-[260px] w-full overflow-y-auto rounded-lg border border-[#CDE8D5] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-start text-sm transition ${
                value === o.value ? "bg-[#EAF7EE] font-semibold text-[#078A2D]" : "text-[#101828] hover:bg-[#F0FDF4]"
              }`}
            >
              <span className="truncate">{o.label}</span>
              {value === o.value && <Check className="h-4 w-4 shrink-0 text-[#078A2D]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductList() {
  const { t } = useTranslation(["common", "products"]);
  const [page, setPage] = useState(1);
  const { search } = useSearch();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const isFiltering = categoryFilter !== "all" || subFilter !== "all";
  const { data: products = [], isLoading } = useProducts(
    isFiltering ? 1 : page,
    search,
    isFiltering ? 100 : 10
  );
  const { data: categories = [] } = useCategories();
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();

  const [menuId, setMenuId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Product | null>(null);
  const [coverageTarget, setCoverageTarget] = useState<Product | null>(null);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setPage(1);
  }

  if (!isLoading && products.length === 0 && page > 1) {
    setPage((p) => p - 1);
  }

  const parents = categories.filter((c) => !c.parent_id);
  const parentByName = new Map(parents.map((c) => [c.name, c.id]));
  const selectedParentId = parentByName.get(categoryFilter);
  const subsOfSelected = categories.filter(
    (c) => c.parent_id && c.parent_id === selectedParentId
  );
  const subNamesOfSelected = subsOfSelected.map((s) => s.name);

  const parentOptions = [
    { value: "all", label: t("products:list.filter.allCategories") },
    ...parents.map((c) => ({ value: c.name, label: c.name })),
  ];
  const subOptions = [
    { value: "all", label: t("products:list.filter.allSubCategories") },
    ...subsOfSelected.map((c) => ({ value: c.name, label: c.name })),
  ];

  const filtered = products.filter((p) => {
    const catName = p.category?.category_name ?? "";
    const subName = p.sub_category?.category_name ?? "";

    const matchesParent =
      categoryFilter === "all" ||
      catName === categoryFilter ||
      subNamesOfSelected.includes(subName) ||
      subNamesOfSelected.includes(catName);

    const matchesSub =
      subFilter === "all" || subName === subFilter || catName === subFilter;

    return matchesParent && matchesSub;
  });

  const handleDelete = (product: Product) => {
    setMenuId(null);
    setConfirmTarget(product);
  };

  const confirmDelete = () => {
    if (!confirmTarget) return;
    deleteProduct.mutate(String(confirmTarget.id), {
      onSettled: () => setConfirmTarget(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">{t("products:list.loading")}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1420px] space-y-4">

      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => !deleteProduct.isPending && setConfirmTarget(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">{t("products:list.deleteConfirm.title")}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#475467]">
              <Trans
                i18nKey="products:list.deleteConfirm.message"
                values={{ name: confirmTarget.product_name }}
                components={{ 1: <span className="font-semibold text-[#101828]" /> }}
              />
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmTarget(null)} disabled={deleteProduct.isPending}
                className="h-9 rounded-lg border border-[#DDE7DF] px-4 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40">
                {t("common:actions.cancel")}
              </button>
              <button type="button" onClick={confirmDelete} disabled={deleteProduct.isPending}
                className="h-9 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {deleteProduct.isPending ? t("common:status.deleting") : t("common:actions.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {coverageTarget && (
        <StoreCoverageModal
          productId={coverageTarget.id}
          productName={coverageTarget.product_name}
          onClose={() => setCoverageTarget(null)}
        />
      )}

      {menuId !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
      )}

      <div className="flex items-center gap-2 text-xs text-[#667085]">
        <span>{t("products:list.breadcrumb.catalogue")}</span>
        <span>›</span>
        <span className="font-semibold text-[#101828]">{t("products:list.breadcrumb.products")}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[23px] font-bold tracking-tight text-[#101828]">{t("products:list.title")}</h1>
          <p className="mt-1 text-sm text-[#667085]">{t("products:list.subtitle")}</p>
        </div>
        <Button size="sm" onClick={() => navigate("/app/inventory/create")}
          className="h-10 w-fit gap-2 rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#00571C]">
          <Plus className="h-4 w-4" />
          {t("products:list.createButton")}
        </Button>
      </div>

      

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-lg border border-[#DDE7DF] bg-white px-3 py-2 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <Filter className="h-4 w-4 shrink-0 text-[#5F7168]" />
        <CategoryFilterDropdown
          value={categoryFilter}
          options={parentOptions}
          onChange={(v) => { setCategoryFilter(v); setSubFilter("all"); }}
        />
        {categoryFilter !== "all" && subsOfSelected.length > 0 && (
          <CategoryFilterDropdown
            value={subFilter}
            options={subOptions}
            onChange={setSubFilter}
            placeholder={t("products:list.filter.subCategoryPlaceholder")}
          />
        )}
        {isFiltering && (
          <button
            type="button"
            onClick={() => { setCategoryFilter("all"); setSubFilter("all"); }}
            className="text-xs font-semibold text-[#5F7168] underline"
          >
            {t("common:actions.clear")}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <table className="w-full table-fixed border-collapse text-start">
          <thead>
            <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8] text-[11px] font-semibold uppercase tracking-wide text-[#5F7168]">
              <th className="w-[220px] px-4 py-3 text-start">{t("products:list.columns.product")}</th>
              <th className="w-[120px] px-3 py-3 text-start">{t("products:list.columns.brand")}</th>
              <th className="w-[120px] px-3 py-3 text-start">{t("products:list.columns.category")}</th>
              <th className="w-[130px] px-3 py-3 text-start">{t("products:list.columns.subCategory")}</th>
              <th className="w-[65px] px-2 py-3 text-center">{t("products:list.columns.unit")}</th>
              <th className="w-[80px] px-2 py-3 text-center">{t("products:list.columns.stores")}</th>
              <th className="w-[36px] px-2 py-3 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE7DF]">
            {filtered.map((product: Product) => {
              const imageUrl = getProductImage(product);
              return (
              <tr key={product.id} className="transition hover:bg-[#F8FAF8]">
                <td className="px-4 py-2.5">
                  <button type="button"
                    onClick={() => setCoverageTarget(product)}
                    className="flex min-w-0 items-center gap-2.5 text-start">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.product_name}
                        className="h-8 w-8 shrink-0 rounded-lg object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F0EA] text-xs font-bold text-[#5F7168]">
                        {product.product_name.charAt(0)}
                      </div>
                    )}
                    <span className="truncate text-sm font-semibold text-[#101828] hover:text-[#006B22] hover:underline">{product.product_name}</span>
                  </button>
                </td>
                <td className="truncate px-3 py-2.5 text-sm text-[#5F7168]">{product.brand ?? "—"}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    categoryColors[product.category?.category_name ?? ""] ?? "bg-[#F3F4F6] text-[#667085]"
                  }`}>
                    {product.category?.category_name ?? "—"}
                  </span>
                </td>
                <td className="truncate px-3 py-2.5 text-sm text-[#5F7168]">
                  {product.sub_category?.category_name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-2 py-2.5 text-center text-sm text-[#5F7168]">{product.unit ?? "—"}</td>
                <td className="px-2 py-2.5 text-center">
                  <button type="button"
                    onClick={() => setCoverageTarget(product)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#EAF7EE] px-2.5 py-1 text-xs font-semibold text-[#006B22] transition hover:bg-[#d8f0df]">
                    {t("common:actions.view")}
                  </button>
                </td>
                <td className="relative px-2 py-2.5 text-center">
                  <button type="button"
                    onClick={() => setMenuId(menuId === product.id ? null : product.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-[#E8F0EA] hover:text-[#101828]">
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {menuId === product.id && (
                    <div className="absolute end-2 top-10 z-20 w-36 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                      <button type="button"
                        onClick={() => { setMenuId(null); navigate(`/app/inventory/${product.id}/edit`); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-[#101828] transition hover:bg-[#F8FAF8]">
                        <Pencil className="h-3.5 w-3.5" />
                        {t("common:actions.edit")}
                      </button>
                      <button type="button"
                        onClick={() => handleDelete(product)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-red-600 transition hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("common:actions.delete")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#DDE7DF] px-4 py-2.5">
          <p className="text-xs text-[#667085]">
            Showing <span className="font-semibold text-[#101828]">{filtered.length}</span> products
          </p>
          {!isFiltering && (
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-8 items-center justify-center rounded-lg border border-[#DDE7DF] px-3 text-xs font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40">
                Previous
              </button>
              <button type="button" onClick={() => setPage(p => p + 1)} disabled={products.length < 10}
                className="flex h-8 items-center justify-center rounded-lg border border-[#DDE7DF] px-3 text-xs font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}