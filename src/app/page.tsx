"use client";

import { useState, useEffect } from "react";
import { Match, NewsItem, Prediction, Standing, PlayerStats, UserProfile } from "@/types/football";
import LiveScores from "@/components/LiveScores";
import NewsFeed from "@/components/NewsFeed";
import PredictionSection from "@/components/PredictionSection";
import StandingsStats from "@/components/StandingsStats";
import ProfileSection from "@/components/ProfileSection";
import AdSlot from "@/components/AdSlot";
import SelfAdBanner from "@/components/SelfAdBanner";

type Tab = "live" | "news" | "predictions" | "standings" | "profile";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "live", label: "라이브", icon: "⚽" },
  { id: "news", label: "뉴스", icon: "📰" },
  { id: "predictions", label: "예측", icon: "🎯" },
  { id: "standings", label: "순위", icon: "📊" },
  { id: "profile", label: "프로필", icon: "👤" },
];

interface AppData {
  matches: Match[];
  news: NewsItem[];
  predictions: Prediction[];
  standings: Standing[];
  topScorers: PlayerStats[];
  profile: UserProfile;
}
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("live");
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchRes, newsRes, predRes, standRes, scorerRes, profileRes] = await Promise.all([
          fetch("/api/football?type=fixtures"),
          fetch("/api/football?type=news"),
          fetch("/api/football?type=predictions"),
          fetch("/api/football?type=standings"),
          fetch("/api/football?type=topscorers"),
          fetch("/api/football?type=profile"),
        ]);

        const [matchData, newsData, predData, standData, scorerData, profileData] = await Promise.all([
          matchRes.json(),
          newsRes.json(),
          predRes.json(),
          standRes.json(),
          scorerRes.json(),
          profileRes.json(),
        ]);

        setData({
          matches: matchData.response ?? [],
          news: newsData.response ?? [],
          predictions: predData.response ?? [],
          standings: standData.response?.[0]?.league?.standings?.[0] ?? [],
          topScorers: scorerData.response ?? [],
          profile: profileData.response ?? { level: 1, points: 0, totalPredictions: 0, correctPredictions: 0, streak: 0, badges: [] },
        });
      } catch {
        setData({
          matches: [],
          news: [],
          predictions: [],
          standings: [],
          topScorers: [],
          profile: { level: 1, points: 0, totalPredictions: 0, correctPredictions: 0, streak: 0, badges: [] },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 glass-card border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-black tracking-tight">
            <span className="text-[var(--accent)]">⚽</span> GoalKick
          </h1>
          <div className="flex items-center gap-2">
            {data && (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-card-hover)] px-2.5 py-1 rounded-full">
                Lv.{data.profile.level} · {data.profile.points}pt
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <AdSlot size="leaderboard" className="mx-4 mt-3" />

        <main className="mt-3 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[var(--text-muted)]">경기 데이터 로딩 중...</p>
            </div>
          ) : data ? (
            <>
              {activeTab === "live" && (
                <>
                  <LiveScores
                    matches={data.matches}
                    selectedLeague={selectedLeague}
                    onLeagueFilter={setSelectedLeague}
                  />
                  <SelfAdBanner />
                  <AdSlot size="rectangle" className="my-4" />
                </>
              )}
              {activeTab === "news" && (
                <>
                  <NewsFeed news={data.news} />
                  <AdSlot size="banner" className="mx-4 mt-4" />
                </>
              )}
              {activeTab === "predictions" && (
                <>
                  <PredictionSection predictions={data.predictions} profile={data.profile} />
                  <SelfAdBanner />
                </>
              )}
              {activeTab === "standings" && (
                <>
                  <StandingsStats standings={data.standings} topScorers={data.topScorers} />
                  <AdSlot size="banner" className="mx-4 mt-4" />
                </>
              )}
              {activeTab === "profile" && (
                <ProfileSection profile={data.profile} />
              )}
            </>
          ) : null}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                activeTab === tab.id
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}