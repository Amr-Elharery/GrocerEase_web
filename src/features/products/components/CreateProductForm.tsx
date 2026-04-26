import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Plus, AlertTriangle } from "lucide-react";

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
];

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
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    product_name: "", brand: "", description: "",
    barcode: "", unit: "", category_id: "", sub_category_id: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [barcodeConflict, setBarcodeConflict] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCategory = categories.find(c => c.id === formData.category_id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category_id") {
      setFormData(prev => ({ ...prev, category_id: value, sub_category_id: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "product_name") {
      if (!value) newErrors.product_name = "Required field";
      else delete newErrors.product_name;
    }
    if (name === "brand") {
      if (!value) newErrors.brand = "Required field";
      else delete newErrors.brand;
    }
    if (name === "barcode") {
      if (!value) newErrors.barcode = "Required field";
      else delete newErrors.barcode;
    }
    setErrors(newErrors);
  };

  const handleBarcodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(e);
    // real API
   //const res = await http.get(`/products/barcode/${formData.barcode}`);
     //setBarcodeConflict(res.data.exists);
    const existingBarcodes = ["745920381442", "745920381443", "880123456789"];
    setBarcodeConflict(existingBarcodes.includes(formData.barcode));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 100,
    }));
    setImages(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (primaryIndex >= index && primaryIndex > 0) setPrimaryIndex(p => p - 1);
  };

  const handleSubmit = () => {
    const newErrors: FormErrors = {};
    if (!formData.product_name) newErrors.product_name = "Required field";
    if (!formData.brand) newErrors.brand = "Required field";
    if (!formData.barcode) newErrors.barcode = "Required field";
    if (!formData.unit) newErrors.unit = "Required field";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.sub_category_id) newErrors.sub_category_id = "Sub-category is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (barcodeConflict) return;
    createProduct.mutate(formData, { onSuccess: () => navigate("/app/inventory") });
    //createProduct.mutate(formData, {
  //onSuccess: (product) => {
    // TODO: upload images after product created
    // await Promise.all(images.map((img, i) =>
    //   http.post(`/products/${product.id}/images`, { file: img.file, is_primary: i === primaryIndex })
    // ));
    //navigate("/app/inventory");
  //}
//});
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">New Product Entry</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure global inventory details and asset parameters.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/app/inventory")}>Discard</Button>
          <Button size="sm" onClick={handleSubmit} disabled={createProduct.isPending || barcodeConflict}>
            {createProduct.isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-3 gap-4">

        {/* Category Taxonomy */}
        <div className="bg-white border border-border rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold">Category Taxonomy</h2>

          <div className="space-y-1.5">
            <Label className="text-xs">Top-Level Category *</Label>
            <select name="category_id" value={formData.category_id} onChange={handleChange}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring">
              <option value="">Select category</option>
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

        {/* Product Information */}
        <div className="col-span-2 bg-white border border-border rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold">Product Information</h2>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Product Name *</Label>
              {errors.product_name && <span className="text-xs text-destructive">{errors.product_name}</span>}
            </div>
            <Input name="product_name" placeholder="e.g. Full Cream Milk 1L"
              value={formData.product_name} onChange={handleChange} onBlur={handleBlur}
              className={errors.product_name ? "border-destructive" : ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Brand</Label>
              <Input name="brand" placeholder="Enter brand name"
                value={formData.brand} onChange={handleChange} onBlur={handleBlur}
                className={errors.brand ? "border-destructive" : ""} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Unit</Label>
              <select name="unit" value={formData.unit} onChange={handleChange}
                className={`h-9 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:border-ring ${errors.unit ? "border-destructive" : "border-input"}`}>
                <option value="">Select unit</option>
                {["Piece","Kg","Litre","Pack","Box","Bottle","Can","Bag","Tray","Jar"].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.unit && <p className="text-xs text-destructive">{errors.unit}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Barcode / SKU</Label>
            <div className="relative">
              <Input name="barcode" placeholder="e.g. 745920381442"
                value={formData.barcode} onChange={handleChange} onBlur={handleBarcodeBlur}
                className={barcodeConflict || errors.barcode ? "border-destructive pr-10" : ""} />
              {barcodeConflict && (
                <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
              )}
            </div>
            {barcodeConflict && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Conflict: Barcode already exists in system
              </p>
            )}
            {errors.barcode && !barcodeConflict && <p className="text-xs text-destructive">{errors.barcode}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Product Description</Label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Enter detailed technical specifications and marketing copy..."
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring resize-none" />
          </div>
        </div>
      </div>

      {/* Product Assets */}
      <div className="bg-white border border-border rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold">Product Assets</h2>

        <div className="flex gap-3 flex-wrap">
          {/* Upload Zone */}
          {images.length < 5 && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-40 h-36 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}>
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground text-center">Drag and drop images</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG, WEBP</p>
              <span className="text-[10px] text-primary font-semibold mt-1 uppercase tracking-wide">OR BROWSE FILES</span>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handleFiles(e.target.files)} />
            </div>
          )}

          {/* Image Thumbnails */}
          {images.map((img, index) => (
            <div key={index} className="relative w-40 h-36 rounded-lg overflow-hidden border border-border group">
              <img src={img.preview} alt="" className="w-full h-full object-cover cursor-pointer"
                onClick={() => setPrimaryIndex(index)} />
              {index === primaryIndex && (
                <span className="absolute top-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
                  Primary
                </span>
              )}
              {img.progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${img.progress}%` }} />
                </div>
              )}
              <button type="button" onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-5 h-5 bg-black/50 text-white rounded-full hidden group-hover:flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
              {images.length < 5 && index === images.length - 1 && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-5 h-5 bg-white border border-border rounded-full hidden group-hover:flex items-center justify-center shadow">
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}