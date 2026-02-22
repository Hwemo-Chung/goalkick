// API route for football data — uses football-data.org v4 (free tier)
// Fallback to mock data when FOOTBALL_DATA_API_KEY is not set

import { NextRequest, NextResponse } from "next/server";
import { MOCK_MATCHES, MOCK_STANDINGS, MOCK_NEWS, MOCK_PREDICTIONS, MOCK_USER_PROFILE, MOCK_TOP_SCORERS } from "@/lib/mock-data";

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const API_BASE = "https://api.football-data.org/v4";

// football-data.org league codes (free tier)
const LEAGUE_CODES: Record<string, string> = {
  "39": "PL",     // Premier League
  "140": "PD",    // La Liga (Primera Division)
  "135": "SA",    // Serie A
  "78": "BL1",    // Bundesliga
  "61": "FL1",    // Ligue 1
  "2": "CL",      // Champions League
  "3": "EL",      // Europa League
};

// Reverse mapping: football-data.org competition id → our league id
const COMPETITION_TO_LEAGUE: Record<number, number> = {
  2021: 39,   // PL → Premier League
  2014: 140,  // PD → La Liga
  2019: 135,  // SA → Serie A
  2002: 78,   // BL1 → Bundesliga
  2015: 61,   // FL1 → Ligue 1
  2001: 2,    // CL → Champions League
  2146: 3,    // EL → Europa League
};

// Cache for expensive API calls (in-memory, resets on cold start)
const cache = new Map<string, { data: unknown; expires: number }>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown, ttlSeconds: number) {
  cache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 });
}

async function fetchFootballData(endpoint: string): Promise<unknown | null> {
  if (!API_KEY) return null;

  const cacheKey = endpoint;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "X-Auth-Token": API_KEY },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.error(`football-data.org error: ${res.status} ${res.statusText} for ${endpoint}`);
      return null;
    }

    const data = await res.json();
    setCache(cacheKey, data, 120); // cache 2 minutes
    return data;
  } catch (err) {
    console.error("football-data.org fetch error:", err);
    return null;
  }
}

// ─── Status mapping: football-data.org → our format ───
function mapMatchStatus(status: string, minute: number | null): { long: string; short: string; elapsed: number | null } {
  switch (status) {
    case "SCHEDULED":
    case "TIMED":
      return { long: "Not Started", short: "NS", elapsed: null };
    case "IN_PLAY":
      return { long: "Second Half", short: "2H", elapsed: minute ?? 45 };
    case "PAUSED":
      return { long: "Halftime", short: "HT", elapsed: 45 };
    case "EXTRA_TIME":
      return { long: "Extra Time", short: "ET", elapsed: minute ?? 90 };
    case "PENALTY_SHOOTOUT":
      return { long: "Penalty", short: "P", elapsed: 120 };
    case "FINISHED":
      return { long: "Match Finished", short: "FT", elapsed: 90 };
    case "SUSPENDED":
      return { long: "Suspended", short: "SUSP", elapsed: null };
    case "POSTPONED":
      return { long: "Postponed", short: "PST", elapsed: null };
    case "CANCELLED":
      return { long: "Cancelled", short: "CANC", elapsed: null };
    case "AWARDED":
      return { long: "Awarded", short: "AWD", elapsed: 90 };
    case "LIVE":
      return { long: "First Half", short: "1H", elapsed: minute ?? 1 };
    default:
      return { long: status, short: status.substring(0, 3).toUpperCase(), elapsed: null };
  }
}

// ─── Transform football-data.org matches → our Match[] format ───
interface FDMatch {
  id: number;
  utcDate: string;
  status: string;
  minute: number | null;
  matchday: number | null;
  stage: string;
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
  area: {
    name: string;
    code: string;
    flag: string;
  };
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    winner: string | null;
    duration: string;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
    extraTime?: { home: number | null; away: number | null };
    penalties?: { home: number | null; away: number | null };
  };
  referees: Array<{ id: number; name: string }>;
}

