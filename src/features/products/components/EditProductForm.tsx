import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct, useUpdateProduct } from "../hooks/useEditProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  AlertTriangle,
  Store,
} from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Dairy",
    sub_categories: [
      { id: "1-1", name: "Milk" },
      { id: "1-2", name: "Cheese" },
      { id: "1-3", name: "Yogurt" },
      { id: "1-4", name: "Eggs" },
    ],
  },
  {
    id: "2",
    name: "Grains",
    sub_categories: [
      { id: "2-1", name: "Rice" },
      { id: "2-2", name: "Pasta" },
      { id: "2-3", name: "Bread" },
    ],
  },
  {
    id: "3",
    name: "Beverages",
    sub_categories: [
      { id: "3-1", name: "Juice" },
      { id: "3-2", name: "Water" },
      { id: "3-3", name: "Tea" },
      { id: "3-4", name: "Coffee" },
    ],
  },
  {
    id: "4",
    name: "Snacks",
    sub_categories: [
      { id: "4-1", name: "Chips" },
      { id: "4-2", name: "Chocolate" },
      { id: "4-3", name: "Biscuits" },
    ],
  },
  {
    id: "5",
    name: "Meat",
    sub_categories: [
      { id: "5-1", name: "Poultry" },
      { id: "5-2", name: "Beef" },
      { id: "5-3", name: "Fish" },
    ],
  },
  {
    id: "6",
    name: "Oils",
    sub_categories: [
      { id: "6-1", name: "Cooking Oil" },
      { id: "6-2", name: "Olive Oil" },
    ],
  },
  {
    id: "7",
    name: "Bakery",
    sub_categories: [
      { id: "7-1", name: "Bread" },
      { id: "7-2", name: "Pastry" },
    ],
  },
  {
    id: "8",
    name: "Canned Goods",
    sub_categories: [
      { id: "8-1", name: "Paste" },
      { id: "8-2", name: "Fish" },
      { id: "8-3", name: "Vegetables" },
    ],
  },
];

const units = [
  "Piece",
  "Kg",
  "Litre",
  "Pack",
  "Box",
  "Bottle",
  "Can",
  "Bag",
  "Tray",
  "Jar",
];

type FormErrors = {
  product_name?: string;
  brand?: string;
  barcode?: string;
  unit?: string;
  category_id?: string;
  sub_category_id?: string;
};

type StoreRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
};

type ImageFile = {
  preview: string;
  file?: File;
};

