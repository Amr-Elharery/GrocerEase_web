import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Check } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "../hooks/useNotifications";

export default function NotificationsBell() {
  const { t } = useTranslation("notifications");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useNotifications(1, 20);
  const markRead = useMarkNotificationRead();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("time.justNow");
    if (mins < 60) return t("time.minutesAgo", { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t("time.hoursAgo", { count: hours });
    const days = Math.floor(hours / 24);
    return t("time.daysAgo", { count: days });
  };

  const items = data?.data ?? [];
  const unread = items.filter((n) => !n.is_read).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted/60"
        aria-label={t("bell.ariaLabel")}
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unread > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-12 z-50 w-[340px] overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
          <div className="flex items-center justify-between border-b border-[#EEF2EF] px-4 py-3">
            <p className="text-sm font-bold text-[#101828]">{t("panel.title")}</p>
            {unread > 0 && (
              <span className="rounded-full bg-[#EAF7EE] px-2 py-0.5 text-[11px] font-semibold text-[#006B22]">
                {t("panel.newCount", { count: unread })}
              </span>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-[#667085]">
                {t("panel.empty")}
              </p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 border-b border-[#F2F5F3] px-4 py-3 transition ${
                    n.is_read ? "bg-white" : "bg-[#F6FBF7]"
                  }`}
                >
                  <div
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2D6A4F]"
                    style={{ opacity: n.is_read ? 0 : 1 }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#101828]">
                      {n.notification?.title ?? t("item.defaultTitle")}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-[#667085]">
                      {n.notification?.body}
                    </p>
                    <p className="mt-1 text-[11px] text-[#98A2B3]">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <button
                      type="button"
                      onClick={() => markRead.mutate(n.notification_id)}
                      title={t("item.markAsRead")}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#DDE7DF] text-[#5F7168] transition hover:bg-[#EAF7EE] hover:text-[#006B22]"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}