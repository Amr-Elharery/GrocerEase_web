import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

export default function FilterDropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative min-w-[170px]">
      <button type="button" onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-left text-sm outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10">
        <span className={selected && selected.value ? "text-[#101828]" : "text-[#667085]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-[#5F7168]" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[42px] z-50 max-h-64 overflow-y-auto overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
          {options.map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-[#EAF7EE] ${
                opt.value === value
                  ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                  : "text-[#101828]"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}