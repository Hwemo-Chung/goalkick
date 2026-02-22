"use client";

import { Match } from "@/types/football";

interface LiveScoresProps {
  matches: Match[];
  selectedLeague: number | null;
  onLeagueFilter: (leagueId: number | null) => void;
}

function getStatusDisplay(match: Match) {
  const { status } = match.fixture;
  if (status.short === "FT") return { text: "종료", color: "text-[var(--text-muted)]", live: false };
  if (status.short === "NS") {
    const time = new Date(match.fixture.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    return { text: time, color: "text-[var(--text-secondary)]", live: false };
  }
  if (["1H", "2H", "HT", "ET", "P"].includes(status.short)) {
    const label = status.short === "HT" ? "하프타임" : `${status.elapsed}'`;
    return { text: label, color: "text-[var(--live-pulse)]", live: true };
  }
  return { text: status.short, color: "text-[var(--text-muted)]", live: false };
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center overflow-hidden shrink-0">
      <img
        src={src}
        alt={name}
        className="w-6 h-6 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).parentElement!.textContent = name.charAt(0);
        }}
      />
    </div>
  );
}

export default function LiveScores({ matches, selectedLeague, onLeagueFilter }: LiveScoresProps) {
  const leagues = Array.from(new Map(matches.map(m => [m.league.id, m.league])).values());
  const filtered = selectedLeague ? matches.filter(m => m.league.id === selectedLeague) : matches;

  const grouped = filtered.reduce<Record<string, Match[]>>((acc, m) => {
    const key = `${m.league.id}-${m.league.name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        <button
          onClick={() => onLeagueFilter(null)}
          className={`nav-pill px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${
            selectedLeague === null ? "active" : "text-[var(--text-secondary)]"
          }`}
        >
          전체
        </button>
        {leagues.map(league => (
          <button
            key={league.id}
            onClick={() => onLeagueFilter(league.id)}
            className={`nav-pill px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              selectedLeague === league.id ? "active" : "text-[var(--text-secondary)]"
            }`}
          >
            <img src={league.logo} alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            {league.name}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {Object.entries(grouped).map(([key, groupMatches]) => (
          <div key={key} className="section-card">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]">
              <img
                src={groupMatches[0].league.logo}
                alt=""
                className="w-5 h-5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="text-sm font-semibold">{groupMatches[0].league.name}</span>
              {groupMatches[0].league.flag && (
                <img src={groupMatches[0].league.flag} alt="" className="w-4 h-3 rounded-sm" />
              )}
            </div>
            {groupMatches.map((match) => {
              const status = getStatusDisplay(match);
              return (
                <div
                  key={match.fixture.id}
                  className="match-card px-4 py-3 border-b border-[var(--border)] last:border-b-0 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 justify-end min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-right truncate">{match.teams.home.name}</span>
                      <TeamLogo src={match.teams.home.logo} name={match.teams.home.name} />
                    </div>

                    <div className="w-16 sm:w-20 text-center shrink-0">
                      {match.goals.home !== null ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-lg font-bold">{match.goals.home}</span>
                          <span className="text-[var(--text-muted)] text-sm">-</span>
                          <span className="text-lg font-bold">{match.goals.away}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[var(--text-muted)]">vs</span>
                      )}
                      <div className={`text-[10px] font-semibold mt-0.5 ${status.color} flex items-center justify-center gap-1`}>
                        {status.live && <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-pulse)] animate-pulse-live" />}
                        {status.text}
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <TeamLogo src={match.teams.away.logo} name={match.teams.away.name} />
                      <span className="text-xs sm:text-sm font-medium truncate">{match.teams.away.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p className="text-3xl mb-2">⚽</p>
            <p className="text-sm">오늘 예정된 경기가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
