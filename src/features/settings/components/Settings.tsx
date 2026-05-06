import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Globe,
  Palette,
  Link,
  History,
  Download,
  Plus,
  ChevronDown,
  Check,
} from "lucide-react";

function ZadLogo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`font-black leading-none text-[#4BC083] ${
          small ? "text-[30px]" : "text-[42px]"
        }`}
      >
        Z
      </span>
      <span
        className={`font-black leading-none text-[#101828] ${
          small ? "text-[22px]" : "text-[30px]"
        }`}
      >
        AD
      </span>
    </div>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  iconBg,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBg: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-[#101828]">{title}</h3>
        <p className="text-sm text-[#667085]">{description}</p>
      </div>
    </div>
  );
}

function CustomSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
        {label}
      </label>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-left text-sm text-[#101828] outline-none transition hover:bg-white focus:border-[#2D6A4F]"
        >
          <span className="truncate">{value}</span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#5F7168] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                  value === option
                    ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                    : "text-[#101828] hover:bg-[#F8FAF8]"
                }`}
              >
                <span>{option}</span>

                {value === option && (
                  <Check className="h-3.5 w-3.5 text-[#006B22]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const auditLogs = [
  {
    time: "May 5, 2026 14:32",
    user: "omar.admin",
    action: "Updated Branding Settings",
    module: "Settings",
    status: "success",
  },
  {
    time: "May 5, 2026 13:15",
    user: "system_auth",
    action: "Failed Login Attempt (IP: 192.168.1.1)",
    module: "Security",
    status: "alert",
  },
  {
    time: "May 5, 2026 11:04",
    user: "ahmed.manager",
    action: "Changed User Role to Store Manager",
    module: "Users",
    status: "success",
  },
  {
    time: "May 4, 2026 09:20",
    user: "sara.admin",
    action: "Added New Integration",
    module: "Integrations",
    status: "success",
  },
  {
    time: "May 4, 2026 08:45",
    user: "system_auth",
    action: "Session Timeout — auto logout",
    module: "Security",
    status: "info",
  },
];

export default function Settings() {
  const [language, setLanguage] = useState("English (United States)");
  const [timezone, setTimezone] = useState("(GMT+02:00) Cairo");
  const [currency, setCurrency] = useState("EGP (ج.م) - 1,234.56");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [brandColor, setBrandColor] = useState("#1B4332");

  return (
    <section className="mx-auto max-w-[1420px] space-y-3">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">
          System Settings
        </h1>

        <p className="mt-1 text-[15px] text-[#667085]">
          Manage global configurations, security protocols, and platform visual
          identity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_420px] xl:items-stretch">
        <SectionCard className="min-h-[355px] p-5">
          <SectionHeader
            icon={Globe}
            title="Global Portal Settings"
            description="Regional defaults and localization"
            iconBg="bg-[#EAF7EE] text-[#16A34A]"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CustomSelect
              label="System Language"
              value={language}
              onChange={setLanguage}
              options={[
                "English (United States)",
                "Arabic (Egypt)",
                "French (France)",
              ]}
            />

            <CustomSelect
              label="Timezone"
              value={timezone}
              onChange={setTimezone}
              options={[
                "(GMT+02:00) Cairo",
                "(GMT+00:00) UTC",
                "(GMT+04:00) Dubai",
              ]}
            />

            <CustomSelect
              label="Currency Format"
              value={currency}
              onChange={setCurrency}
              options={[
                "EGP (ج.م) - 1,234.56",
                "USD ($) - 1,234.56",
                "AED (د.إ) - 1,234.56",
              ]}
            />

            <CustomSelect
              label="Date Format"
              value={dateFormat}
              onChange={setDateFormat}
              options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
            />
          </div>

          <div className="mt-auto flex justify-end border-t border-[#DDE7DF] pt-4">
            <button
              type="button"
              className="h-10 rounded-lg bg-[#006B22] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00571C]"
            >
              Save Changes
            </button>
          </div>
        </SectionCard>

        <SectionCard className="min-h-[355px] p-5">
          <SectionHeader
            icon={Palette}
            title="Branding"
            description="Identity and styling"
            iconBg="bg-[#F3F4F6] text-[#5F7168]"
          />

          <div className="flex flex-1 flex-col space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                Company Logo
              </label>

              <div className="flex h-[122px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#DDE7DF] bg-[#F8FAF8] transition-colors hover:border-[#2D6A4F]">
                <ZadLogo small />

                <p className="text-xs font-medium text-[#667085]">
                  Click to replace logo
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                Primary Brand Color
              </label>

              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border border-[#DDE7DF]"
                  style={{ backgroundColor: brandColor }}
                />

                <input
                  type="text"
                  value={brandColor}
                  onChange={(event) => setBrandColor(event.target.value)}
                  className="h-10 flex-1 rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm text-[#101828] outline-none focus:border-[#2D6A4F]"
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-auto h-10 w-full rounded-lg border border-[#DDE7DF] bg-white px-5 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
            >
              Update Brand
            </button>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-stretch">
        <SectionCard className="min-h-[360px] p-5">
          <SectionHeader
            icon={Shield}
            title="Security Configurations"
            description="Protect administrative access"
            iconBg="bg-[#FEE2E2] text-[#DC2626]"
          />

          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-[#DDE7DF] bg-[#F8FAF8] p-3">
              <div>
                <p className="text-sm font-semibold text-[#101828]">
                  Two-Factor Authentication
                </p>

                <p className="mt-0.5 text-xs text-[#667085]">
                  Require 2FA for all admin accounts.
                </p>
              </div>

              <button
                type="button"
                className="relative h-6 w-11 rounded-full bg-[#006B22]"
              >
                <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                Session Timeout (Minutes)
              </label>

              <input
                type="number"
                defaultValue={60}
                className="h-10 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm text-[#101828] outline-none focus:border-[#2D6A4F]"
              />
            </div>

            <div className="flex flex-1 flex-col space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                IP Whitelisting
              </label>

              <textarea
                placeholder="Enter authorized IP addresses, one per line..."
                className="min-h-[92px] flex-1 resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2.5 text-sm text-[#101828] outline-none focus:border-[#2D6A4F]"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="min-h-[360px] p-5">
          <SectionHeader
            icon={Link}
            title="API & Integrations"
            description="External service connections"
            iconBg="bg-[#EAF7EE] text-[#16A34A]"
          />

          <div className="flex flex-1 flex-col space-y-3">
            {[
              {
                name: "Logistics Hub API",
                status: "Connected • Last sync 2m ago",
              },
              {
                name: "Payment Gateway",
                status: "Connected • Live",
              },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center gap-3 rounded-xl border border-[#DDE7DF] bg-[#F8FAF8] p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Link className="h-4 w-4 text-[#2D6A4F]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#101828]">
                    {integration.name}
                  </p>

                  <p className="text-xs text-[#16A34A]">
                    {integration.status}
                  </p>
                </div>

                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-[#2D6A4F] hover:underline"
                >
                  Manage
                </button>
              </div>
            ))}

            <button
              type="button"
              className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#DDE7DF] text-sm font-semibold text-[#667085] transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
            >
              <Plus className="h-4 w-4" />
              Add New Integration
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F4F6]">
              <History className="h-5 w-5 text-[#5F7168]" />
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-[#101828]">
                System Audit Logs
              </h3>

              <p className="text-sm text-[#667085]">
                Recent system-wide changes and access history
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#2D6A4F] transition hover:bg-[#EAF7EE]"
          >
            <Download className="h-4 w-4" />
            Export Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8]">
                {["Timestamp", "User", "Action", "Module", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#667085]"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F3F4F6]">
              {auditLogs.map((log, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-[#F8FAF8]"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#344054]">
                    {log.time}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-[#101828]">
                    {log.user}
                  </td>

                  <td className="px-4 py-3 text-sm text-[#344054]">
                    {log.action}
                  </td>

                  <td className="px-4 py-3 text-sm text-[#344054]">
                    {log.module}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        log.status === "success"
                          ? "bg-[#EAF7EE] text-[#16A34A]"
                          : log.status === "alert"
                          ? "bg-[#FEE2E2] text-[#DC2626]"
                          : "bg-[#EAF1FF] text-[#2563EB]"
                      }`}
                    >
                      {log.status === "success"
                        ? "Success"
                        : log.status === "alert"
                        ? "Alert"
                        : "Info"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="px-4 py-2 text-sm font-semibold text-[#667085] transition hover:text-[#2D6A4F]"
          >
            View All Activity History
          </button>
        </div>
      </SectionCard>
    </section>
  );
}