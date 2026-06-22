import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct, useUpdateProduct } from "../hooks/useEditProduct";
import { useDeleteProductImage, useMakePrimaryImage } from "../hooks/useProductImages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";

const categories = [
  { id: "1", name: "Dairy", sub_categories: [{ id: "3", name: "Milk" }] },
  { id: "2", name: "Snacks", sub_categories: [] },
];

const units = ["Piece", "Kg", "Litre", "Pack", "Box", "Bottle", "Can", "Bag", "Tray", "Jar"];

type FormErrors = {
  product_name?: string;
  brand?: string;
  barcode?: string;
  unit?: string;
  category_id?: string;
  sub_category_id?: string;
};



type ImageFile = {
  preview: string;
  file?: File;
  id?: number; };


export default function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const updateProduct = useUpdateProduct();
  const deleteImage = useDeleteProductImage();
  const makePrimary = useMakePrimaryImage();
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
  const [hasChanges, setHasChanges] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const selectedCategory = categories.find(c => c.id === formData.category_id);

  useEffect(() => {
    if (product) {
      const data = {
        product_name: product.product_name,
        brand: product.brand ?? "",
        description: product.description ?? "",
        barcode: "",
        unit: product.unit ?? "",
        category_id: product.category?.id?.toString() ?? "",
        sub_category_id: product.sub_category?.id?.toString() ?? "",
      };
      setFormData(data);
      setOriginalData(data);

      const existing = (product.product_images ?? [])
        .filter((im) => im.image_url)
        .map((im) => ({ preview: im.image_url!, id: im.id }));
      setImages(existing);
      const pIdx = (product.product_images ?? []).findIndex((im) => im.is_primary);
      if (pIdx >= 0) setPrimaryIndex(pIdx);
    }
  }, [product]);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category_id") {
      setFormData(prev => ({ ...prev, category_id: value, sub_category_id: "" }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "product_name") { if (!value) newErrors.product_name = "Required"; else delete newErrors.product_name; }
    if (name === "brand") { if (!value) newErrors.brand = "Required"; else delete newErrors.brand; }
    if (name === "barcode") { if (!value) newErrors.barcode = "Required"; else delete newErrors.barcode; }
    setErrors(newErrors);
  };

  const handleBarcodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(e);
    if (formData.barcode !== originalData.barcode) {
      setBarcodeConflict(["745920381442", "745920381443"].includes(formData.barcode));
    } else {
      setBarcodeConflict(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - images.length).map(file => ({ preview: URL.createObjectURL(file), file }));
    setImages(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const img = images[index];
    if (img.id !== undefined && id) {
      deleteImage.mutate({ productId: id, imageId: String(img.id) });
    }
    setImages(prev => prev.filter((_, i) => i !== index));
    if (primaryIndex >= index && primaryIndex > 0) setPrimaryIndex(prev => prev - 1);
  };

  const handleSetPrimary = (index: number) => {
    setPrimaryIndex(index);
    const img = images[index];
    if (img.id !== undefined && id) {
      makePrimary.mutate({ productId: id, imageId: String(img.id) });
    }
  };

  
  const handleNavigateAway = () => {
    if (hasChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) return;
    navigate("/app/inventory");
  };

  const handleSubmit = () => {
    const newErrors: FormErrors = {};
    if (!formData.product_name) newErrors.product_name = "Required";
    if (!formData.brand) newErrors.brand = "Required";
    if (!formData.unit) newErrors.unit = "Required";
    if (!formData.category_id) newErrors.category_id = "Required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (barcodeConflict) return;

    const newFiles = images.filter((i) => i.file).map((i) => i.file!);

    updateProduct.mutate(
      { id: id!, data: formData, files: newFiles },
      {
        onSuccess: () => {
          setOriginalData(formData);
          setHasChanges(false);
          navigate("/app/inventory");
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
          <h1 className="text-[22px] font-bold tracking-tight text-[#101828]">Edit Product</h1>
          <p className="mt-0.5 text-sm text-[#667085]">{product?.product_name}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
              Unsaved changes
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleNavigateAway}
            className="h-9 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold">
            Discard
          </Button>
          <Button size="sm" onClick={handleSubmit}
            disabled={updateProduct.isPending || barcodeConflict}
            className="h-9 min-w-[118px] rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#00571C]">
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Meta Info Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#DDE7DF] bg-[#F8FAF8] px-4 py-2.5">
        <div className="flex items-center gap-6 text-xs text-[#667085]">
          <span className="font-semibold text-[#5F7168]">ID: {product?.id}</span>
        </div>
        
      </div>

      {/* Main Layout */}
      <div className="grid gap-3 xl:grid-cols-[0.82fr_1.8fr]">

        {/* Left Column */}
        <div className="space-y-3">

          {/* Category Taxonomy */}
          <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <h2 className="text-[15px] font-bold text-[#101828]">Category Taxonomy</h2>
            <div className="mt-3 space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">Top-Level Category *</Label>
              <div className="relative">
                <button type="button" onClick={() => setCategoryOpen(prev => !prev)}
                  className={`flex h-9 w-full items-center justify-between rounded-lg border bg-[#F8FAF8] px-3 text-left text-sm outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 ${errors.category_id ? "border-red-500" : "border-[#DDE7DF]"}`}>
                  <span className={selectedCategory ? "text-[#101828]" : "text-[#667085]"}>
                    {selectedCategory ? selectedCategory.name : "Select category"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#5F7168]" />
                </button>
                {categoryOpen && (
                  <div className="absolute left-0 right-0 top-[42px] z-50 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                    {categories.map(c => (
                      <button key={c.id} type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category_id: c.id, sub_category_id: "" }));
                          setErrors(prev => { const n = { ...prev }; delete n.category_id; return n; });
                          setCategoryOpen(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-[#EAF7EE] ${formData.category_id === c.id ? "bg-[#EAF7EE] font-semibold text-[#006B22]" : "text-[#101828]"}`}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category_id && <p className="text-xs text-red-600">{errors.category_id}</p>}
            </div>

            {selectedCategory && (
              <div className="mt-3 space-y-2">
                <Label className="text-xs font-semibold text-[#101828]">Sub-Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.sub_categories.map(sub => (
                    <button key={sub.id} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sub_category_id: sub.id }))}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        formData.sub_category_id === sub.id
                          ? "border-[#006B22] bg-[#006B22] text-white"
                          : "border-[#DDE7DF] bg-[#F8FAF8] text-[#5F7168] hover:bg-[#E8F0EA]"
                      }`}>
                      {sub.name}
                    </button>
                  ))}
                </div>
                {errors.sub_category_id && <p className="text-xs text-red-600">{errors.sub_category_id}</p>}
              </div>
            )}
          </div>

          {/* Product Assets */}
          <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#101828]">Product Assets</h2>
                <p className="mt-0.5 text-xs text-[#667085]">Upload up to 5 product images. Click an image to make it primary.</p>
              </div>
              <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-xs font-semibold text-[#006B22]">{images.length}/5</span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {images.length < 5 && (
                <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${isDragging ? "border-[#006B22] bg-[#EAF7EE]" : "border-[#C9D8CE] bg-[#F8FAF8] hover:border-[#006B22]"}`}>
                  <Upload className="mb-1.5 h-5 w-5 text-[#5F7168]" />
                  <p className="text-center text-xs font-medium text-[#5F7168]">Drag and drop images</p>
                  <p className="mt-0.5 text-[10px] text-[#667085]">JPG, PNG, WEBP</p>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#006B22]">Or browse files</span>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => handleFiles(e.target.files)} />
                </div>
              )}
              {images.map((img, i) => (
                <div key={i} className="group relative h-24 overflow-hidden rounded-xl border border-[#DDE7DF] bg-[#F8FAF8]">
                  <img src={img.preview} alt="" className="h-full w-full cursor-pointer object-cover" onClick={() => handleSetPrimary(i)} title="Click to make primary" />
                  {i === primaryIndex && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#006B22] px-2 py-0.5 text-[10px] font-semibold text-white">Primary</span>
                  )}
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white group-hover:flex">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="rounded-xl border border-[#DDE7DF] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <h2 className="text-[15px] font-bold text-[#101828]">Product Information</h2>
          <div className="mt-3 space-y-3.5">

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-[#101828]">Product Name *</Label>
                {errors.product_name && <span className="text-xs text-red-600">{errors.product_name}</span>}
              </div>
              <Input name="product_name" value={formData.product_name} onChange={handleChange} onBlur={handleBlur}
                className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] text-sm ${errors.product_name ? "border-red-500" : ""}`} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#101828]">Brand *</Label>
                <Input name="brand" value={formData.brand} onChange={handleChange} onBlur={handleBlur}
                  className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] text-sm ${errors.brand ? "border-red-500" : ""}`} />
                {errors.brand && <p className="text-xs text-red-600">{errors.brand}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#101828]">Unit *</Label>
                <div className="relative">
                  <button type="button" onClick={() => setUnitOpen(prev => !prev)}
                    className={`flex h-9 w-full items-center justify-between rounded-lg border bg-[#F8FAF8] px-3 text-left text-sm text-[#101828] outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 ${errors.unit ? "border-red-500" : "border-[#DDE7DF]"}`}>
                    <span className={formData.unit ? "text-[#101828]" : "text-[#667085]"}>{formData.unit || "Select unit"}</span>
                    <ChevronDown className="h-4 w-4 text-[#5F7168]" />
                  </button>
                  {unitOpen && (
                    <div className="absolute left-0 right-0 top-[42px] z-50 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                      {units.map(unit => (
                        <button key={unit} type="button"
                          onClick={() => { setFormData(prev => ({ ...prev, unit })); setErrors(prev => { const n = { ...prev }; delete n.unit; return n; }); setUnitOpen(false); }}
                          className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-[#EAF7EE] ${formData.unit === unit ? "bg-[#EAF7EE] font-semibold text-[#006B22]" : "text-[#101828]"}`}>
                          {unit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.unit && <p className="text-xs text-red-600">{errors.unit}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">Barcode / SKU *</Label>
              <div className="relative">
                <Input name="barcode" value={formData.barcode} onChange={handleChange} onBlur={handleBarcodeBlur}
                  className={`h-9 rounded-lg border-[#DDE7DF] bg-[#F8FAF8] pr-10 text-sm ${barcodeConflict || errors.barcode ? "border-red-500" : ""}`} />
                {barcodeConflict && <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-600" />}
              </div>
              {barcodeConflict && (
                <div className="mt-1 rounded-lg border border-red-200 bg-red-50 p-2.5">
                  <p className="text-xs font-semibold text-red-600">Barcode Conflict Warning</p>
                  <p className="mt-0.5 text-xs text-red-600">The barcode <span className="font-mono font-bold">{formData.barcode}</span> is already assigned to another product.</p>
                </div>
              )}
              {errors.barcode && !barcodeConflict && <p className="text-xs text-red-600">{errors.barcode}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">Product Description</Label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                className="w-full resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10" />
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}
