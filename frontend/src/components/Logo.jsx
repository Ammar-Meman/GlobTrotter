import { Link } from "react-router-dom";

export default function Logo({
  size = "md",
  className = "",
  to = "/dashboard",
  theme = "dark", // "dark" = dark text, "light" = white text
}) {
  const sizeMap = {
    sm: { icon: "w-9 h-9", plane: "w-4.5 h-4.5", text: "text-xl" },
    md: { icon: "w-11 h-11", plane: "w-5.5 h-5.5", text: "text-2xl" },
    lg: { icon: "w-14 h-14", plane: "w-7 h-7", text: "text-3xl" },
  };

  const s = sizeMap[size] || sizeMap.md;
  const textColor = theme === "light" ? "text-white" : "text-slate-900";
  const iconColor = theme === "light" ? "text-white" : "text-sky-500";
  const orbitColor = theme === "light" ? "text-white/80" : "text-sky-400";

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${s.icon} flex items-center justify-center shrink-0`}>
        <svg className={`absolute inset-0 w-full h-full ${orbitColor}`} viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.75" strokeDasharray="4 3" strokeOpacity="0.85" />
        </svg>
        <svg className={`${s.plane} ${iconColor} -rotate-45 relative z-10`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>
      <span className={`font-semibold tracking-tight ${textColor} ${s.text}`}>GlobeTrotter</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }
  return content;
}
