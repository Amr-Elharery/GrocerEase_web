import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Plus, AlertTriangle, ChevronDown } from "lucide-react";

type FormErrors = {
  product_name?: string;
  brand?: string;
  barcode?: string;
  unit?: string;
  category_id?: string;
  sub_category_id?: string;
};

type ImageFile = {
  file: File;
  preview: string;
  progress: number;
};

export default function CreateProductForm() {
  const { t } = useTranslation("products");
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [formData, setFormData] = useState({
    product_name: "",
    brand: "",
    description: "",
    barcode: "",
    unit: "",
    category_id: "",
    sub_category_id: "",
  });
const [errors, setErrors] = useState<FormErrors>({});
const [barcodeConflict, setBarcodeConflict] = useState(false);
const [submitError, setSubmitError] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

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

  const unitLabel = (unit: string) =>
    t(`units.${unit.toLowerCase()}`, { defaultValue: unit });

  const selectedCategory = categories.find(
    (category) => category.id === formData.category_id
  );

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
      if (!value) newErrors.product_name = t("form.errors.required");
      else delete newErrors.product_name;
    }

    if (name === "brand") {
      if (!value) newErrors.brand = t("form.errors.required");
      else delete newErrors.brand;
    }

    if (name === "barcode") {
      if (!value) newErrors.barcode = t("form.errors.required");
      else delete newErrors.barcode;
    }

    setErrors(newErrors);
  };

  const handleBarcodeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(event);

    const existingBarcodes = ["745920381442", "745920381443", "880123456789"];
    setBarcodeConflict(existingBarcodes.includes(formData.barcode));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files)
      .slice(0, 5 - images.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 100,
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

  const handleSubmit = () => {
    const newErrors: FormErrors = {};

    if (!formData.product_name) newErrors.product_name = t("form.errors.required");
    if (!formData.brand) newErrors.brand = t("form.errors.required");
    if (!formData.unit) newErrors.unit = t("form.errors.required");
    if (!formData.category_id) newErrors.category_id = t("form.errors.categoryRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (barcodeConflict) return;

    if (images.length === 0) {
  setSubmitError(t("form.create.imageRequired"));
  return;
}

    createProduct.mutate(
      { data: formData, files: images.map((img) => img.file) },
      { onSuccess: () => navigate("/app/inventory") }
    );
  };

  return (
    <section className="mx-auto max-w-[1420px] space-y-3">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#101828]">
            {t("form.create.title")}
          </h1>

          <p className="mt-0.5 text-sm text-[#667085]">
            {t("form.create.subtitle")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/app/inventory")}
            className="h-9 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold"
          >
            {t("form.create.discard")}
          </Button>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={createProduct.isPending || barcodeConflict}
            className="h-9 rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#00571C]"
          >
            {createProduct.isPending ? t("form.create.saving") : t("form.create.save")}
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      {submitError && (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <p className="text-sm font-medium text-red-700">
        {submitError}
      </p>
    </div>
  </div>
)}
      <div className="grid gap-3 xl:grid-cols-[0.82fr_1.8fr]">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Category Taxonomy */}
          <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <h2 className="text-[15px] font-bold text-[#101828]">
              {t("form.category.sectionTitle")}
            </h2>

            <div className="mt-3 space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                {t("form.category.topLevelLabel")}
              </Label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((prev) => !prev)}
                  className={`flex h-9 w-full items-center justify-between rounded-lg border bg-[#F8FAF8] px-3 text-start text-sm outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 ${
                    errors.category_id ? "border-red-500" : "border-[#DDE7DF]"
                  }`}
                >
                  <span className={selectedCategory ? "text-[#101828]" : "text-[#667085]"}>
                    {selectedCategory ? selectedCategory.name : t("form.category.selectPlaceholder")}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#5F7168]" />
                </button>

                {categoryOpen && (
                  <div className="absolute start-0 end-0 top-[42px] z-50 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            category_id: category.id,
                            sub_category_id: "",
                          }));
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.category_id;
                            return next;
                          });
                          setCategoryOpen(false);
                        }}
                        className={`block w-full px-3 py-2 text-start text-sm transition hover:bg-[#EAF7EE] ${
                          formData.category_id === category.id
                            ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                            : "text-[#101828]"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {errors.category_id && (
                <p className="text-xs text-red-600">{errors.category_id}</p>
              )}
            </div>

            {selectedCategory && (
              <div className="mt-3 space-y-2">
                <Label className="text-xs font-semibold text-[#101828]">
                  {t("form.category.subCategoryLabel")}
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
                  {t("form.assets.sectionTitle")}
                </h2>

                <p className="mt-0.5 text-xs text-[#667085]">
                  {t("form.assets.helpText")}
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
                  className={`flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                    isDragging
                      ? "border-[#006B22] bg-[#EAF7EE]"
                      : "border-[#C9D8CE] bg-[#F8FAF8] hover:border-[#006B22]"
                  }`}
                >
                  <Upload className="mb-1.5 h-5 w-5 text-[#5F7168]" />

                  <p className="text-center text-xs font-medium text-[#5F7168]">
                    {t("form.assets.dropText")}
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#667085]">
                    {t("form.assets.fileTypes")}
                  </p>

                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#006B22]">
                    {t("form.assets.browseText")}
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
                  className={`group relative h-28 overflow-hidden rounded-xl border bg-[#F8FAF8] transition ${
                    index === primaryIndex
                      ? "border-[#006B22] ring-2 ring-[#006B22]"
                      : "border-[#DDE7DF]"
                  }`}
                >
                  <img
                    src={image.preview}
                    alt=""
                    title={t("form.assets.primaryTitle")}
                    className="h-full w-full cursor-pointer object-cover"
                    onClick={() => setPrimaryIndex(index)}
                  />

                  {index === primaryIndex && (
                    <span className="absolute start-2 top-2 rounded-full bg-[#006B22] px-2 py-0.5 text-[10px] font-semibold text-white">
                      {t("form.assets.primaryBadge")}
                    </span>
                  )}

                  {image.progress < 100 && (
                    <div className="absolute bottom-0 start-0 end-0 h-1 bg-[#E8F0EA]">
                      <div
                        className="h-full bg-[#006B22] transition-all"
                        style={{ width: `${image.progress}%` }}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute end-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white group-hover:flex"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {images.length < 5 && index === images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 end-2 hidden h-6 w-6 items-center justify-center rounded-full border border-[#DDE7DF] bg-white shadow group-hover:flex"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <h2 className="text-[15px] font-bold text-[#101828]">
            {t("form.info.sectionTitle")}
          </h2>

          <div className="mt-3 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-[#101828]">
                  {t("form.info.nameLabel")}
                </Label>

                {errors.product_name && (
                  <span className="text-xs text-red-600">
                    {errors.product_name}
                  </span>
                )}
              </div>

              <Input
                name="product_name"
                placeholder={t("form.info.namePlaceholder")}
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
                  {t("form.info.brandLabel")}
                </Label>

                <Input
                  name="brand"
                  placeholder={t("form.info.brandPlaceholder")}
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
                  {t("form.info.unitLabel")}
                </Label>

                <div className="relative">
  <button
    type="button"
    onClick={() => setUnitOpen((prev) => !prev)}
    className={`flex h-9 w-full items-center justify-between rounded-lg border bg-[#F8FAF8] px-3 text-start text-sm text-[#101828] outline-none transition ${
      errors.unit ? "border-red-500" : "border-[#DDE7DF]"
    } focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10`}
  >
    <span className={formData.unit ? "text-[#101828]" : "text-[#667085]"}>
      {formData.unit ? unitLabel(formData.unit) : t("form.info.unitPlaceholder")}
    </span>

    <ChevronDown className="h-4 w-4 text-[#5F7168]" />
  </button>

  {unitOpen && (
    <div className="absolute start-0 end-0 top-[42px] z-50 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
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
          className={`block w-full px-3 py-2 text-start text-sm transition hover:bg-[#EAF7EE] ${
            formData.unit === unit
              ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
              : "text-[#101828]"
          }`}
        >
          {unitLabel(unit)}
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
                {t("form.info.barcodeLabel")}
              </Label>

              <div className="relative">
                <Input
                  name="barcode"
                  placeholder={t("form.info.barcodePlaceholder")}
                  value={formData.barcode}
                  onChange={handleChange}
                  onBlur={handleBarcodeBlur}
                  className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] pe-10 text-sm ${
                    barcodeConflict || errors.barcode ? "border-red-500" : ""
                  }`}
                />

                {barcodeConflict && (
                  <AlertTriangle className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-600" />
                )}
              </div>

              {barcodeConflict && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  {t("form.info.barcodeConflict")}
                </p>
              )}

              {errors.barcode && !barcodeConflict && (
                <p className="text-xs text-red-600">{errors.barcode}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                {t("form.info.descriptionLabel")}
              </Label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t("form.info.descriptionPlaceholder")}
                rows={4}
                className="w-full resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
