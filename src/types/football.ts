// Football API types

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface FixtureStatus {
  long: string;
  short: string;
  elapsed: number | null;
}

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  status: FixtureStatus;
}

export interface Match {
  fixture: Fixture;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: {
    halftime: Goals;
    fulltime: Goals;
    extratime: Goals;
    penalty: Goals;
  };
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

export interface PlayerStats {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    nationality: string;
    photo: string;
  };
  statistics: Array<{
    team: Team;
    league: League;
    games: {
      appearences: number;
      minutes: number;
      position: string;
      rating: string | null;
    };
    goals: {
      total: number | null;
      assists: number | null;
    };
    cards: {
      yellow: number;
      red: number;
    };
  }>;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  image: string;
  publishedAt: string;
  category: "transfer" | "match" | "injury" | "general";
}

// Prediction / Quiz system
export interface Prediction {
  id: string;
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  kickoff: string;
  userPrediction: "home" | "draw" | "away" | null;
  result: "home" | "draw" | "away" | null;
  points: number;
  league: string;
}

export interface UserProfile {
  level: number;
  points: number;
  totalPredictions: number;
  correctPredictions: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string | null;
}

// League configuration
export interface LeagueConfig {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
}

export const LEAGUES: LeagueConfig[] = [
  { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://flagcdn.com/gb-eng.svg" },
  { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "https://flagcdn.com/es.svg" },
  { id: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", flag: "https://flagcdn.com/it.svg" },
  { id: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", flag: "https://flagcdn.com/de.svg" },
  { id: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", flag: "https://flagcdn.com/fr.svg" },
  { id: 292, name: "K League 1", country: "South Korea", logo: "https://media.api-sports.io/football/leagues/292.png", flag: "https://flagcdn.com/kr.svg" },
  { id: 2, name: "Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: "" },
  { id: 3, name: "Europa League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/3.png", flag: "" },
];

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000
];

export function getLevelFromPoints(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getNextLevelProgress(points: number): { current: number; next: number; progress: number } {
  const level = getLevelFromPoints(points);
  const current = LEVEL_THRESHOLDS[level - 1] || 0;
  const next = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = Math.min(((points - current) / (next - current)) * 100, 100);
  return { current, next, progress };
}
