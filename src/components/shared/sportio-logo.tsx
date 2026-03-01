export function SportioLogo({ className = "h-10", white = false }: { className?: string; white?: boolean }) {
  const textColor = white ? "#FFFFFF" : "#1E40AF";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Shield icon */}
      <svg viewBox="0 0 65 85" fill="none" className="h-full w-auto" preserveAspectRatio="xMidYMid meet">
        <path
          d="M32.2604 0.782241L63.7912 12.9749V39.7986C63.7912 54.4298 53.2809 69.0609 32.2604 83.6921C11.2399 69.0609 0.729593 54.4298 0.729593 39.7986V12.9749L32.2604 0.782241Z"
          fill="#FDE047"
          stroke="#FBBF24"
          strokeWidth="1.45919"
        />
        {/* S letter inside shield */}
        <text
          x="32"
          y="52"
          textAnchor="middle"
          fontSize="38"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
          fill="#1E40AF"
        >
          S
        </text>
      </svg>
      {/* Text */}
      <span
        className="text-xl font-extrabold tracking-tight"
        style={{ color: textColor }}
      >
        Sportio
      </span>
    </div>
  );
}
