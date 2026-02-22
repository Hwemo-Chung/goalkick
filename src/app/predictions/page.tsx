"use client";

import { useState, useEffect } from "react";
import { Prediction, UserProfile } from "@/types/football";
import PredictionSection from "@/components/PredictionSection";
import SelfAdBanner from "@/components/SelfAdBanner";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    level: 1, points: 0, totalPredictions: 0, correctPredictions: 0, streak: 0, badges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [predRes, profileRes] = await Promise.all([
          fetch("/api/football?type=predictions"),
          fetch("/api/football?type=profile"),
        ]);
        const [predData, profileData] = await Promise.all([
          predRes.json(),
          profileRes.json(),
        ]);
        setPredictions(predData.response ?? []);
        setProfile(profileData.response ?? {
          level: 1, points: 0, totalPredictions: 0, correctPredictions: 0, streak: 0, badges: [],
        });
      } catch {
        setPredictions([]);
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
      <PredictionSection predictions={predictions} profile={profile} />
      <SelfAdBanner />
    </>
  );
}
