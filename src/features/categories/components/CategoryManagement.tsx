import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategories";
import { type Category } from "../api/categoryService";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Tags,
  FolderTree,
  AlertTriangle,
} from "lucide-react";
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

  const topLevel = categories.filter((category) => category.parent_id === null);

  const subCategories = selectedParent
    ? categories.filter((category) => category.parent_id === selectedParent.id)
    : [];

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setError("");
  };

  const handleSaveEdit = (category: Category) => {
    if (!editingName.trim()) {
      setError("Name is required");
      return;
    }

    const siblings = categories.filter(
      (item) => item.parent_id === category.parent_id && item.id !== category.id
    );

    const isDuplicate = siblings.some(
      (item) => item.name.toLowerCase() === editingName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError("Name already exists");
      return;
    }

    updateCategory.mutate({
      id: category.id,
      data: { name: editingName.trim() },
    });

    setEditingId(null);
    setError("");
  };

  const handleAddCategory = (parentId: string | null) => {
    if (!newName.trim()) {
      setError("Name is required");
      return;
    }

    const siblings = categories.filter(
      (category) => category.parent_id === parentId
    );

    const isDuplicate = siblings.some(
      (category) =>
        category.name.toLowerCase() === newName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError("Name already exists");
      return;
    }

    createCategory.mutate(
      {
        name: newName.trim(),
        parent_id: parentId,
      },
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

  const handleDeleteClick = (category: Category) => {
    setDeleteConfirm(category);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;

    deleteCategory.mutate(deleteConfirm.id, {
      onSuccess: () => {
        setDeleteConfirm(null);

        if (selectedParent?.id === deleteConfirm.id) {
          setSelectedParent(null);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading categories...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1420px] space-y-4">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-[#667085]">
          <span>Catalogue</span>
          <span>›</span>
          <span className="font-semibold text-[#101828]">Categories</span>
        </div>

        <h1 className="text-[23px] font-bold tracking-tight text-[#101828]">
          Category Management
        </h1>

        <p className="mt-1 text-sm text-[#667085]">
          Manage grocery categories, sub-categories, and product grouping.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Top-Level Categories */}
        <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-[#DDE7DF] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#006B22]">
                <FolderTree className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#101828]">
                  Top-Level Categories
                </h2>
                <p className="text-xs text-[#667085]">
                  {topLevel.length} categories
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setAddingParent(true);
                setAddingChild(false);
                setNewName("");
                setError("");
              }}
              className="h-9 gap-1.5 rounded-lg bg-[#006B22] px-3 text-xs font-semibold text-white hover:bg-[#00571C]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Category
            </Button>
          </div>

          {addingParent && (
            <div className="border-b border-[#DDE7DF] bg-[#F8FAF8] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddCategory(null);
                    }

                    if (event.key === "Escape") {
                      setAddingParent(false);
                      setError("");
                    }
                  }}
                  placeholder="Category name..."
                  className="h-8 flex-1 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
                />

                <button
                  type="button"
                  onClick={() => handleAddCategory(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006B22] text-white transition hover:bg-[#00571C]"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAddingParent(false);
                    setError("");
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168] transition hover:bg-[#E8F0EA]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
          )}

          <div className="divide-y divide-[#DDE7DF]">
            {topLevel.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedParent(category);
                  setAddingChild(false);
                  setError("");
                }}
                className={`flex cursor-pointer items-center justify-between px-4 py-3 transition ${
                  selectedParent?.id === category.id
                    ? "bg-[#EAF7EE]"
                    : "hover:bg-[#F8FAF8]"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      selectedParent?.id === category.id
                        ? "bg-[#006B22] text-white"
                        : "bg-[#E8F0EA] text-[#5F7168]"
                    }`}
                  >
                    {category.name.charAt(0)}
                  </div>

                  {editingId === category.id ? (
                    <div
                      className="flex flex-1 items-center gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSaveEdit(category);
                          }

                          if (event.key === "Escape") {
                            setEditingId(null);
                            setError("");
                          }
                        }}
                        className="h-8 flex-1 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm outline-none focus:border-[#2D6A4F]"
                      />

                      <button
                        type="button"
                        onClick={() => handleSaveEdit(category)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006B22] text-white"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setError("");
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      className="truncate text-sm font-semibold text-[#101828]"
                      onDoubleClick={() => handleStartEdit(category)}
                    >
                      {category.name}
                    </span>
                  )}
                </div>

                {editingId !== category.id && (
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        category.product_count > 0
                          ? "bg-[#EAF7EE] text-[#006B22]"
                          : "bg-[#F2F4F7] text-[#667085]"
                      }`}
                    >
                      {category.product_count.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStartEdit(category);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-[#E8F0EA] hover:text-[#101828]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteClick(category);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Categories */}
        <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-[#DDE7DF] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#006B22]">
                <Tags className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#101828]">
                  {selectedParent
                    ? `${selectedParent.name} Sub-Categories`
                    : "Sub-Categories"}
                </h2>

                <p className="text-xs text-[#667085]">
                  {selectedParent
                    ? `${subCategories.length} sub-categories`
                    : "Select a category"}
                </p>
              </div>
            </div>

            {selectedParent && (
              <Button
                size="sm"
                onClick={() => {
                  setAddingChild(true);
                  setAddingParent(false);
                  setNewName("");
                  setError("");
                }}
                className="h-9 gap-1.5 rounded-lg bg-[#006B22] px-3 text-xs font-semibold text-white hover:bg-[#00571C]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Sub-Category
              </Button>
            )}
          </div>

          {addingChild && selectedParent && (
            <div className="border-b border-[#DDE7DF] bg-[#F8FAF8] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddCategory(selectedParent.id);
                    }

                    if (event.key === "Escape") {
                      setAddingChild(false);
                      setError("");
                    }
                  }}
                  placeholder="Sub-category name..."
                  className="h-8 flex-1 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
                />

                <button
                  type="button"
                  onClick={() => handleAddCategory(selectedParent.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006B22] text-white transition hover:bg-[#00571C]"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAddingChild(false);
                    setError("");
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168] transition hover:bg-[#E8F0EA]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
          )}

          {!selectedParent ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF7EE] text-[#006B22]">
                <Tags className="h-5 w-5" />
              </div>

              <p className="text-sm font-bold text-[#101828]">
                Select a category
              </p>

              <p className="mt-1 max-w-[320px] text-xs leading-5 text-[#667085]">
                Click a top-level category to view, edit, or add its
                sub-categories.
              </p>
            </div>
          ) : subCategories.length === 0 && !addingChild ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF7EE] text-[#006B22]">
                <Plus className="h-5 w-5" />
              </div>

              <p className="text-sm font-bold text-[#101828]">
                No sub-categories yet
              </p>

              <p className="mt-1 max-w-[320px] text-xs leading-5 text-[#667085]">
                Add the first sub-category under {selectedParent.name}.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#DDE7DF]">
              {subCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between px-4 py-3 transition hover:bg-[#F8FAF8]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F0EA] text-xs font-bold text-[#5F7168]">
                      {category.name.charAt(0)}
                    </div>

                    {editingId === category.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(event) =>
                            setEditingName(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleSaveEdit(category);
                            }

                            if (event.key === "Escape") {
                              setEditingId(null);
                              setError("");
                            }
                          }}
                          className="h-8 flex-1 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm outline-none focus:border-[#2D6A4F]"
                        />

                        <button
                          type="button"
                          onClick={() => handleSaveEdit(category)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006B22] text-white"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setError("");
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className="truncate text-sm font-semibold text-[#101828]"
                        onDoubleClick={() => handleStartEdit(category)}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>

                  {editingId !== category.id && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-semibold text-[#667085]">
                        {category.product_count} products
                      </span>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(category)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-[#E8F0EA] hover:text-[#101828]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(category)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <h3 className="text-base font-bold text-[#101828]">
              Delete Category
            </h3>

            {deleteConfirm.product_count > 0 ? (
              <>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Cannot delete{" "}
                  <span className="font-semibold text-[#101828]">
                    "{deleteConfirm.name}"
                  </span>{" "}
                  because it has{" "}
                  <span className="font-semibold text-red-600">
                    {deleteConfirm.product_count} products
                  </span>{" "}
                  assigned. Reassign them first.
                </p>

                <div className="mt-5 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(null)}
                    className="h-9 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold"
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-[#101828]">
                    "{deleteConfirm.name}"
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(null)}
                    className="h-9 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleConfirmDelete}
                    disabled={deleteCategory.isPending}
                    className="h-9 rounded-lg px-4 text-sm font-semibold"
                  >
                    {deleteCategory.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}