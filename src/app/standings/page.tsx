"use client";

import { useState, useEffect, useCallback } from "react";
import { Standing, PlayerStats } from "@/types/football";
import StandingsStats from "@/components/StandingsStats";
import AdSlot from "@/components/AdSlot";

const LEAGUE_TABS = [
  { id: "39", name: "EPL", full: "Premier League" },
  { id: "140", name: "라리가", full: "La Liga" },
  { id: "135", name: "세리에A", full: "Serie A" },
  { id: "78", name: "분데스", full: "Bundesliga" },
  { id: "61", name: "리그1", full: "Ligue 1" },
  { id: "2", name: "UCL", full: "Champions League" },
  { id: "3", name: "UEL", full: "Europa League" },
] as const;

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("39");

  const fetchData = useCallback(async (leagueId: string) => {
    setLoading(true);
    try {
      const [standRes, scorerRes] = await Promise.all([
        fetch(`/api/football?type=standings&league=${leagueId}`),
        fetch(`/api/football?type=topscorers&league=${leagueId}`),
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
  }, []);

  useEffect(() => {
    fetchData(selectedLeague);
  }, [selectedLeague, fetchData]);

  const handleLeagueChange = (leagueId: string) => {
    if (leagueId !== selectedLeague) {
      setSelectedLeague(leagueId);
    }
  };

  return (
    <>
      <div className="px-4 pt-2 pb-1">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {LEAGUE_TABS.map((league) => (
            <button
              key={league.id}
              onClick={() => handleLeagueChange(league.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedLeague === league.id
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              }`}
              title={league.full}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">데이터 로딩 중...</p>
        </div>
      ) : (
        <>
          <StandingsStats standings={standings} topScorers={topScorers} />
          <AdSlot size="banner" className="mx-4 mt-4" />
        </>
      )}
    </>
  );
}
