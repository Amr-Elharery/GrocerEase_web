import { type ElementType } from "react";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
  Copy,
  FileText,
  Terminal,
  BookOpen,
  Rocket,
  Package,
  Shield,
  CreditCard,
} from "lucide-react";
import {
  useSupportCategories,
  useSystemStatus,
  useDocLinks,
  useContactInfo,
} from "../hooks/useSupport";
import { type Category } from "../api/supportService";

const categoryConfig: Record<string, { icon: ElementType; bg: string }> = {
  getting_started: { icon: Rocket, bg: "bg-[#EAF7EE] text-[#16A34A]" },
  inventory: { icon: Package, bg: "bg-[#EAF1FF] text-[#2563EB]" },
  users: { icon: Shield, bg: "bg-[#F3F4F6] text-[#5F7168]" },
  billing: { icon: CreditCard, bg: "bg-[#FEE2E2] text-[#DC2626]" },
};

const docIconMap: Record<string, ElementType> = {
  api: FileText,
  sdk: Terminal,
  manual: BookOpen,
};

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function Support() {
  const { data: categories = [], isLoading: categoriesLoading } =
    useSupportCategories();
  const { data: systemStatus = [] } = useSystemStatus();
  const { data: docLinks = [] } = useDocLinks();
  const { data: contactInfo } = useContactInfo();

  if (categoriesLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1000px] space-y-4">
      {/* Hero */}
      <div
className="relative flex min-h-[170px] overflow-hidden rounded-2xl px-8 py-7 md:px-10"
        style={{
          background:
            "linear-gradient(135deg, #1B4332 0%, #2D6A4F 52%, #52B788 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #52B788 0%, transparent 50%), radial-gradient(circle at 82% 20%, #86efac 0%, transparent 42%)",
          }}
        />

        <div className="relative z-10 flex max-w-3xl flex-col justify-center">
          <h1 className="text-[26px] font-bold tracking-tight text-white">
            How can we help you today?
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#B7F3CA]">
            Access documentation, technical support, and ZAD resources from one
            centralized support hub.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="h-10 rounded-xl bg-white px-5 text-sm font-bold text-[#1B4332] transition hover:shadow-lg"
            >
              Submit a Ticket
            </button>

            <button
              type="button"
              className="h-10 rounded-xl border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Live Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* Left */}
        <div className="space-y-4 lg:col-span-8">
          {/* Category Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((cat: Category) => {
              const config = categoryConfig[cat.type];
              const Icon = config?.icon ?? Rocket;

              return (
                <SectionCard
                  key={cat.id}
                  className="group flex min-h-[100px] cursor-pointer flex-col p-5 transition hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                      config?.bg ?? "bg-[#F3F4F6] text-[#5F7168]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-bold text-[#101828]">
                    {cat.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-5 text-[#667085]">
                    {cat.description}
                  </p>

                  <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#2D6A4F]">
                    {cat.articles} Articles
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </SectionCard>
              );
            })}
          </div>

          {/* Technical Documentation */}
          <SectionCard className="p-5">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-bold text-[#1B4332]">
                  Technical Documentation
                </h3>

                <p className="mt-1 text-sm text-[#667085]">
                  Resources for developers and technical administrators.
                </p>
              </div>

              <button
                type="button"
                className="shrink-0 text-sm font-semibold text-[#2D6A4F] hover:underline"
              >
                View All Docs
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {docLinks.map((doc) => {
                const Icon = docIconMap[doc.type] ?? FileText;

                return (
                  <button
                    key={doc.id}
                    type="button"
                    className="group flex min-h-[78px] items-center gap-3 rounded-xl border border-[#DDE7DF] p-4 text-left transition hover:border-[#2D6A4F] hover:bg-[#F8FAF8]"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[#667085] transition group-hover:text-[#2D6A4F]" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#101828]">
                        {doc.title}
                      </p>

                      <p className="truncate text-xs text-[#667085]">
                        {doc.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Right */}
        <div className="space-y-4 lg:col-span-4">
          {/* System Status */}
          <SectionCard className="p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                System Status
              </h3>

              <div className="flex items-center gap-1.5 rounded-full bg-[#EAF7EE] px-3 py-1 text-xs font-bold text-[#16A34A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                All Operational
              </div>
            </div>

            <div className="space-y-3">
              {systemStatus.map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between rounded-xl bg-[#F8FAF8] p-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#16A34A]" />

                    <span className="truncate text-sm text-[#344054]">
                      {status.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-[#667085]">
                    {status.uptime}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 w-full border-t border-[#DDE7DF] pt-4 text-sm font-semibold text-[#667085] transition hover:text-[#2D6A4F]"
            >
              View History & Incident Logs
            </button>
          </SectionCard>

          {/* Contact Card */}
          <div
            className="relative overflow-hidden rounded-xl p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
            style={{
              background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
            }}
          >
            <div className="absolute bottom-[-28px] right-[-28px] h-40 w-40 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#86efac]">
                Dedicated Support
              </p>

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#52B788] text-lg font-bold text-white">
                  Z
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-white">
                    {contactInfo?.name ?? "ZAD Support Team"}
                  </p>

                  <p className="text-sm text-white/70">
                    Your Account Manager
                  </p>
                </div>
              </div>

              <div className="mb-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 shrink-0 text-[#86efac]" />
                  <span className="truncate">{contactInfo?.email}</span>
                </div>

                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 shrink-0 text-[#86efac]" />
                  <span>{contactInfo?.phone}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-white/50">
                  Technical Support Email
                </p>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/10 p-2.5">
                  <span className="truncate text-sm">
                    {contactInfo?.support_email}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        contactInfo?.support_email ?? ""
                      )
                    }
                    className="shrink-0 text-white/70 transition hover:text-[#86efac]"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}