function transformMatches(fdMatches: FDMatch[]) {
  return fdMatches.map((m) => {
    const leagueId = COMPETITION_TO_LEAGUE[m.competition.id] ?? m.competition.id;
    const status = mapMatchStatus(m.status, m.minute);

    // Determine current score
    const isLive = ["IN_PLAY", "PAUSED", "LIVE", "EXTRA_TIME", "PENALTY_SHOOTOUT"].includes(m.status);
    const isFinished = ["FINISHED", "AWARDED"].includes(m.status);
    const goalsHome = m.score.fullTime.home ?? (isLive ? 0 : null);
    const goalsAway = m.score.fullTime.away ?? (isLive ? 0 : null);

    return {
      fixture: {
        id: m.id,
        referee: m.referees?.[0]?.name ?? null,
        timezone: "UTC",
        date: m.utcDate,
        timestamp: Math.floor(new Date(m.utcDate).getTime() / 1000),
        status,
      },
      league: {
        id: leagueId,
        name: m.competition.name,
        country: m.area.name,
        logo: m.competition.emblem || "",
        flag: m.area.flag || "",
        season: new Date().getFullYear(),
      },
      teams: {
        home: {
          id: m.homeTeam.id,
          name: m.homeTeam.shortName || m.homeTeam.name,
          logo: m.homeTeam.crest || "",
        },
        away: {
          id: m.awayTeam.id,
          name: m.awayTeam.shortName || m.awayTeam.name,
          logo: m.awayTeam.crest || "",
        },
      },
      goals: {
        home: goalsHome,
        away: goalsAway,
      },
      score: {
        halftime: { home: m.score.halfTime?.home ?? null, away: m.score.halfTime?.away ?? null },
        fulltime: { home: isFinished ? m.score.fullTime.home : null, away: isFinished ? m.score.fullTime.away : null },
        extratime: { home: m.score.extraTime?.home ?? null, away: m.score.extraTime?.away ?? null },
        penalty: { home: m.score.penalties?.home ?? null, away: m.score.penalties?.away ?? null },
      },
    };
  });
}

