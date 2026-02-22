// API route for football data (proxy to API-Football or return mock data)

import { NextRequest, NextResponse } from "next/server";
import { MOCK_MATCHES, MOCK_STANDINGS, MOCK_NEWS, MOCK_PREDICTIONS, MOCK_USER_PROFILE, MOCK_TOP_SCORERS } from "@/lib/mock-data";

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_HOST = "v3.football.api-sports.io";

async function fetchFromAPI(endpoint: string, params: Record<string, string>) {
  if (!API_KEY) return null;

  const url = new URL(`https://${API_HOST}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": API_KEY,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  switch (type) {
    case "live":
    case "fixtures": {
      if (API_KEY) {
        const data = await fetchFromAPI("/fixtures", {
          live: type === "live" ? "all" : "",
          date: searchParams.get("date") || new Date().toISOString().split("T")[0],
        });
        if (data) return NextResponse.json(data);
      }
      return NextResponse.json({ response: MOCK_MATCHES });
    }

    case "standings": {
      const leagueId = searchParams.get("league") || "39";
      if (API_KEY) {
        const data = await fetchFromAPI("/standings", { league: leagueId, season: "2025" });
        if (data) return NextResponse.json(data);
      }
      return NextResponse.json({ response: [{ league: { standings: [MOCK_STANDINGS] } }] });
    }

    case "topscorers": {
      if (API_KEY) {
        const data = await fetchFromAPI("/players/topscorers", {
          league: searchParams.get("league") || "39",
          season: "2025",
        });
        if (data) return NextResponse.json(data);
      }
      return NextResponse.json({ response: MOCK_TOP_SCORERS });
    }

    case "news":
      return NextResponse.json({ response: MOCK_NEWS });

    case "predictions":
      return NextResponse.json({ response: MOCK_PREDICTIONS });

    case "profile":
      return NextResponse.json({ response: MOCK_USER_PROFILE });

    default:
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }
}
