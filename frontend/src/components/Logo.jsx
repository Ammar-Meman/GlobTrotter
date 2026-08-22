import { Link } from "react-router-dom";

export default function Logo({
  size = "md",
  className = "",
  to = "/dashboard",
}) {
  const sizeMap = {
    sm: {
      icon: "w-8 h-8",
      plane: "w-4 h-4",
      text: "text-lg",
    },
    md: {
      icon: "w-9 h-9",
      plane: "w-5 h-5",
      text: "text-2xl",
    },
    lg: {
      icon: "w-10 h-10",
      plane: "w-5 h-5",
      text: "text-2xl",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Clean Dotted Orbit with Airplane Icon matching the design */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center`}>
        {/* Subtle dashed orbit circle */}
        <svg
          className="absolute inset-0 w-full h-full text-blue-500"
          viewBox="0 0 36 36"
          fill="none"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeDasharray="4 3"
            strokeOpacity="0.85"
          />
        </svg>

        {/* Crisp Flight Jet Icon */}
        <svg
          className={`${currentSize.plane} text-blue-600 -rotate-45 relative z-10`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>

      {/* Clean Bold Brand Text */}
      <span className={`font-bold tracking-tight text-slate-900 ${currentSize.text}`}>
        GlobeTrotter
      </span>
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
