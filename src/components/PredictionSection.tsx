"use client";

import { useState } from "react";
import { Prediction, UserProfile, getNextLevelProgress } from "@/types/football";

interface PredictionSectionProps {
  predictions: Prediction[];
  profile: UserProfile;
}

export default function PredictionSection({ predictions: initialPredictions, profile }: PredictionSectionProps) {
  const [predictions, setPredictions] = useState(initialPredictions);
  const accuracy = profile.totalPredictions > 0
    ? Math.round((profile.correctPredictions / profile.totalPredictions) * 100)
    : 0;

  const handlePrediction = (predId: string, choice: "home" | "draw" | "away") => {
    setPredictions(prev =>
      prev.map(p => {
        if (p.id !== predId || p.result !== null) return p;
        return { ...p, userPrediction: p.userPrediction === choice ? null : choice };
      })
    );
  };

  const getPredictionClass = (pred: Prediction, choice: "home" | "draw" | "away") => {
    if (pred.result !== null && pred.userPrediction === choice) {
      return pred.result === choice ? "correct" : "wrong";
    }
    if (pred.userPrediction === choice) return "selected";
    return "";
  };

  const levelProgress = getNextLevelProgress(profile.points);

  return (
    <div className="animate-fade-in px-4 space-y-4">
      <div className="section-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">내 예측</p>
            <p className="text-2xl font-bold mt-1">{profile.points} <span className="text-sm text-[var(--accent)]">포인트</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <span>🎯 {accuracy}%</span>
              <span>🔥 {profile.streak}연속</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {profile.correctPredictions}/{profile.totalPredictions} 적중
            </p>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${levelProgress.progress}%` }} />
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
          Lv.{profile.level} → Lv.{profile.level + 1} ({Math.round(levelProgress.progress)}%)
        </p>
      </div>

      <div className="space-y-3">
        {predictions.map(pred => (
          <div key={pred.id} className="section-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{pred.league}</span>
              {pred.result !== null && (
                <span className={`text-xs font-bold ${pred.result === pred.userPrediction ? "text-[var(--accent)]" : "text-[var(--danger)]"}`}>
                  {pred.result === pred.userPrediction ? `+${pred.points}pt ✅` : "0pt ❌"}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between my-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center overflow-hidden shrink-0">
                  <img src={pred.homeTeamLogo} alt="" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <span className="text-xs font-medium truncate">{pred.homeTeam}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)] px-2">vs</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-xs font-medium truncate text-right">{pred.awayTeam}</span>
                <div className="w-8 h-8 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center overflow-hidden shrink-0">
                  <img src={pred.awayTeamLogo} alt="" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["home", "draw", "away"] as const).map(choice => (
                <button
                  key={choice}
                  onClick={() => handlePrediction(pred.id, choice)}
                  disabled={pred.result !== null}
                  className={`prediction-btn py-2 rounded-xl text-xs font-semibold ${getPredictionClass(pred, choice)} disabled:cursor-not-allowed`}
                >
                  {choice === "home" ? "홈승" : choice === "draw" ? "무승부" : "원정승"}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-2 text-center">
              {new Date(pred.kickoff).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
