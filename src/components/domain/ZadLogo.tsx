import { Link } from "react-router";

export function ZadLogo({ collapsed, to }: { collapsed: boolean; to: string }) {
  return (
    <Link
      to={to}
      dir="ltr"
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-1 rtl:justify-end"
      }`}
    >
      <span className="text-[42px] leading-none font-black tracking-[-0.12em] text-[#52B788]">
        Z
      </span>

      {!collapsed && (
        <span className="ml-1 text-[27px] leading-none font-black tracking-[-0.04em] text-white">
          AD
        </span>
      )}
    </Link>
  );
}
