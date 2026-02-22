"use client";

import { UserProfile, getNextLevelProgress } from "@/types/football";

interface ProfileSectionProps {
  profile: UserProfile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const levelProgress = getNextLevelProgress(profile.points);
  const accuracy = profile.totalPredictions > 0
    ? Math.round((profile.correctPredictions / profile.totalPredictions) * 100)
    : 0;

  return (
    <div className="animate-fade-in px-4 space-y-4">
      <div className="section-card p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center mb-3 animate-glow">
          <span className="text-2xl font-black text-white">Lv.{profile.level}</span>
        </div>
        <p className="text-xl font-bold">{profile.points.toLocaleString()} 포인트</p>
        <div className="max-w-xs mx-auto mt-3">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${levelProgress.progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
            <span>Lv.{profile.level}</span>
            <span>{Math.round(levelProgress.progress)}%</span>
            <span>Lv.{profile.level + 1}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="section-card p-4 text-center">
          <p className="text-2xl font-bold">{profile.totalPredictions}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">총 예측</p>
        </div>
        <div className="section-card p-4 text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{profile.correctPredictions}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">적중</p>
        </div>
        <div className="section-card p-4 text-center">
          <p className="text-2xl font-bold">{accuracy}%</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">정확도</p>
        </div>
        <div className="section-card p-4 text-center">
          <p className="text-2xl font-bold text-[var(--warning)]">🔥 {profile.streak}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">연속 적중</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-3 px-1">뱃지 컬렉션</h3>
        <div className="grid grid-cols-2 gap-3">
          {profile.badges.map(badge => (
            <div
              key={badge.id}
              className={`badge-card section-card p-4 text-center ${badge.unlockedAt ? "unlocked" : ""}`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="text-xs font-bold mt-2">{badge.name}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-snug">{badge.description}</p>
              {badge.unlockedAt && (
                <p className="text-[9px] text-[var(--accent)] mt-2">
                  {new Date(badge.unlockedAt).toLocaleDateString("ko-KR")} 획득
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
