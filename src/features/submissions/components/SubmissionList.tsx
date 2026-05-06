import { useEffect, useRef, useState } from "react";
import {
  useSubmissions,
  useApproveSubmission,
  useRejectSubmission,
} from "../hooks/useSubmissions";
import { type Submission } from "../api/submissionService";
import {
  X,
  Check,
  Eye,
  Download,
  ArrowUpRight,
  BadgeCheck,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  {
    id: "9",
    name: "Frozen",
    sub_categories: [
      { id: "9-1", name: "Vegetables" },
      { id: "9-2", name: "Meat" },
    ],
  },
  {
    id: "10",
    name: "Spreads",
    sub_categories: [
      { id: "10-1", name: "Honey" },
      { id: "10-2", name: "Jam" },
    ],
  },
];

const rejectReasons = [
  "Duplicate product",
  "Invalid category",
  "Insufficient information",
  "Not a grocery product",
  "Other",
];

const statusColors: Record<string, string> = {
  pending: "border border-yellow-200 bg-yellow-50 text-yellow-700",
  flagged: "border border-red-200 bg-red-50 text-red-700",
  approved: "border border-green-200 bg-green-50 text-green-700",
  rejected: "border border-slate-200 bg-slate-50 text-slate-600",
};

function getEditData(submission: Submission): Partial<Submission> {
  return {
    product_name: submission.product_name,
    barcode: submission.barcode,
    category_id: submission.category_id,
    sub_category_id: submission.sub_category_id,
    description: submission.description,
    brand: submission.brand,
    unit: submission.unit,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubmissionList() {
  const { data: submissions = [], isLoading } = useSubmissions();
  const approveSubmission = useApproveSubmission();
  const rejectSubmission = useRejectSubmission();

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [editData, setEditData] = useState<Partial<Submission>>({});

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  const pendingCount = submissions.filter(
    (submission) => submission.status === "pending"
  ).length;

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "flagged", label: "Flagged" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const selectedStatusLabel =
    statusOptions.find((option) => option.value === statusFilter)?.label ??
    "All Statuses";

  const filtered = submissions.filter((submission) => {
    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;

    const searchValue = searchTerm.trim().toLowerCase();

    const matchesSearch =
      searchValue === "" ||
      submission.submission_id.toLowerCase().includes(searchValue) ||
      submission.product_name.toLowerCase().includes(searchValue) ||
      submission.barcode.toLowerCase().includes(searchValue) ||
      submission.category_name.toLowerCase().includes(searchValue) ||
      submission.submitted_by.toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  const handleSelectRow = (submission: Submission) => {
    setSelectedSubmission(submission);
    setEditData(getEditData(submission));
    setRejectMode(false);
    setRejectReason("");
    setCategoryDropdownOpen(false);
    setStatusDropdownOpen(false);
  };

  const handleApprove = () => {
    if (!selectedSubmission) return;

    approveSubmission.mutate(
      {
        id: selectedSubmission.id,
        data: editData,
      },
      {
        onSuccess: () => {
          setSelectedSubmission(null);
          setRejectMode(false);
          setRejectReason("");
        },
      }
    );
  };

  const handleQuickApprove = (submission: Submission) => {
    approveSubmission.mutate({
      id: submission.id,
      data: getEditData(submission),
    });
  };

  const handleReject = () => {
    if (!selectedSubmission || !rejectReason) return;

    rejectSubmission.mutate(
      {
        id: selectedSubmission.id,
        reason: rejectReason,
      },
      {
        onSuccess: () => {
          setSelectedSubmission(null);
          setRejectMode(false);
          setRejectReason("");
        },
      }
    );
  };

  const selectedCategory = categories.find(
    (category) => category.id === editData.category_id
  );

  const selectedCategoryLabel =
    selectedCategory?.name ?? "Select category";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(target)
      ) {
        setStatusDropdownOpen(false);
      }

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading submissions...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1420px]">
      <div className="flex gap-4">
        {/* Main Content */}
        <div
          className={`min-w-0 flex-1 space-y-4 transition-all duration-300 ${
            selectedSubmission ? "xl:max-w-[calc(100%-340px)]" : "w-full"
          }`}
        >
          {/* Header */}
          <div>
            <h1 className="text-[23px] font-bold tracking-tight text-[#101828]">
              Product Submissions
            </h1>

            <p className="mt-1 text-sm text-[#667085]">
              {pendingCount} pending submissions requiring your review.
            </p>
          </div>

          {/* Table Card */}
          <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            {/* Filter Bar */}
            <div className="border-b border-[#DDE7DF] bg-white px-4 py-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#006B22]">
                    <Search className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#101828]">
                      Filter Submissions
                    </p>
                    <p className="text-xs text-[#667085]">
                      Refine submissions by status or search.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {/* Custom Status Dropdown */}
                  <div className="relative" ref={statusDropdownRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setStatusDropdownOpen((prev) => !prev)
                      }
                      className="flex h-9 w-[165px] items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828] outline-none transition hover:bg-white focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
                    >
                      <span className="truncate">{selectedStatusLabel}</span>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#5F7168] transition-transform ${
                          statusDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {statusDropdownOpen && (
                      <div className="absolute right-0 top-11 z-50 w-[165px] overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setStatusFilter(option.value);
                              setStatusDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                              statusFilter === option.value
                                ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                                : "text-[#101828] hover:bg-[#F8FAF8]"
                            }`}
                          >
                            <span>{option.label}</span>

                            {statusFilter === option.value && (
                              <Check className="h-3.5 w-3.5 text-[#006B22]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />

                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search submissions..."
                      className="h-9 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] pl-9 pr-3 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 sm:w-[230px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setSearchTerm("");
                      setStatusDropdownOpen(false);
                    }}
                    className="h-9 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-left">
                <thead>
                  <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8] text-[11px] font-semibold uppercase tracking-wide text-[#5F7168]">
                  <th className="w-[120px] px-2.5 py-2.5 whitespace-nowrap">Submission ID</th>                    <th className="w-[175px] px-2.5 py-2.5">Product Name</th>
                    <th className="w-[120px] px-2.5 py-2.5">Barcode</th>
                    <th className="w-[115px] px-2.5 py-2.5">Category</th>
                    <th className="w-[135px] px-2.5 py-2.5">Submitter</th>
                    <th className="w-[95px] px-2.5 py-2.5">Date</th>
                    <th className="w-[100px] px-2.5 py-2.5">Status</th>
                    <th className="w-[85px] px-2.5 py-2.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#DDE7DF]">
                  {filtered.map((submission) => (
                    <tr
                      key={submission.id}
                      onClick={() => handleSelectRow(submission)}
                      className={`cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "bg-[#EAF7EE]"
                          : "hover:bg-[#F8FAF8]"
                      }`}
                    >
                     <td className="px-2.5 py-3 font-mono text-xs text-[#5F7168] whitespace-nowrap">#{submission.submission_id}</td>

                      <td className="px-2.5 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {submission.image_url ? (
                            <img
                              src={submission.image_url}
                              alt=""
                              className="h-8 w-8 shrink-0 rounded-lg border border-[#DDE7DF] object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F0EA] text-xs font-bold text-[#5F7168]">
                              {submission.product_name.charAt(0)}
                            </div>
                          )}

                          <span className="truncate text-sm font-semibold text-[#101828]">
                            {submission.product_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-2.5 py-3 font-mono text-xs text-[#5F7168]">
                        {submission.barcode}
                      </td>

                      <td className="px-2.5 py-3">
                        <p className="truncate text-sm font-medium text-[#101828]">
                          {submission.category_name}
                        </p>
                        <p className="truncate text-xs text-[#667085]">
                          {submission.sub_category_name}
                        </p>
                      </td>

                      <td className="px-2.5 py-3">
                        <p className="truncate text-sm font-medium text-[#101828]">
                          {submission.submitted_by}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            submission.submitter_role === "STORE_MANAGER"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {submission.submitter_role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-2.5 py-3 text-xs text-[#667085]">
                        {formatDate(submission.submitted_at)}
                      </td>

                      <td className="px-2.5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            statusColors[submission.status]
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>

                      <td className="px-2.5 py-3">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectRow(submission)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickApprove(submission)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-green-200 bg-white text-green-600 transition hover:bg-green-50"
                            title="Approve"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleSelectRow(submission);
                              setRejectMode(true);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                            title="Reject"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center text-sm text-[#667085]"
                      >
                        No submissions match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#DDE7DF] px-4 py-3 text-sm text-[#667085]">
              Showing {filtered.length === 0 ? 0 : 1}-{filtered.length} of{" "}
              {filtered.length} submissions
            </div>
          </div>
        </div>

        {/* Right Review Panel */}
        {selectedSubmission && (
          <aside className="hidden w-[320px] shrink-0 space-y-3 xl:block">
            <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between border-b border-[#DDE7DF] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#101828]">
                    Quick Review
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                    {selectedSubmission.submission_id}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
                    title="Open full view"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
                    title="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-[#F8FAF8]">
                  {selectedSubmission.image_url ? (
                    <img
                      src={selectedSubmission.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <p className="text-xs text-[#667085]">
                      No image submitted
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                      Product Name
                    </label>
                    <input
                      value={editData.product_name ?? ""}
                      onChange={(event) =>
                        setEditData((prev) => ({
                          ...prev,
                          product_name: event.target.value,
                        }))
                      }
                      className="mt-1 h-8 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-2 text-sm outline-none focus:border-[#2D6A4F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                        Brand
                      </label>
                      <input
                        value={editData.brand ?? ""}
                        onChange={(event) =>
                          setEditData((prev) => ({
                            ...prev,
                            brand: event.target.value,
                          }))
                        }
                        className="mt-1 h-8 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-2 text-sm outline-none focus:border-[#2D6A4F]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                        SKU Status
                      </label>
                      <p className="mt-1 flex h-8 items-center rounded-lg bg-[#F8FAF8] px-2 text-sm font-medium text-[#101828]">
                        {selectedSubmission.sku_status ?? "-"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                      Barcode
                    </label>
                    <input
                      value={editData.barcode ?? ""}
                      onChange={(event) =>
                        setEditData((prev) => ({
                          ...prev,
                          barcode: event.target.value,
                        }))
                      }
                      className="mt-1 h-8 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-2 font-mono text-sm outline-none focus:border-[#2D6A4F]"
                    />
                  </div>

                  {/* Custom Category Dropdown */}
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                      Category
                    </label>

                    <div className="relative mt-1" ref={categoryDropdownRef}>
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryDropdownOpen((prev) => !prev)
                        }
                        className="flex h-8 w-full items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-2 text-sm text-[#101828] outline-none transition hover:bg-white focus:border-[#2D6A4F]"
                      >
                        <span className="truncate">
                          {selectedCategoryLabel}
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#5F7168] transition-transform ${
                            categoryDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {categoryDropdownOpen && (
                        <div className="absolute left-0 top-9 z-50 max-h-[240px] w-full overflow-y-auto rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                          <button
                            type="button"
                            onClick={() => {
                              setEditData((prev) => ({
                                ...prev,
                                category_id: "",
                                sub_category_id: "",
                              }));
                              setCategoryDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                              !editData.category_id
                                ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                                : "text-[#101828] hover:bg-[#F8FAF8]"
                            }`}
                          >
                            <span>Select category</span>

                            {!editData.category_id && (
                              <Check className="h-3.5 w-3.5 text-[#006B22]" />
                            )}
                          </button>

                          {categories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                setEditData((prev) => ({
                                  ...prev,
                                  category_id: category.id,
                                  sub_category_id: "",
                                }));
                                setCategoryDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                                editData.category_id === category.id
                                  ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                                  : "text-[#101828] hover:bg-[#F8FAF8]"
                              }`}
                            >
                              <span>{category.name}</span>

                              {editData.category_id === category.id && (
                                <Check className="h-3.5 w-3.5 text-[#006B22]" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCategory && (
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                        Sub-Category
                      </label>

                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {selectedCategory.sub_categories.map((subCategory) => (
                          <button
                            key={subCategory.id}
                            type="button"
                            onClick={() =>
                              setEditData((prev) => ({
                                ...prev,
                                sub_category_id: subCategory.id,
                              }))
                            }
                            className={`rounded-full border px-2 py-0.5 text-xs transition ${
                              editData.sub_category_id === subCategory.id
                                ? "border-[#006B22] bg-[#006B22] text-white"
                                : "border-[#DDE7DF] bg-white text-[#5F7168] hover:bg-[#F8FAF8]"
                            }`}
                          >
                            {subCategory.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                      Product Description
                    </label>
                    <p className="mt-1 rounded-lg bg-[#F8FAF8] p-2 text-xs leading-5 text-[#667085]">
                      {selectedSubmission.description}
                    </p>
                  </div>
                </div>

                {selectedSubmission.assets &&
                  selectedSubmission.assets.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                        Attached Assets ({selectedSubmission.assets.length})
                      </p>

                      <div className="space-y-1.5">
                        {selectedSubmission.assets.map((asset, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] p-2"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#E8F0EA] text-[9px] font-bold text-[#5F7168]">
                                {asset.type === "pdf" ? "PDF" : "IMG"}
                              </div>

                              <span className="truncate text-xs font-medium text-[#101828]">
                                {asset.name}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="text-[#5F7168] transition hover:text-[#101828]"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {rejectMode && (
                  <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">
                      Select Rejection Reason
                    </p>

                    <div className="space-y-1">
                      {rejectReasons.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setRejectReason(reason)}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                            rejectReason === reason
                              ? "border-red-500 bg-white font-semibold text-red-600"
                              : "border-red-100 bg-white/70 text-[#101828] hover:bg-white"
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {rejectMode ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 flex-1 rounded-lg border-[#DDE7DF] text-sm font-semibold"
                      onClick={() => {
                        setRejectMode(false);
                        setRejectReason("");
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-9 flex-1 rounded-lg text-sm font-semibold"
                      disabled={!rejectReason || rejectSubmission.isPending}
                      onClick={handleReject}
                    >
                      {rejectSubmission.isPending ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 flex-1 rounded-lg border-[#DDE7DF] text-sm font-semibold"
                      onClick={() => setRejectMode(true)}
                    >
                      Reject
                    </Button>

                    <Button
                      size="sm"
                      className="h-9 flex-1 rounded-lg bg-[#006B22] text-sm font-semibold text-white hover:bg-[#00571C]"
                      disabled={approveSubmission.isPending}
                      onClick={handleApprove}
                    >
                      <BadgeCheck className="mr-1.5 h-3.5 w-3.5" />
                      {approveSubmission.isPending ? "Approving..." : "Approve"}
                    </Button>
                  </div>
                )}
              </div>

              {selectedSubmission.internal_log &&
                selectedSubmission.internal_log.length > 0 && (
                  <div className="border-t border-[#DDE7DF] px-4 pb-4 pt-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                      Internal Log
                    </p>

                    <div className="space-y-2">
                      {selectedSubmission.internal_log.map((log, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5F7168]" />

                          <div>
                            <p className="text-xs text-[#101828]">
                              <span className="font-semibold">{log.actor}</span>{" "}
                              <span className="text-[#667085]">
                                {log.action}
                              </span>
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#667085]">
                              {new Date(log.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}