const mockStores: StoreRow[] = [
  { id: "1", name: "Cairo Store", price: 25.99, stock: 150, is_active: true },
  { id: "2", name: "Alexandria Store", price: 24.99, stock: 80, is_active: true },
  { id: "3", name: "Giza Store", price: 26.5, stock: 0, is_active: false },
  { id: "4", name: "Mansoura Store", price: 25.0, stock: 45, is_active: true },
  { id: "5", name: "Aswan Store", price: 27.0, stock: 20, is_active: false },
];

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const updateProduct = useUpdateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    product_name: "",
    brand: "",
    description: "",
    barcode: "",
    unit: "",
    category_id: "",
    sub_category_id: "",
  });

  const [originalData, setOriginalData] = useState({ ...formData });
  const [errors, setErrors] = useState<FormErrors>({});
  const [barcodeConflict, setBarcodeConflict] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [storesOpen, setStoresOpen] = useState(true);
  const [stores, setStores] = useState<StoreRow[]>(mockStores);
  const [hasChanges, setHasChanges] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  const selectedCategory = categories.find(
    (category) => category.id === formData.category_id
  );

  useEffect(() => {
    if (product) {
      const data = {
        product_name: product.product_name,
        brand: product.brand,
        description: product.description ?? "",
        barcode: product.barcode,
        unit: product.unit,
        category_id: product.category_id ?? "",
        sub_category_id: product.sub_category_id ?? "",
      };

      setFormData(data);
      setOriginalData(data);
    }
  }, [product]);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "category_id") {
      setFormData((prev) => ({
        ...prev,
        category_id: value,
        sub_category_id: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    if (name === "product_name") {
      if (!value) newErrors.product_name = "Required";
      else delete newErrors.product_name;
    }

    if (name === "brand") {
      if (!value) newErrors.brand = "Required";
      else delete newErrors.brand;
    }

    if (name === "barcode") {
      if (!value) newErrors.barcode = "Required";
      else delete newErrors.barcode;
    }

    setErrors(newErrors);
  };

  const handleBarcodeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(event);

    if (formData.barcode !== originalData.barcode) {
      setBarcodeConflict(
        ["745920381442", "745920381443"].includes(formData.barcode)
      );
    } else {
      setBarcodeConflict(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files)
      .slice(0, 5 - images.length)
      .map((file) => ({
        preview: URL.createObjectURL(file),
        file,
      }));

    setImages((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));

    if (primaryIndex >= index && primaryIndex > 0) {
      setPrimaryIndex((prev) => prev - 1);
    }
  };

  const handleStoreChange = (
    storeId: string,
    field: keyof StoreRow,
    value: string | boolean | number
  ) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId ? { ...store, [field]: value } : store
      )
    );
  };

  const handleNavigateAway = () => {
    if (
      hasChanges &&
      !window.confirm("You have unsaved changes. Are you sure you want to leave?")
    ) {
      return;
    }

    navigate("/app/inventory");
  };

  const handleSubmit = () => {
    const newErrors: FormErrors = {};

    if (!formData.product_name) newErrors.product_name = "Required";
    if (!formData.brand) newErrors.brand = "Required";
    if (!formData.barcode) newErrors.barcode = "Required";
    if (!formData.unit) newErrors.unit = "Required";
    if (!formData.category_id) newErrors.category_id = "Required";
    if (!formData.sub_category_id) newErrors.sub_category_id = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (barcodeConflict) return;

    updateProduct.mutate(
      { id: id!, data: formData },
      {
        onSuccess: () => {
          setOriginalData(formData);
          setHasChanges(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading product...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1420px] space-y-3">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#101828]">
            Edit Product
          </h1>

          <p className="mt-0.5 text-sm text-[#667085]">
            {product?.product_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
              Unsaved changes
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateAway}
            className="h-9 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold"
          >
            Discard
          </Button>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={updateProduct.isPending || barcodeConflict}
            className="h-9 min-w-[118px] rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#00571C]"
          >
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Meta Info Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#DDE7DF] bg-[#F8FAF8] px-4 py-2.5">
        <div className="flex items-center gap-6 text-xs text-[#667085]">
          <span>
            <span className="font-semibold uppercase tracking-wider text-[#5F7168]">
              Created:
            </span>{" "}
            {formatDate(product?.created_at)}
          </span>

          <span>
            <span className="font-semibold uppercase tracking-wider text-[#5F7168]">
              Updated:
            </span>{" "}
            {formatDate(product?.updated_at)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setStoresOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#006B22] hover:underline"
        >
          <Store className="h-3.5 w-3.5" />
          Listed in {product?.stores_count} stores
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid gap-3 xl:grid-cols-[0.82fr_1.8fr]">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Category Taxonomy */}
          <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <h2 className="text-[15px] font-bold text-[#101828]">
              Category Taxonomy
            </h2>

            <div className="mt-3 space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Top-Level Category *
              </Label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`h-9 w-full rounded-lg border bg-[#F8FAF8] px-3 text-sm text-[#101828] outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 ${
                  errors.category_id ? "border-red-500" : "border-[#DDE7DF]"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors.category_id && (
                <p className="text-xs text-red-600">{errors.category_id}</p>
              )}
            </div>

            {selectedCategory && (
              <div className="mt-3 space-y-2">
                <Label className="text-xs font-semibold text-[#101828]">
                  Sub-Category *
                </Label>

                <div className="flex flex-wrap gap-2">
                  {selectedCategory.sub_categories.map((subCategory) => (
                    <button
                      key={subCategory.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          sub_category_id: subCategory.id,
                        }))
                      }
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        formData.sub_category_id === subCategory.id
                          ? "border-[#006B22] bg-[#006B22] text-white"
                          : "border-[#DDE7DF] bg-[#F8FAF8] text-[#5F7168] hover:bg-[#E8F0EA]"
                      }`}
                    >
                      {subCategory.name}
                    </button>
                  ))}
                </div>

                {errors.sub_category_id && (
                  <p className="text-xs text-red-600">
                    {errors.sub_category_id}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Product Assets */}
          <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#101828]">
                  Product Assets
                </h2>

                <p className="mt-0.5 text-xs text-[#667085]">
                  Upload up to 5 product images.
                </p>
              </div>

              <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-xs font-semibold text-[#006B22]">
                {images.length}/5
              </span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {images.length < 5 && (
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                    isDragging
                      ? "border-[#006B22] bg-[#EAF7EE]"
                      : "border-[#C9D8CE] bg-[#F8FAF8] hover:border-[#006B22]"
                  }`}
                >
                  <Upload className="mb-1.5 h-5 w-5 text-[#5F7168]" />

                  <p className="text-center text-xs font-medium text-[#5F7168]">
                    Drag and drop images
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#667085]">
                    JPG, PNG, WEBP
                  </p>

                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#006B22]">
                    Or browse files
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => handleFiles(event.target.files)}
                  />
                </div>
              )}

              {images.map((image, index) => (
                <div
                  key={index}
                  className="group relative h-24 overflow-hidden rounded-xl border border-[#DDE7DF] bg-[#F8FAF8]"
                >
                  <img
                    src={image.preview}
                    alt=""
                    className="h-full w-full cursor-pointer object-cover"
                    onClick={() => setPrimaryIndex(index)}
                  />

                  {index === primaryIndex && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#006B22] px-2 py-0.5 text-[10px] font-semibold text-white">
                      Primary
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white group-hover:flex"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <h2 className="text-[15px] font-bold text-[#101828]">
            Product Information
          </h2>

          <div className="mt-3 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-[#101828]">
                  Product Name *
                </Label>

                {errors.product_name && (
                  <span className="text-xs text-red-600">
                    {errors.product_name}
                  </span>
                )}
              </div>

              <Input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] text-sm ${
                  errors.product_name ? "border-red-500" : ""
                }`}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#101828]">
                  Brand *
                </Label>

                <Input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] text-sm ${
                    errors.brand ? "border-red-500" : ""
                  }`}
                />

                {errors.brand && (
                  <p className="text-xs text-red-600">{errors.brand}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#101828]">
                  Unit *
                </Label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUnitOpen((prev) => !prev)}
                    className={`flex h-9 w-full items-center justify-between rounded-lg border bg-[#F8FAF8] px-3 text-left text-sm text-[#101828] outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 ${
                      errors.unit ? "border-red-500" : "border-[#DDE7DF]"
                    }`}
                  >
                    <span
                      className={
                        formData.unit ? "text-[#101828]" : "text-[#667085]"
                      }
                    >
                      {formData.unit || "Select unit"}
                    </span>

                    <ChevronDown className="h-4 w-4 text-[#5F7168]" />
                  </button>

                  {unitOpen && (
                    <div className="absolute left-0 right-0 top-[42px] z-50 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                      {units.map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, unit }));
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.unit;
                              return next;
                            });
                            setUnitOpen(false);
                          }}
                          className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-[#EAF7EE] ${
                            formData.unit === unit
                              ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                              : "text-[#101828]"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {errors.unit && (
                  <p className="text-xs text-red-600">{errors.unit}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Barcode / SKU *
              </Label>

              <div className="relative">
                <Input
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  onBlur={handleBarcodeBlur}
                  className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] pr-10 text-sm ${
                    barcodeConflict || errors.barcode ? "border-red-500" : ""
                  }`}
                />

                {barcodeConflict && (
                  <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-600" />
                )}
              </div>

              {barcodeConflict && (
                <div className="mt-1 rounded-lg border border-red-200 bg-red-50 p-2.5">
                  <p className="text-xs font-semibold text-red-600">
                    Barcode Conflict Warning
                  </p>
                  <p className="mt-0.5 text-xs text-red-600">
                    The barcode{" "}
                    <span className="font-mono font-bold">
                      {formData.barcode}
                    </span>{" "}
                    is already assigned to another product.
                  </p>
                </div>
              )}

              {errors.barcode && !barcodeConflict && (
                <p className="text-xs text-red-600">{errors.barcode}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Product Description
              </Label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Store Inventory & Pricing */}
      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-2.5 transition hover:bg-[#F8FAF8]"
          onClick={() => setStoresOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#101828]">
              Store Inventory & Pricing
            </span>
            <span className="text-xs text-[#667085]">
              ({stores.length} stores)
            </span>
          </div>

          {storesOpen ? (
            <ChevronUp className="h-4 w-4 text-[#5F7168]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#5F7168]" />
          )}
        </button>

        {storesOpen && (
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-y border-[#DDE7DF] bg-[#F8FAF8] text-[11px] font-semibold uppercase tracking-wide text-[#5F7168]">
                <th className="w-[35%] px-4 py-2 text-left">Store Name</th>
                <th className="w-[22%] px-4 py-2 text-left">Price</th>
                <th className="w-[25%] px-4 py-2 text-left">Stock</th>
                <th className="w-[18%] px-4 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DDE7DF]">
              {stores.map((store) => (
                <tr key={store.id} className="transition hover:bg-[#F8FAF8]">
                  <td className="px-4 py-1.5 font-semibold text-[#101828]">
                    {store.name}
                  </td>

                  <td className="px-4 py-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#667085]">$</span>
                      <input
                        type="number"
                        value={store.price}
                        step="0.01"
                        onChange={(event) =>
                          handleStoreChange(
                            store.id,
                            "price",
                            parseFloat(event.target.value)
                          )
                        }
                        className="h-7 w-24 rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-2 text-sm outline-none focus:border-[#2D6A4F]"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={store.stock}
                        onChange={(event) =>
                          handleStoreChange(
                            store.id,
                            "stock",
                            parseInt(event.target.value)
                          )
                        }
                        className="h-7 w-24 rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-2 text-sm outline-none focus:border-[#2D6A4F]"
                      />
                      <span className="text-xs text-[#667085]">units</span>
                    </div>
                  </td>

                  <td className="px-4 py-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleStoreChange(
                          store.id,
                          "is_active",
                          !store.is_active
                        )
                      }
                      className={`relative h-5 w-10 rounded-full transition-colors ${
                        store.is_active ? "bg-[#006B22]" : "bg-[#C7CEC9]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                          store.is_active ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}