// ─── Transform football-data.org standings → our Standing[] format ───
interface FDStandingEntry {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

function transformStandings(table: FDStandingEntry[], competitionName: string, formMap: Map<number, string>) {
  return table.map((entry) => ({
    rank: entry.position,
    team: {
      id: entry.team.id,
      name: entry.team.shortName || entry.team.name,
      logo: entry.team.crest || "",
    },
    points: entry.points,
    goalsDiff: entry.goalDifference,
    group: competitionName,
    form: formMap.get(entry.team.id) || entry.form?.replace(/,/g, "") || "-----",
    status: "same",
    description: entry.position <= 4 ? "Champions League" : entry.position === 5 ? "Europa League" : null,
    all: {
      played: entry.playedGames,
      win: entry.won,
      draw: entry.draw,
      lose: entry.lost,
      goals: { for: entry.goalsFor, against: entry.goalsAgainst },
    },
  }));
}

async function computeFormFromMatches(competitionCode: string): Promise<Map<number, string>> {
  const formMap = new Map<number, string>();
  const data = await fetchFootballData(`/competitions/${competitionCode}/matches?status=FINISHED&limit=100`) as {
    matches?: Array<{
      homeTeam: { id: number };
      awayTeam: { id: number };
      score: { winner: string | null };
      utcDate: string;
    }>;
  } | null;

  if (!data?.matches) return formMap;

  const sortedMatches = [...data.matches].sort(
    (a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
  );

  const teamResults = new Map<number, string[]>();

  for (const match of sortedMatches) {
    const homeId = match.homeTeam.id;
    const awayId = match.awayTeam.id;

    if (!teamResults.has(homeId)) teamResults.set(homeId, []);
    if (!teamResults.has(awayId)) teamResults.set(awayId, []);

    const homeResults = teamResults.get(homeId)!;
    const awayResults = teamResults.get(awayId)!;

    if (homeResults.length < 5) {
      if (match.score.winner === "HOME_TEAM") homeResults.push("W");
      else if (match.score.winner === "AWAY_TEAM") homeResults.push("L");
      else homeResults.push("D");
    }

    if (awayResults.length < 5) {
      if (match.score.winner === "AWAY_TEAM") awayResults.push("W");
      else if (match.score.winner === "HOME_TEAM") awayResults.push("L");
      else awayResults.push("D");
    }
  }

  for (const [teamId, results] of teamResults) {
    formMap.set(teamId, results.join(""));
  }

  return formMap;
}

// ─── Transform football-data.org scorers → our PlayerStats[] format ───
interface FDScorer {
  player: {
    id: number;
    name: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    nationality: string;
    position: string | null;
    section?: string;
    shirtNumber: number | null;
    lastUpdated: string;
  };
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedMatches?: number;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

function transformScorers(scorers: FDScorer[], leagueCode: string) {
  return scorers.map((s) => ({
    player: {
      id: s.player.id,
      name: s.player.name,
      firstname: s.player.firstName || s.player.name.split(" ")[0],
      lastname: s.player.lastName || s.player.name.split(" ").slice(1).join(" "),
      age: s.player.dateOfBirth
        ? Math.floor((Date.now() - new Date(s.player.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0,
      nationality: s.player.nationality || "",
      // football-data.org doesn't provide player photos; use a fallback
      photo: "",
    },
    statistics: [
      {
        team: {
          id: s.team.id,
          name: s.team.shortName || s.team.name,
          logo: s.team.crest || "",
        },
        league: {
          id: 39,
          name: leagueCode === "PL" ? "Premier League" : leagueCode,
          country: "",
          logo: "",
          flag: "",
          season: new Date().getFullYear(),
        },
        games: {
          appearences: s.playedMatches ?? 0,
          minutes: 0,
          position: s.player.position || "Attacker",
          rating: null,
        },
        goals: {
          total: s.goals,
          assists: s.assists ?? 0,
        },
        cards: {
          yellow: 0,
          red: 0,
        },
      },
    ],
  }));
}

// ─── Fetch real news via Google News RSS for Korean football ───
async function fetchKoreanFootballNews(): Promise<unknown[]> {
  try {
    const query = encodeURIComponent("축구");
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`;

    const res = await fetch(rssUrl, {
      next: { revalidate: 600 }, // cache 10 minutes
    });

    if (!res.ok) return [];

    const xml = await res.text();

    // Parse RSS XML items
    const items: unknown[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let idx = 0;

    while ((match = itemRegex.exec(xml)) !== null && idx < 10) {
      const itemXml = match[1];

      const title = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
        || itemXml.match(/<title>(.*?)<\/title>/)?.[1]
        || "";
      const linkMatch = itemXml.match(/<link\/?>\s*(https?:\/\/[^\s<]+)/)
        || itemXml.match(/<link>(https?:\/\/[^<]+)<\/link>/);
      const link = linkMatch?.[1] || "#";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const source = itemXml.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || "Google News";
      const description = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || title;

      // Clean HTML from description
      const cleanDesc = description.replace(/<[^>]+>/g, "").trim();

      // Determine category from keywords
      let category: "transfer" | "match" | "injury" | "general" = "general";
      if (/이적|영입|계약|연봉|방출/.test(title)) category = "transfer";
      else if (/골|승|패|경기|리그|승부|하이라이트|스코어|결과/.test(title)) category = "match";
      else if (/부상|복귀|수술|결장/.test(title)) category = "injury";

      items.push({
        id: `news-${idx}`,
        title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
        description: cleanDesc.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").substring(0, 200),
        source,
        url: link,
        image: "",
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category,
      });
      idx++;
    }

    return items.length > 0 ? items : [];
  } catch (err) {
    console.error("News fetch error:", err);
    return [];
  }
}

// ─── Build predictions from upcoming real fixtures ───
function buildPredictions(matches: ReturnType<typeof transformMatches>) {
  const upcoming = matches
    .filter((m) => m.fixture.status.short === "NS")
    .slice(0, 5);

  return upcoming.map((m, idx) => ({
    id: `pred-${m.fixture.id}`,
    matchId: m.fixture.id,
    homeTeam: m.teams.home.name,
    awayTeam: m.teams.away.name,
    homeTeamLogo: m.teams.home.logo,
    awayTeamLogo: m.teams.away.logo,
    kickoff: m.fixture.date,
    userPrediction: null,
    result: null,
    points: 0,
    league: m.league.name,
  }));
}

// ─── Main handler ───
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  switch (type) {
    case "live":
    case "fixtures": {
      if (API_KEY) {
        // Fetch today's matches across all free-tier competitions
        const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
        const data = await fetchFootballData(`/matches?date=${date}`) as { matches?: FDMatch[] } | null;

        if (data?.matches) {
          const transformed = transformMatches(data.matches);
          return NextResponse.json({ response: transformed });
        }
      }
      return NextResponse.json({ response: MOCK_MATCHES });
    }

    case "standings": {
      const leagueId = searchParams.get("league") || "39";
      const code = LEAGUE_CODES[leagueId] || "PL";

      if (API_KEY) {
        const data = await fetchFootballData(`/competitions/${code}/standings`) as {
          competition?: { name: string };
          standings?: Array<{ type: string; table: FDStandingEntry[] }>;
        } | null;
        if (data?.standings) {
          const totalStanding = data.standings.find((s) => s.type === "TOTAL");
          if (totalStanding) {
            const competitionName = data.competition?.name || code;
            const formMap = await computeFormFromMatches(code);
            const transformed = transformStandings(totalStanding.table, competitionName, formMap);
            return NextResponse.json({
              response: [{ league: { standings: [transformed] } }],
            });
          }
        }
      }
      return NextResponse.json({ response: [{ league: { standings: [MOCK_STANDINGS] } }] });
    }

    case "topscorers": {
      const leagueId = searchParams.get("league") || "39";
      const code = LEAGUE_CODES[leagueId] || "PL";

      if (API_KEY) {
        const data = await fetchFootballData(`/competitions/${code}/scorers?limit=10`) as {
          scorers?: FDScorer[];
        } | null;

        if (data?.scorers) {
          const transformed = transformScorers(data.scorers, code);
          return NextResponse.json({ response: transformed });
        }
      }
      return NextResponse.json({ response: MOCK_TOP_SCORERS });
    }

    case "news": {
      if (API_KEY) {
        const news = await fetchKoreanFootballNews();
        if (news.length > 0) {
          return NextResponse.json({ response: news });
        }
      }
      // Even without API key, try to fetch real news
      const newsItems = await fetchKoreanFootballNews();
      if (newsItems.length > 0) {
        return NextResponse.json({ response: newsItems });
      }
      return NextResponse.json({ response: MOCK_NEWS });
    }

    case "predictions": {
      if (API_KEY) {
        // Get upcoming matches to create prediction cards
        const today = new Date().toISOString().split("T")[0];
        const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];

        const data = await fetchFootballData(
          `/matches?dateFrom=${today}&dateTo=${dayAfter}`
        ) as { matches?: FDMatch[] } | null;

        if (data?.matches) {
          const transformed = transformMatches(data.matches);
          const predictions = buildPredictions(transformed);
          if (predictions.length > 0) {
            return NextResponse.json({ response: predictions });
          }
        }
      }
      return NextResponse.json({ response: MOCK_PREDICTIONS });
    }

    case "profile":
      return NextResponse.json({ response: MOCK_USER_PROFILE });

    default:
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }
}
