import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct, useUpdateProduct } from "../hooks/useEditProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Upload, X, AlertTriangle, Store } from "lucide-react";

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
  { id: "3", name: "Giza Store", price: 26.50, stock: 0, is_active: false },
  { id: "4", name: "Mansoura Store", price: 25.00, stock: 45, is_active: true },
  { id: "5", name: "Aswan Store", price: 27.00, stock: 20, is_active: false },
];

export default function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const updateProduct = useUpdateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    product_name: "", brand: "", description: "",
    barcode: "", unit: "", category_id: "", sub_category_id: "",
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

  const selectedCategory = categories.find(c => c.id === formData.category_id);

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
    if (name === "product_name") { if (!value) newErrors.product_name = "Required"; else delete newErrors.product_name; }
    if (name === "brand") { if (!value) newErrors.brand = "Required"; else delete newErrors.brand; }
    if (name === "barcode") { if (!value) newErrors.barcode = "Required"; else delete newErrors.barcode; }
    setErrors(newErrors);
  };

  const handleBarcodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(e);
    if (formData.barcode !== originalData.barcode) {
      // TODO: replace with real API call
      // const res = await http.get(`/products/barcode/${formData.barcode}`);
      // setBarcodeConflict(res.data.exists);
      setBarcodeConflict(["745920381442", "745920381443"].includes(formData.barcode));
    } else {
      setBarcodeConflict(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - images.length).map(file => ({
      preview: URL.createObjectURL(file),
      file,
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

  const handleStoreChange = (storeId: string, field: keyof StoreRow, value: string | boolean | number) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, [field]: value } : s));
  };

  const handleNavigateAway = () => {
    if (hasChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) return;
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
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (barcodeConflict) return;
    updateProduct.mutate({ id: id!, data: formData }, {
      onSuccess: () => {
        // TODO: upload images after product updated
        // await Promise.all(images.map((img, i) =>
        //   http.post(`/products/${id}/images`, { file: img.file, is_primary: i === primaryIndex })
        // ));
        setOriginalData(formData);
        setHasChanges(false);
      },
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{product?.product_name}</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full border border-yellow-200 font-medium self-center">Unsaved changes</span>}
          <Button variant="outline" size="sm" onClick={handleNavigateAway}>Discard</Button>
          <Button size="sm" onClick={handleSubmit} disabled={updateProduct.isPending || barcodeConflict}>
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Meta Info Bar */}
      <div className="bg-muted/30 border border-border rounded-lg px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span><span className="font-semibold uppercase tracking-wider">Created:</span> {product?.created_at ? new Date(product.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</span>
          <span><span className="font-semibold uppercase tracking-wider">Updated:</span> {product?.updated_at ? new Date(product.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</span>
        </div>
        <button onClick={() => setStoresOpen(true)}
          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
          <Store className="w-3.5 h-3.5" />
          Listed in {product?.stores_count} stores
        </button>
      </div>

      {/* Top Section — same layout as CreateProductForm */}
      <div className="grid grid-cols-3 gap-4">

        {/* Category Taxonomy */}
        <div className="bg-white border border-border rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold">Category Taxonomy</h2>

          <div className="space-y-1.5">
            <Label className="text-xs">Top-Level Category *</Label>
            <select name="category_id" value={formData.category_id} onChange={handleChange}
              className={`h-9 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:border-ring ${errors.category_id ? "border-destructive" : "border-input"}`}>
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
            <Input name="product_name" value={formData.product_name}
              onChange={handleChange} onBlur={handleBlur}
              className={errors.product_name ? "border-destructive" : ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Brand</Label>
              <Input name="brand" value={formData.brand}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.brand ? "border-destructive" : ""} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Unit</Label>
              <select name="unit" value={formData.unit} onChange={handleChange}
                className={`h-9 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:border-ring ${errors.unit ? "border-destructive" : "border-input"}`}>
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
              <Input name="barcode" value={formData.barcode}
                onChange={handleChange} onBlur={handleBarcodeBlur}
                className={barcodeConflict || errors.barcode ? "border-destructive pr-10" : ""} />
              {barcodeConflict && <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />}
            </div>
            {barcodeConflict && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 mt-1">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-destructive">Barcode Conflict Warning</p>
                  <p className="text-xs text-destructive/80 mt-0.5">The barcode <span className="font-mono font-bold">{formData.barcode}</span> is already assigned to another product.</p>
                </div>
              </div>
            )}
            {errors.barcode && !barcodeConflict && <p className="text-xs text-destructive">{errors.barcode}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Product Description</Label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring resize-none" />
          </div>
        </div>
      </div>

      {/* Product Assets */}
      <div className="bg-white border border-border rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold">Product Assets</h2>
        <div className="flex gap-3 flex-wrap">
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
          {images.map((img, index) => (
            <div key={index} className="relative w-40 h-36 rounded-lg overflow-hidden border border-border group">
              <img src={img.preview} alt="" className="w-full h-full object-cover cursor-pointer"
                onClick={() => setPrimaryIndex(index)} />
              {index === primaryIndex && (
                <span className="absolute top-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">Primary</span>
              )}
              <button type="button" onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-5 h-5 bg-black/50 text-white rounded-full hidden group-hover:flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Store Listings */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <button type="button"
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
          onClick={() => setStoresOpen(p => !p)}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Store Inventory & Pricing</span>
            <span className="text-xs text-muted-foreground">({stores.length} stores)</span>
          </div>
          {storesOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {storesOpen && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-border bg-muted/20">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Store Name</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stores.map(store => (
                <tr key={store.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3 font-medium">{store.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-xs">$</span>
                      <input type="number" value={store.price} step="0.01"
                        onChange={(e) => handleStoreChange(store.id, "price", parseFloat(e.target.value))}
                        className="w-20 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring" />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <input type="number" value={store.stock}
                        onChange={(e) => handleStoreChange(store.id, "stock", parseInt(e.target.value))}
                        className="w-20 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring" />
                      <span className="text-muted-foreground text-xs">units</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button type="button"
                      onClick={() => handleStoreChange(store.id, "is_active", !store.is_active)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${store.is_active ? "bg-primary" : "bg-muted-foreground/30"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${store.is_active ? "left-5" : "left-0.5"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}