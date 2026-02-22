"use client";

import { useState } from "react";
import { Standing, PlayerStats } from "@/types/football";


const AVATAR_COLORS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff6a88 100%)",
  "linear-gradient(135deg, #667eea 0%, #00d2ff 100%)",
];

interface StandingsStatsProps {
  standings: Standing[];
  topScorers: PlayerStats[];
}

export default function StandingsStats({ standings, topScorers }: StandingsStatsProps) {
  const [activeTab, setActiveTab] = useState<"standings" | "scorers">("standings");
  const maxGoals = Math.max(...topScorers.map(p => p.statistics[0]?.goals.total ?? 0), 1);

  return (
    <div className="animate-fade-in">
      <div className="flex border-b border-[var(--border)] mx-4">
        <button
          onClick={() => setActiveTab("standings")}
          className={`league-tab px-4 py-3 text-sm font-medium ${activeTab === "standings" ? "active" : "text-[var(--text-secondary)]"}`}
        >
          순위표
        </button>
        <button
          onClick={() => setActiveTab("scorers")}
          className={`league-tab px-4 py-3 text-sm font-medium ${activeTab === "scorers" ? "active" : "text-[var(--text-secondary)]"}`}
        >
          득점 순위
        </button>
      </div>

      {activeTab === "standings" ? (
        <div className="px-4 mt-4">
          <div className="section-card overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                  <th className="text-left py-2.5 px-3 w-8">#</th>
                  <th className="text-left py-2.5 px-2">팀</th>
                  <th className="text-center py-2.5 px-1.5 w-8">경기</th>
                  <th className="text-center py-2.5 px-1.5 w-8">승</th>
                  <th className="text-center py-2.5 px-1.5 w-8">무</th>
                  <th className="text-center py-2.5 px-1.5 w-8">패</th>
                  <th className="text-center py-2.5 px-1.5 w-8">득실</th>
                  <th className="text-center py-2.5 px-2 w-10 font-bold">승점</th>
                  <th className="text-center py-2.5 px-2 hidden sm:table-cell">최근</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => {
                  let borderColor = "";
                  if (team.rank <= 4) borderColor = "border-l-[3px] border-l-[var(--accent)]";
                  else if (team.rank === 5) borderColor = "border-l-[3px] border-l-[var(--warning)]";
                  else if (team.rank >= 18) borderColor = "border-l-[3px] border-l-[var(--danger)]";

                  return (
                    <tr key={team.team.id} className={`border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-card-hover)] transition-colors ${borderColor}`}>
                      <td className="py-2.5 px-3 font-semibold text-[var(--text-secondary)]">{team.rank}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <img src={team.team.logo} alt="" className="w-5 h-5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <span className="font-medium truncate max-w-[100px]">{team.team.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-2.5 px-1.5 text-[var(--text-secondary)]">{team.all.played}</td>
                      <td className="text-center py-2.5 px-1.5">{team.all.win}</td>
                      <td className="text-center py-2.5 px-1.5 text-[var(--text-secondary)]">{team.all.draw}</td>
                      <td className="text-center py-2.5 px-1.5 text-[var(--text-secondary)]">{team.all.lose}</td>
                      <td className="text-center py-2.5 px-1.5">
                        <span className={team.goalsDiff > 0 ? "text-[var(--accent)]" : team.goalsDiff < 0 ? "text-[var(--danger)]" : ""}>
                          {team.goalsDiff > 0 ? "+" : ""}{team.goalsDiff}
                        </span>
                      </td>
                      <td className="text-center py-2.5 px-2 font-bold">{team.points}</td>
                      <td className="py-2.5 px-2 hidden sm:table-cell">
                        <div className="flex gap-0.5 justify-center">
                          {team.form.split("").map((f, i) => (
                            <span key={i} className={`form-dot ${f}`}>{f}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="px-4 mt-4 space-y-3">
          {topScorers.map((player, idx) => {
            const stats = player.statistics[0];
            if (!stats) return null;
            const goalPercent = ((stats.goals.total ?? 0) / maxGoals) * 100;

            return (
              <div key={player.player.id} className="section-card p-4 flex items-center gap-3">
                <span className="text-lg font-bold text-[var(--text-muted)] w-6 shrink-0">{idx + 1}</span>
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {player.player.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold truncate">{player.player.name}</span>
                    <img src={stats.team.logo} alt="" className="w-4 h-4 shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{stats.team.name}</p>
                  <div className="stat-bar mt-2">
                    <div className="stat-bar-fill" style={{ width: `${goalPercent}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-[var(--accent)]">{stats.goals.total ?? 0}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{stats.goals.assists ?? 0} 어시스트</p>
                  {stats.games.rating && (
                    <p className="text-[10px] text-[var(--warning)] mt-0.5">★ {stats.games.rating}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
