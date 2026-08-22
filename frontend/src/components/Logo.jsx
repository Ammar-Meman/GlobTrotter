import { Link } from "react-router-dom";

export default function Logo({
  size = "md",
  theme = "auto", // 'auto' | 'light' | 'dark'
  showTagline = false,
  className = "",
  to = "/dashboard",
}) {
  const sizeMap = {
    sm: {
      icon: "w-7 h-7",
      text: "text-lg",
      tagline: "text-[9px]",
    },
    md: {
      icon: "w-9 h-9",
      text: "text-2xl",
      tagline: "text-[10px]",
    },
    lg: {
      icon: "w-11 h-11",
      text: "text-3xl",
      tagline: "text-xs",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Custom Modern Globe + Orbit Travel Icon */}
      <div
        className={`relative ${currentSize.icon} rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-400 p-[1.5px] shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105 shrink-0`}
      >
        <div className="w-full h-full bg-slate-950/80 backdrop-blur-xs rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Grid Globe Lines */}
          <svg
            className="w-full h-full p-1.5 text-white/90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Globe Outer Circle */}
            <circle cx="12" cy="12" r="10" stroke="url(#logo-grad)" strokeWidth="1.8" />
            {/* Latitude Ellipses */}
            <path
              d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
              stroke="white"
              strokeOpacity="0.5"
              strokeWidth="1.2"
            />
            <path
              d="M2 12h20"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />
            {/* Aerodynamic Flight Arc with Jet Marker */}
            <path
              d="M3.5 19.5 C 8 13, 14 7, 20.5 3.5"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 0"
            />
            <polygon
              points="20.5,3.5 17,5 19,7"
              fill="#38bdf8"
              stroke="#38bdf8"
              strokeWidth="0.5"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span
            className={`font-black ${currentSize.text} ${
              theme === "light"
                ? "text-white"
                : theme === "dark"
                ? "text-slate-900"
                : "text-slate-900 dark:text-white"
            }`}
          >
            Globe
          </span>
          <span
            className={`font-black ${currentSize.text} bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent`}
          >
            Trotter
          </span>
        </div>
        {showTagline && (
          <span
            className={`font-bold tracking-wider uppercase ${currentSize.tagline} text-slate-500 dark:text-slate-400 mt-0.5`}
          >
            Travel Planner
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
