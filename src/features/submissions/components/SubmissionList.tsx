import { useState } from "react";
import { useSubmissions, useApproveSubmission, useRejectSubmission } from "../hooks/useSubmissions";
import { type Submission } from "../api/submissionService";
import { X, Check, Eye, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { id: "12-1", name: "Sugar" }, { id: "12-2", name: "Salt" }, { id: "12-3", name: "Flour" },
  ]},
];

const rejectReasons = [
  "Duplicate product",
  "Invalid category",
  "Insufficient information",
  "Not a grocery product",
  "Other",
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  flagged: "bg-red-50 text-red-700 border border-red-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-slate-50 text-slate-600 border border-slate-200",
};

type TabType = "all" | "pending" | "flagged";

export default function SubmissionList() {
  const { data: submissions = [], isLoading } = useSubmissions();
  const approveSubmission = useApproveSubmission();
  const rejectSubmission = useRejectSubmission();

  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [editData, setEditData] = useState<Partial<Submission>>({});

  const filtered = submissions.filter(s => {
    if (selectedTab === "pending") return s.status === "pending";
    if (selectedTab === "flagged") return s.status === "flagged";
    return true;
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const flaggedCount = submissions.filter(s => s.status === "flagged").length;

  const handleSelectRow = (s: Submission) => {
    setSelectedSubmission(s);
    setEditData({
      product_name: s.product_name,
      barcode: s.barcode,
      category_id: s.category_id,
      sub_category_id: s.sub_category_id,
      description: s.description,
      brand: s.brand,
      unit: s.unit,
    });
    setRejectMode(false);
    setRejectReason("");
  };

  const handleApprove = () => {
    if (!selectedSubmission) return;
    approveSubmission.mutate({ id: selectedSubmission.id, data: editData }, {
      onSuccess: () => setSelectedSubmission(null),
    });
  };

  const handleReject = () => {
    if (!selectedSubmission || !rejectReason) return;
    rejectSubmission.mutate({ id: selectedSubmission.id, reason: rejectReason }, {
      onSuccess: () => { setSelectedSubmission(null); setRejectMode(false); setRejectReason(""); },
    });
  };

  const selectedCategory = categories.find(c => c.id === editData.category_id);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="flex gap-4 h-full">

      {/* Left — Submissions List */}
      <div className={`flex flex-col space-y-4 transition-all duration-300 ${selectedSubmission ? "flex-1" : "w-full"}`}>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Product Submissions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {pendingCount} Pending Submissions requiring your review
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-border rounded-lg overflow-hidden">

          {/* Tabs */}
          <div className="flex items-center justify-between px-4 border-b border-border">
            <div className="flex">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: `Pending (${pendingCount})` },
                { key: "flagged", label: `Flagged (${flaggedCount})` },
              ].map(tab => (
                <button key={tab.key} onClick={() => setSelectedTab(tab.key as TabType)}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                    selectedTab === tab.key
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Sorted by Oldest First</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Submission ID</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Product Name</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Barcode</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Submitter</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(s => (
                  <tr key={s.id}
                    onClick={() => handleSelectRow(s)}
                    className={`cursor-pointer transition-colors ${
                      selectedSubmission?.id === s.id ? "bg-muted/30" : "hover:bg-muted/20"
                    }`}>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">#{s.submission_id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {s.image_url ? (
                          <img src={s.image_url} alt="" className="w-8 h-8 rounded object-cover shrink-0 border border-border" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                            {s.product_name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-semibold whitespace-nowrap">{s.product_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{s.barcode}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm whitespace-nowrap">{s.category_name}</p>
                      <p className="text-xs text-muted-foreground">{s.sub_category_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm whitespace-nowrap">{s.submitted_by}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        s.submitter_role === "STORE_MANAGER"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}>
                        {s.submitter_role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(s.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleSelectRow(s)}
                          className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { handleSelectRow(s); setTimeout(() => handleApprove(), 100); }}
                          className="w-7 h-7 flex items-center justify-center rounded border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { handleSelectRow(s); setRejectMode(true); }}
                          className="w-7 h-7 flex items-center justify-center rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
            Showing 1-{filtered.length} of {filtered.length} submissions
          </div>
        </div>
      </div>

      {/* Right — Review Panel */}
      {selectedSubmission && (
        <div className="w-80 shrink-0 space-y-3">
          <div className="bg-white border border-border rounded-lg overflow-hidden">

            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <p className="text-sm font-semibold">Quick Review</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {selectedSubmission.submission_id}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted/50">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setSelectedSubmission(null)}
                  className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted/50">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">

              {/* Image */}
              <div className="w-full h-36 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {selectedSubmission.image_url ? (
                  <img src={selectedSubmission.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs text-muted-foreground">No image submitted</p>
                )}
              </div>

              {/* Editable Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product Name</label>
                  <input value={editData.product_name ?? ""}
                    onChange={e => setEditData(p => ({ ...p, product_name: e.target.value }))}
                    className="w-full h-7 mt-1 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand</label>
                    <input value={editData.brand ?? ""}
                      onChange={e => setEditData(p => ({ ...p, brand: e.target.value }))}
                      className="w-full h-7 mt-1 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">SKU Status</label>
                    <p className="text-sm font-medium mt-1">{selectedSubmission.sku_status ?? "-"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Barcode</label>
                  <input value={editData.barcode ?? ""}
                    onChange={e => setEditData(p => ({ ...p, barcode: e.target.value }))}
                    className="w-full h-7 mt-1 rounded border border-input bg-transparent px-2 text-sm font-mono outline-none focus:border-ring" />
                </div>

                {/* Category Picker */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                  <select value={editData.category_id ?? ""}
                    onChange={e => setEditData(p => ({ ...p, category_id: e.target.value, sub_category_id: "" }))}
                    className="w-full h-7 mt-1 rounded border border-input bg-transparent px-2 text-sm outline-none focus:border-ring">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {selectedCategory && (
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sub-Category</label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedCategory.sub_categories.map(sub => (
                        <button key={sub.id} type="button"
                          onClick={() => setEditData(p => ({ ...p, sub_category_id: sub.id }))}
                          className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                            editData.sub_category_id === sub.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:bg-muted"
                          }`}>
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product Description</label>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedSubmission.description}</p>
                </div>
              </div>

              {/* Assets */}
              {selectedSubmission.assets && selectedSubmission.assets.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Attached Assets ({selectedSubmission.assets.length})
                  </p>
                  <div className="space-y-1.5">
                    {selectedSubmission.assets.map((asset, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {asset.type === "pdf" ? "PDF" : "IMG"}
                          </div>
                          <span className="text-xs font-medium truncate max-w-[120px]">{asset.name}</span>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject Reason */}
              {rejectMode && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Select Rejection Reason</p>
                  <div className="space-y-1">
                    {rejectReasons.map(reason => (
                      <button key={reason} type="button"
                        onClick={() => setRejectReason(reason)}
                        className={`w-full text-left px-3 py-2 rounded border text-xs transition-colors ${
                          rejectReason === reason
                            ? "border-destructive bg-destructive/5 text-destructive font-medium"
                            : "border-border hover:bg-muted/50"
                        }`}>
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {rejectMode ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"
                    onClick={() => { setRejectMode(false); setRejectReason(""); }}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1"
                    disabled={!rejectReason || rejectSubmission.isPending}
                    onClick={handleReject}>
                    {rejectSubmission.isPending ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"
                    onClick={() => setRejectMode(true)}>
                    Reject
                  </Button>
                  <Button size="sm" className="flex-1"
                    disabled={approveSubmission.isPending}
                    onClick={handleApprove}>
                    {approveSubmission.isPending ? "Approving..." : "Approve"}
                  </Button>
                </div>
              )}
            </div>

            {/* Internal Log */}
            {selectedSubmission.internal_log && selectedSubmission.internal_log.length > 0 && (
              <div className="px-4 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Internal Log</p>
                <div className="space-y-2">
                  {selectedSubmission.internal_log.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs">
                          <span className="font-semibold">{log.actor}</span>{" "}
                          <span className="text-muted-foreground">{log.action}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}