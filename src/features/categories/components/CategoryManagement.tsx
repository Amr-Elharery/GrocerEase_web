import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../hooks/useCategories";
import { type Category } from "../api/categoryService";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryManagement() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [addingParent, setAddingParent] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [error, setError] = useState("");

  const topLevel = categories.filter(c => c.parent_id === null);
  const subCategories = selectedParent
    ? categories.filter(c => c.parent_id === selectedParent.id)
    : [];

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError("");
  };

  const handleSaveEdit = (cat: Category) => {
    if (!editingName.trim()) { setError("Name is required"); return; }

    const siblings = categories.filter(c =>
      c.parent_id === cat.parent_id && c.id !== cat.id
    );
    if (siblings.some(c => c.name.toLowerCase() === editingName.trim().toLowerCase())) {
      setError("Name already exists"); return;
    }

    updateCategory.mutate({ id: cat.id, data: { name: editingName.trim() } });
    setEditingId(null);
    setError("");
  };

  const handleAddCategory = (parentId: string | null) => {
    if (!newName.trim()) { setError("Name is required"); return; }

    const siblings = categories.filter(c => c.parent_id === parentId);
    if (siblings.some(c => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      setError("Name already exists"); return;
    }

    createCategory.mutate(
      { name: newName.trim(), parent_id: parentId },
      {
        onSuccess: () => {
          setNewName("");
          setAddingParent(false);
          setAddingChild(false);
          setError("");
        },
      }
    );
  };

  const handleDeleteClick = (cat: Category) => {
    setDeleteConfirm(cat);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    deleteCategory.mutate(deleteConfirm.id, {
      onSuccess: () => {
        setDeleteConfirm(null);
        if (selectedParent?.id === deleteConfirm.id) setSelectedParent(null);
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
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>

      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">

        {/* Left — Top Level Categories */}
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Top-Level Categories</h2>
              <p className="text-xs text-muted-foreground">{topLevel.length} categories</p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs"
              onClick={() => { setAddingParent(true); setAddingChild(false); setNewName(""); setError(""); }}>
              <Plus className="w-3.5 h-3.5" /> Add Category
            </Button>
          </div>

          {/* Add Parent Form */}
          {addingParent && (
            <div className="px-4 py-3 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory(null);
                    if (e.key === "Escape") { setAddingParent(false); setError(""); }
                  }}
                  placeholder="Category name..."
                  className="flex-1 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring"
                />
                <button onClick={() => handleAddCategory(null)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-primary text-primary-foreground hover:opacity-90">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setAddingParent(false); setError(""); }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-muted">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
          )}

          <div className="divide-y divide-border">
            {topLevel.map(cat => (
              <div key={cat.id}
                onClick={() => { setSelectedParent(cat); setAddingChild(false); setError(""); }}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                  selectedParent?.id === cat.id ? "bg-muted/50 border-r-2 border-primary" : "hover:bg-muted/20"
                }`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {cat.name.charAt(0)}
                  </div>
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(cat);
                          if (e.key === "Escape") { setEditingId(null); setError(""); }
                        }}
                        className="flex-1 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring"
                      />
                      <button onClick={() => handleSaveEdit(cat)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-primary text-primary-foreground">
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={() => { setEditingId(null); setError(""); }}
                        className="w-6 h-6 flex items-center justify-center rounded border border-border">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-medium truncate" onDoubleClick={() => handleStartEdit(cat)}>
                      {cat.name}
                    </span>
                  )}
                </div>
                {editingId !== cat.id && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      cat.product_count > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {cat.product_count.toLocaleString()}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleStartEdit(cat); }}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(cat); }}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Sub Categories */}
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">
                {selectedParent ? `${selectedParent.name} — Sub-Categories` : "Sub-Categories"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedParent ? `${subCategories.length} sub-categories` : "Select a category"}
              </p>
            </div>
            {selectedParent && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs"
                onClick={() => { setAddingChild(true); setAddingParent(false); setNewName(""); setError(""); }}>
                <Plus className="w-3.5 h-3.5" /> Add Sub-Category
              </Button>
            )}
          </div>

          {/* Add Child Form */}
          {addingChild && selectedParent && (
            <div className="px-4 py-3 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory(selectedParent.id);
                    if (e.key === "Escape") { setAddingChild(false); setError(""); }
                  }}
                  placeholder="Sub-category name..."
                  className="flex-1 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring"
                />
                <button onClick={() => handleAddCategory(selectedParent.id)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-primary text-primary-foreground hover:opacity-90">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setAddingChild(false); setError(""); }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-muted">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
          )}

          {!selectedParent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Select a category</p>
              <p className="text-xs text-muted-foreground mt-1">Click a top-level category to view its sub-categories</p>
            </div>
          ) : subCategories.length === 0 && !addingChild ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">No sub-categories yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Add Sub-Category" to create one</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {subCategories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {cat.name.charAt(0)}
                    </div>
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(cat);
                            if (e.key === "Escape") { setEditingId(null); setError(""); }
                          }}
                          className="flex-1 h-7 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring"
                        />
                        <button onClick={() => handleSaveEdit(cat)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-primary text-primary-foreground">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={() => { setEditingId(null); setError(""); }}
                          className="w-6 h-6 flex items-center justify-center rounded border border-border">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium truncate" onDoubleClick={() => handleStartEdit(cat)}>
                        {cat.name}
                      </span>
                    )}
                  </div>
                  {editingId !== cat.id && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {cat.product_count} products
                      </span>
                      <button onClick={() => handleStartEdit(cat)}
                        className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteClick(cat)}
                        className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="text-base font-semibold">Delete Category</h3>
            {deleteConfirm.product_count > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Cannot delete <span className="font-semibold text-foreground">"{deleteConfirm.name}"</span> — it has <span className="font-semibold text-destructive">{deleteConfirm.product_count} products</span> assigned. Reassign them first.
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Close</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteConfirm.name}"</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={handleConfirmDelete}
                    disabled={deleteCategory.isPending}>
                    {deleteCategory.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}