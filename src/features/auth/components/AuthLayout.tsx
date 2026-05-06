import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #e6f3eb 50%, #f8faf8 100%)" }}>

      {/* Wave blobs */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-48 opacity-20">
          <path d="M0,100 C250,200 750,0 1000,100 L1000,200 L0,200 Z" fill="#1B4332" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-36 opacity-25">
          <path d="M0,120 C200,60 800,180 1000,80 L1000,200 L0,200 Z" fill="#2D6A4F" />
        </svg>
      </div>

      {/* Left — Brand Side */}
      <div className="hidden lg:flex flex-col w-[45%] relative z-10 p-12 gap-8">

        {/* Logo */}
        <div className="flex items-center gap-2">
    <svg width="36" height="44" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#52B788" />
          <stop offset="100%" stopColor="#1B4332" />
        </linearGradient>
      </defs>
      <path d="M3 3H29L7 35H29" stroke="url(#zGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="text-4xl font-bold text-[#1a1f2e] tracking-tight">AD</span>
  </div>

        {/* Tagline */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[#1B4332] leading-tight">
  Built for Grocery.<br />Designed for Growth.
</h1>
<div className="w-12 h-1 bg-[#2D6A4F] rounded-full" />
<p className="text-[#2D6A4F] text-sm leading-relaxed max-w-xs">
  ZAD brings your entire store online — manage inventory, track orders, and grow your business from one powerful platform.
</p>
        </div>
      </div>

      {/* Right — Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}