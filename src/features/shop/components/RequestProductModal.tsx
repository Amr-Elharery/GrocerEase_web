import { useState, useRef } from "react";
import { useCreateProductRequest } from "../hooks/useSubmissionRequest";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { X, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FilterDropdown from "./FilterDropdown";


type FormErrors = {
  product_name?: string;
  category_id?: string;
  sub_category_id?: string;
};

type Props = {
  shopId: string;
  onClose: () => void;
  onBack: () => void;
};

export default function RequestProductModal({ shopId, onClose, onBack }: Props) {
  const submitRequest = useCreateProductRequest();

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    product_name: "",
    brand: "",
    description: "",
    category_id: "",
    sub_category_id: "",
    barcode: "",
    unit: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");

  const selectedCategory = categories.find(c => c.id === formData.category_id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category_id") {
      setFormData(prev => ({ ...prev, category_id: value, sub_category_id: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) setImage(files[0]);
  };

  const handleSubmit = () => {
    const newErrors: FormErrors = {};
    if (!formData.product_name || formData.product_name.length < 2) {
      newErrors.product_name = "Product name must be at least 2 characters";
    }
    if (!formData.category_id) newErrors.category_id = "Category is required";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setApiError("");

    submitRequest.mutate({
      shop_id: Number(shopId),
      name: formData.product_name,
      description: formData.description || "",
      brand: formData.brand || "",
      unit: formData.unit || "",
      category_id: Number(formData.category_id),
      subcategory_id: formData.sub_category_id ? Number(formData.sub_category_id) : undefined,
      image: image || undefined,
    }, {
      onSuccess: () => setSuccess(true),
      onError: (err: unknown) => {
        const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
        let msg = "Couldn't submit the request. Please try again.";
        if (typeof detail === "string") msg = detail;
        else if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
          msg = (detail[0] as { msg: string }).msg;
        }
        setApiError(msg.replace(/^\d{3}:\s*/, ""));
      },
    });
  };

  // Success State
  if (success) return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-sm mx-4 p-8 flex flex-col items-center text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <h2 className="text-base font-semibold">Request Submitted!</h2>
        <p className="text-sm text-muted-foreground">
          Our team will review and add it to the catalog within 24 hours.
        </p>
        <Button size="sm" onClick={onClose} className="w-full mt-2">Done</Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold">Request New Product</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Suggest a new item for the global catalog. Our team will review your submission.
            </p>
          </div>
          <button onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* Category */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classification</h3>
            <div className="space-y-1.5">
              <Label className="text-xs">Top-Level Category *</Label>
              <FilterDropdown
                value={formData.category_id}
                onChange={(v) => setFormData(prev => ({ ...prev, category_id: v, sub_category_id: "" }))}
                placeholder="Select a primary category"
                options={[
                  { value: "", label: "Select a primary category" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
              {errors.category_id && <p className="text-xs text-destructive">{errors.category_id}</p>}
            </div>

            {selectedCategory && (
              <div className="space-y-1.5">
                <Label className="text-xs">Sub-Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.sub_categories.map(sub => (
                    <button key={sub.id} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sub_category_id: sub.id }))}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        formData.sub_category_id === sub.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}>
                      {sub.name}
                    </button>
                  ))}
                </div>
                {errors.sub_category_id && <p className="text-xs text-destructive">{errors.sub_category_id}</p>}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Details</h3>

            <div className="space-y-1.5">
              <Label className="text-xs">Product Name *</Label>
              <Input name="product_name" value={formData.product_name} onChange={handleChange}
                placeholder="Enter formal product title"
                className={errors.product_name ? "border-destructive" : ""} />
              {errors.product_name && <p className="text-xs text-destructive">{errors.product_name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Brand Name</Label>
                <Input name="brand" value={formData.brand} onChange={handleChange}
                  placeholder="e.g. Nestlé, Juhayna" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Barcode (EAN/UPC)</Label>
                <Input name="barcode" value={formData.barcode} onChange={handleChange}
                  placeholder="13-digit code" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Unit / Size</Label>
              <Input name="unit" value={formData.unit} onChange={handleChange}
                placeholder="e.g. 1L, 500g, Pack of 6" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                placeholder="Describe the product, its key features, or why it should be added..."
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring resize-none" />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visual Assets</h3>
            {image ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border group">
                <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImage(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full hidden group-hover:flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}>
                <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
                <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">High-quality PNG, JPG up to 10MB</p>
                <button type="button"
                  className="mt-2 px-3 py-1 rounded border border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
                  Select Image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleFiles(e.target.files)} />
              </div>
            )}
          </div>
        </div>

        {apiError && (
          <div className="mx-5 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {apiError}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border shrink-0">
          <button onClick={onBack}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to catalog
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitRequest.isPending}>
              {submitRequest.isPending ? "Submitting..." : "Submit Request ›"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}