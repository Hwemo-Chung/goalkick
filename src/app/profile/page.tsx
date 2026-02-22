"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types/football";
import ProfileSection from "@/components/ProfileSection";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    level: 1, points: 0, totalPredictions: 0, correctPredictions: 0, streak: 0, badges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/football?type=profile");
        const data = await res.json();
        setProfile(data.response ?? {
          level: 1, points: 0, totalPredictions: 0, correctPredictions: 0, streak: 0, badges: [],
        });
      } catch {
        // keep defaults
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

  return <ProfileSection profile={profile} />;
}
