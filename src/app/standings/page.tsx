"use client";

import { useState, useEffect } from "react";
import { Standing, PlayerStats } from "@/types/football";
import StandingsStats from "@/components/StandingsStats";
import AdSlot from "@/components/AdSlot";

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [standRes, scorerRes] = await Promise.all([
          fetch("/api/football?type=standings"),
          fetch("/api/football?type=topscorers"),
        ]);
        const [standData, scorerData] = await Promise.all([
          standRes.json(),
          scorerRes.json(),
        ]);
        setStandings(standData.response?.[0]?.league?.standings?.[0] ?? []);
        setTopScorers(scorerData.response ?? []);
      } catch {
        setStandings([]);
        setTopScorers([]);
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
        <p className="text-sm text-[var(--text-muted)]">데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <StandingsStats standings={standings} topScorers={topScorers} />
      <AdSlot size="banner" className="mx-4 mt-4" />
    </>
  );
}
