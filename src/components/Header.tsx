"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types/football";

export default function Header() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/football?type=profile")
      .then((res) => res.json())
      .then((data) => setProfile(data.response ?? null))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-[var(--border)] px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-black tracking-tight">
          <span className="text-[var(--accent)]">⚽</span> GoalKick
        </h1>
        <div className="flex items-center gap-2">
          {profile && (
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-card-hover)] px-2.5 py-1 rounded-full">
              Lv.{profile.level} · {profile.points}pt
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
