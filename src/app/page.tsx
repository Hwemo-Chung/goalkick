"use client";

import { useState, useEffect } from "react";
import { Match } from "@/types/football";
import LiveScores from "@/components/LiveScores";
import AdSlot from "@/components/AdSlot";
import SelfAdBanner from "@/components/SelfAdBanner";

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/football?type=fixtures");
        const data = await res.json();
        setMatches(data.response ?? []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">경기 데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <LiveScores
        matches={matches}
        selectedLeague={selectedLeague}
        onLeagueFilter={setSelectedLeague}
      />
      <SelfAdBanner />
      <AdSlot size="rectangle" className="my-4" />
    </>
  );
}
