import { useState, useRef } from "react";
import { useSubmitProductRequest } from "../hooks/useSubmissionRequest";
import { X, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  { id: "9", name: "Frozen", sub_categories: [
    { id: "9-1", name: "Vegetables" }, { id: "9-2", name: "Meat" },
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

type FormErrors = {
  product_name?: string;
  category_id?: string;
  sub_category_id?: string;
};

type Props = {
  onClose: () => void;
  onBack: () => void;
};

export default function RequestProductModal({ onClose, onBack }: Props) {
  const submitRequest = useSubmitProductRequest();
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
    if (!formData.sub_category_id) newErrors.sub_category_id = "Sub-category is required";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    submitRequest.mutate({
      ...formData,
      submitted_by_shop_id: SHOP_ID,
    }, {
      onSuccess: () => setSuccess(true),
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
              <select name="category_id" value={formData.category_id} onChange={handleChange}
                className={`h-8 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:border-ring ${errors.category_id ? "border-destructive" : "border-input"}`}>
                <option value="">Select a primary category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
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