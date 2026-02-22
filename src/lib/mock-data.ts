// Mock data for demo (replace with real API calls when API key is configured)

import { Match, Standing, PlayerStats, NewsItem, Prediction, UserProfile } from "@/types/football";

const now = new Date();
const today = now.toISOString().split("T")[0];

export const MOCK_MATCHES: Match[] = [
  {
    fixture: { id: 1001, referee: "Michael Oliver", timezone: "UTC", date: `${today}T15:00:00+00:00`, timestamp: Math.floor(now.getTime() / 1000), status: { long: "Second Half", short: "2H", elapsed: 67 } },
    league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://flagcdn.com/gb-eng.svg", season: 2025 },
    teams: { home: { id: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" }, away: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" } },
    goals: { home: 2, away: 1 },
    score: { halftime: { home: 1, away: 1 }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
  },
  {
    fixture: { id: 1002, referee: "Anthony Taylor", timezone: "UTC", date: `${today}T17:30:00+00:00`, timestamp: Math.floor(now.getTime() / 1000) + 3600, status: { long: "First Half", short: "1H", elapsed: 23 } },
    league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://flagcdn.com/gb-eng.svg", season: 2025 },
    teams: { home: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" }, away: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" } },
    goals: { home: 0, away: 1 },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
  },
  {
    fixture: { id: 1003, referee: null, timezone: "UTC", date: `${today}T20:00:00+00:00`, timestamp: Math.floor(now.getTime() / 1000) + 7200, status: { long: "Not Started", short: "NS", elapsed: null } },
    league: { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "https://flagcdn.com/es.svg", season: 2025 },
    teams: { home: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" }, away: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
  },
  {
    fixture: { id: 1004, referee: "Felix Brych", timezone: "UTC", date: `${today}T19:00:00+00:00`, timestamp: Math.floor(now.getTime() / 1000) + 5400, status: { long: "Match Finished", short: "FT", elapsed: 90 } },
    league: { id: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", flag: "https://flagcdn.com/de.svg", season: 2025 },
    teams: { home: { id: 157, name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" }, away: { id: 165, name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" } },
    goals: { home: 3, away: 2 },
    score: { halftime: { home: 2, away: 1 }, fulltime: { home: 3, away: 2 }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
  },
  {
    fixture: { id: 1005, referee: null, timezone: "UTC", date: `${today}T12:00:00+00:00`, timestamp: Math.floor(now.getTime() / 1000) - 3600, status: { long: "First Half", short: "1H", elapsed: 35 } },
    league: { id: 292, name: "K League 1", country: "South Korea", logo: "https://media.api-sports.io/football/leagues/292.png", flag: "https://flagcdn.com/kr.svg", season: 2025 },
    teams: { home: { id: 2761, name: "Jeonbuk Motors", logo: "https://media.api-sports.io/football/teams/2761.png" }, away: { id: 2763, name: "Ulsan HD", logo: "https://media.api-sports.io/football/teams/2763.png" } },
    goals: { home: 1, away: 0 },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
  },
  {
    fixture: { id: 1006, referee: "Clement Turpin", timezone: "UTC", date: `${today}T20:00:00+00:00`, timestamp: Math.floor(now.getTime() / 1000) + 9000, status: { long: "Not Started", short: "NS", elapsed: null } },
    league: { id: 2, name: "Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: "", season: 2025 },
    teams: { home: { id: 85, name: "Paris Saint Germain", logo: "https://media.api-sports.io/football/teams/85.png" }, away: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
  },
];

export const MOCK_STANDINGS: Standing[] = [
  { rank: 1, team: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" }, points: 71, goalsDiff: 42, group: "Premier League", form: "WWDWW", status: "same", description: "Champions League", all: { played: 30, win: 22, draw: 5, lose: 3, goals: { for: 68, against: 26 } } },
  { rank: 2, team: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" }, points: 69, goalsDiff: 38, group: "Premier League", form: "WWWDL", status: "same", description: "Champions League", all: { played: 30, win: 21, draw: 6, lose: 3, goals: { for: 65, against: 27 } } },
  { rank: 3, team: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" }, points: 64, goalsDiff: 31, group: "Premier League", form: "WLWWW", status: "same", description: "Champions League", all: { played: 30, win: 19, draw: 7, lose: 4, goals: { for: 62, against: 31 } } },
  { rank: 4, team: { id: 49, name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" }, points: 56, goalsDiff: 18, group: "Premier League", form: "DWWLW", status: "same", description: "Champions League", all: { played: 30, win: 16, draw: 8, lose: 6, goals: { for: 55, against: 37 } } },
  { rank: 5, team: { id: 66, name: "Aston Villa", logo: "https://media.api-sports.io/football/teams/66.png" }, points: 52, goalsDiff: 12, group: "Premier League", form: "WDLWW", status: "same", description: "Europa League", all: { played: 30, win: 15, draw: 7, lose: 8, goals: { for: 51, against: 39 } } },
  { rank: 6, team: { id: 47, name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" }, points: 49, goalsDiff: 8, group: "Premier League", form: "LWDWL", status: "same", description: "Europa Conference League", all: { played: 30, win: 14, draw: 7, lose: 9, goals: { for: 50, against: 42 } } },
  { rank: 7, team: { id: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" }, points: 46, goalsDiff: 3, group: "Premier League", form: "WLWDL", status: "same", description: null, all: { played: 30, win: 13, draw: 7, lose: 10, goals: { for: 42, against: 39 } } },
  { rank: 8, team: { id: 34, name: "Newcastle", logo: "https://media.api-sports.io/football/teams/34.png" }, points: 44, goalsDiff: 5, group: "Premier League", form: "DLWWL", status: "same", description: null, all: { played: 30, win: 12, draw: 8, lose: 10, goals: { for: 44, against: 39 } } },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: "n1", title: "손흥민, 시즌 15호골 폭발! 토트넘 승리 이끌어", description: "토트넘의 손흥민이 울버햄프턴전에서 멀티골을 기록하며 팀의 3-1 승리를 이끌었다.", source: "스포츠뉴스", url: "#", image: "/api/placeholder/400/200", publishedAt: new Date(Date.now() - 3600000).toISOString(), category: "match" },
  { id: "n2", title: "이강인, PSG 주전 굳히기 성공... 시즌 7어시스트", description: "파리 생제르맹의 이강인이 리그앙 경기에서 결승골 어시스트를 기록했다.", source: "축구매거진", url: "#", image: "/api/placeholder/400/200", publishedAt: new Date(Date.now() - 7200000).toISOString(), category: "match" },
  { id: "n3", title: "김민재, 바이에른 뮌헨과 재계약 합의 임박", description: "김민재가 바이에른 뮌헨과 2028년까지 연장 계약에 합의할 것으로 전해졌다.", source: "이적시장", url: "#", image: "/api/placeholder/400/200", publishedAt: new Date(Date.now() - 14400000).toISOString(), category: "transfer" },
  { id: "n4", title: "EPL 이적시장: 하란드 연봉 역대 최고 기록 경신", description: "맨시티의 엘링 하란드가 주급 50만 파운드로 재계약하며 EPL 역대 최고 연봉을 기록했다.", source: "프리미어리그뉴스", url: "#", image: "/api/placeholder/400/200", publishedAt: new Date(Date.now() - 21600000).toISOString(), category: "transfer" },
  { id: "n5", title: "황희찬 부상 복귀, 울버햄프턴 스쿼드 합류", description: "울버햄프턴의 황희찬이 3주간의 부상에서 복귀하여 팀 훈련에 합류했다.", source: "K-플레이어", url: "#", image: "/api/placeholder/400/200", publishedAt: new Date(Date.now() - 28800000).toISOString(), category: "injury" },
  { id: "n6", title: "K리그: 전북, 울산과의 빅매치 앞두고 전력 점검", description: "K리그1 선두 경쟁 중인 전북 현대가 울산 현대와의 빅매치를 앞두고 있다.", source: "K리그 공식", url: "#", image: "/api/placeholder/400/200", publishedAt: new Date(Date.now() - 36000000).toISOString(), category: "general" },
];

export const MOCK_PREDICTIONS: Prediction[] = [
  { id: "p1", matchId: 1003, homeTeam: "Real Madrid", awayTeam: "Barcelona", homeTeamLogo: "https://media.api-sports.io/football/teams/541.png", awayTeamLogo: "https://media.api-sports.io/football/teams/529.png", kickoff: `${today}T20:00:00+00:00`, userPrediction: null, result: null, points: 0, league: "La Liga" },
  { id: "p2", matchId: 1006, homeTeam: "Paris Saint Germain", awayTeam: "Manchester City", homeTeamLogo: "https://media.api-sports.io/football/teams/85.png", awayTeamLogo: "https://media.api-sports.io/football/teams/50.png", kickoff: `${today}T20:00:00+00:00`, userPrediction: null, result: null, points: 0, league: "Champions League" },
  { id: "p3", matchId: 1004, homeTeam: "Bayern Munich", awayTeam: "Borussia Dortmund", homeTeamLogo: "https://media.api-sports.io/football/teams/157.png", awayTeamLogo: "https://media.api-sports.io/football/teams/165.png", kickoff: `${today}T19:00:00+00:00`, userPrediction: "home", result: "home", points: 10, league: "Bundesliga" },
];

export const MOCK_USER_PROFILE: UserProfile = {
  level: 5,
  points: 1250,
  totalPredictions: 48,
  correctPredictions: 22,
  streak: 3,
  badges: [
    { id: "b1", name: "첫 예측", icon: "🎯", description: "첫 번째 예측을 완료했습니다!", unlockedAt: "2025-01-15T00:00:00Z" },
    { id: "b2", name: "연속 3회", icon: "🔥", description: "3연속 정답을 맞혔습니다!", unlockedAt: "2025-02-01T00:00:00Z" },
    { id: "b3", name: "EPL 전문가", icon: "🏆", description: "EPL 경기 10회 연속 정답", unlockedAt: null },
    { id: "b4", name: "글로벌 팬", icon: "🌍", description: "5개 이상 리그 경기를 예측했습니다!", unlockedAt: "2025-02-10T00:00:00Z" },
  ],
};

export const MOCK_TOP_SCORERS: PlayerStats[] = [
  {
    player: { id: 1100, name: "Erling Haaland", firstname: "Erling", lastname: "Haaland", age: 24, nationality: "Norway", photo: "https://media.api-sports.io/football/players/1100.png" },
    statistics: [{ team: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" }, league: { id: 39, name: "Premier League", country: "England", logo: "", flag: "", season: 2025 }, games: { appearences: 28, minutes: 2420, position: "Attacker", rating: "7.8" }, goals: { total: 24, assists: 5 }, cards: { yellow: 3, red: 0 } }],
  },
  {
    player: { id: 1460, name: "Mohamed Salah", firstname: "Mohamed", lastname: "Salah", age: 32, nationality: "Egypt", photo: "https://media.api-sports.io/football/players/1460.png" },
    statistics: [{ team: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" }, league: { id: 39, name: "Premier League", country: "England", logo: "", flag: "", season: 2025 }, games: { appearences: 30, minutes: 2650, position: "Attacker", rating: "7.6" }, goals: { total: 19, assists: 11 }, cards: { yellow: 1, red: 0 } }],
  },
  {
    player: { id: 186, name: "Son Heung-Min", firstname: "Heung-Min", lastname: "Son", age: 32, nationality: "South Korea", photo: "https://media.api-sports.io/football/players/186.png" },
    statistics: [{ team: { id: 47, name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" }, league: { id: 39, name: "Premier League", country: "England", logo: "", flag: "", season: 2025 }, games: { appearences: 29, minutes: 2500, position: "Attacker", rating: "7.4" }, goals: { total: 15, assists: 8 }, cards: { yellow: 2, red: 0 } }],
  },
  {
    player: { id: 874, name: "Bukayo Saka", firstname: "Bukayo", lastname: "Saka", age: 23, nationality: "England", photo: "https://media.api-sports.io/football/players/874.png" },
    statistics: [{ team: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" }, league: { id: 39, name: "Premier League", country: "England", logo: "", flag: "", season: 2025 }, games: { appearences: 28, minutes: 2380, position: "Attacker", rating: "7.5" }, goals: { total: 14, assists: 10 }, cards: { yellow: 4, red: 0 } }],
  },
  {
    player: { id: 1485, name: "Cole Palmer", firstname: "Cole", lastname: "Palmer", age: 22, nationality: "England", photo: "https://media.api-sports.io/football/players/1485.png" },
    statistics: [{ team: { id: 49, name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" }, league: { id: 39, name: "Premier League", country: "England", logo: "", flag: "", season: 2025 }, games: { appearences: 27, minutes: 2300, position: "Midfielder", rating: "7.7" }, goals: { total: 18, assists: 9 }, cards: { yellow: 2, red: 0 } }],
  },
];
