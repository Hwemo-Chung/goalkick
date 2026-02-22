"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  size: "banner" | "leaderboard" | "rectangle";
  className?: string;
}

const sizeStyles: Record<string, { width: string; height: string }> = {
  banner: { width: "100%", height: "60px" },
  leaderboard: { width: "100%", height: "90px" },
  rectangle: { width: "300px", height: "250px" },
};

const formatMap: Record<string, string> = {
  banner: "horizontal",
  leaderboard: "horizontal",
  rectangle: "rectangle",
};

export default function AdSlot({ size, className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {}
  }, []);

  const style = sizeStyles[size];

  return (
    <div ref={adRef} className={`${className}`} style={{ minHeight: style.height }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: style.width, height: style.height }}
        data-ad-client="ca-pub-3498371918924514"
        data-ad-format={formatMap[size]}
        data-full-width-responsive={size !== "rectangle" ? "true" : "false"}
        data-ad-slot="auto"
      />
    </div>
  );
}
