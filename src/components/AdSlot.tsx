interface AdSlotProps {
  size: "banner" | "leaderboard" | "rectangle";
  className?: string;
}

const sizeMap = {
  banner: "h-[60px] w-full",
  leaderboard: "h-[90px] w-full",
  rectangle: "h-[250px] w-[300px] mx-auto",
};

export default function AdSlot({ size, className = "" }: AdSlotProps) {
  return (
    <div
      className={`ad-slot ${sizeMap[size]} ${className}`}
      data-ad-slot="auto"
      data-ad-format={size === "rectangle" ? "rectangle" : "horizontal"}
    >
      <span className="text-[var(--text-muted)] text-xs tracking-wider uppercase">
        광고 영역 · {size}
      </span>
    </div>
  );
}
