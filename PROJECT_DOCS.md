# GoalKick (골킥) - 프로젝트 문서

## 프로젝트 개요

**프로젝트명:** GoalKick (골킥)

**설명:** 실시간 축구 라이브 허브 PWA (Progressive Web App)

**라이브 URL:** https://football-hub-two.vercel.app

**GitHub 저장소:** https://github.com/Hwemo-Chung/goalkick

**기술 스택:**
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- Vercel (배포 플랫폼)

---

## 주요 기능

### 1. 실시간 라이브 스코어
- football-data.org API를 통한 실시간 경기 스코어 제공
- 홈 페이지에서 진행 중인 모든 경기의 현재 스코어 표시
- 경기 상태 (Not Started, First Half, Halftime, Second Half, Extra Time, Finished 등) 표시

### 2. 리그 순위표
7개 주요 축구 리그의 최신 순위 정보 제공:
- 잉글랜드 프리미어 리그 (EPL, 리그 ID: 39)
- 스페인 라리가 (La Liga, 리그 ID: 140)
- 이탈리아 세리에A (Serie A, 리그 ID: 135)
- 독일 분데스리가 (Bundesliga, 리그 ID: 78)
- 프랑스 리그1 (Ligue 1, 리그 ID: 61)
- 유럽 챔피언스리그 (UCL, 리그 ID: 2)
- 유럽 유로파리그 (UEL, 리그 ID: 3)

각 리그의 순위표는 다음 정보를 표시:
- 팀 순위 및 팀 로고
- 경기수, 승/무/패 기록
- 포인트 및 골 득실 정보
- 최근 5경기 폼 (W/D/L 표시)

### 3. 득점 순위
- 선택한 리그의 상위 10명 득점 선수 표시
- 선수 이름, 팀, 골 수, 어시스트 정보 제공
- 선수 사진이 없는 경우 이니셜 그래디언트 아바타로 대체

### 4. 한국어 축구 뉴스
- Google News RSS 피드를 통한 한국어 축구 뉴스 자동 파싱
- 뉴스 카테고리 자동 분류: 이적, 경기 결과, 부상, 일반
- 10분 캐시로 최신 뉴스 제공

### 5. 경기 예측 시스템
- 예정된 경기에 대한 사용자 예측 (승리, 무승부, 패배)
- 경기 결과 후 예측 정확성에 따른 포인트 획득
- 포인트 누적으로 레벨 업 시스템

### 6. 사용자 프로필
- 사용자별 레벨 및 포인트 표시
- 예측 기록 (총 예측 수, 정확 예측 수)
- 현재 예측 연승 스트릭 표시
- 배지 시스템 (미래 확장 기능)

### 7. PWA 지원
- 오프라인 모드에서도 캐시된 콘텐츠 접근 가능
- 홈 화면에 앱 추가 기능 지원
- 네이티브 앱 같은 standalone 디스플레이 모드
- 다크 테마 기본 적용

### 8. Google AdSense 광고 통합
- Publisher ID: ca-pub-3498371918924514
- 배너, 리더보드, 직사각형 광고 크기 지원
- AdSlot 컴포넌트로 페이지 내 광고 배치
- 자동 AdSense 스크립트 로드

### 9. 자체 광고 배너
- SelfAdBanner 컴포넌트로 프로모션 콘텐츠 표시
- 프로젝트 관련 광고 공간

---

## 프로젝트 구조

```
football-hub/
├── next.config.ts                  # Next.js 설정
│                                     # 이미지 도메인 허용:
│                                     # - media.api-sports.io
│                                     # - **.api-football.com
│                                     # - flagcdn.com
│                                     # - crests.football-data.org
│                                     # - upload.wikimedia.org
├── .env.local                       # 환경변수 (FOOTBALL_DATA_API_KEY)
├── .env.example                     # 환경변수 템플릿
├── tsconfig.json                    # TypeScript 설정
├── package.json                     # npm 의존성 및 스크립트
├── postcss.config.mjs               # PostCSS 설정 (Tailwind)
├── eslint.config.mjs                # ESLint 설정
│
├── public/
│   ├── manifest.json                # PWA 매니페스트
│   │                                 # - 앱명: GoalKick - 축구 라이브 허브
│   │                                 # - 테마 색상: #10b981 (에메랄드)
│   │                                 # - 배경색: #0f172a (다크 블루)
│   │                                 # - 언어: 한국어 (ko)
│   ├── sw.js                        # 서비스 워커 (v2)
│   │                                 # - 캐시 이름: goalkick-v2
│   │                                 # - 전략: Network-first for pages/API
│   │                                 # - Cache-first for static assets
│   └── icons/
│       ├── icon-192.png             # PWA 홈 화면 아이콘 (192x192)
│       └── icon-512.png             # PWA 스플래시 화면 아이콘 (512x512)
│
├── src/
│   ├── types/
│   │   └── football.ts              # TypeScript 타입 정의 및 설정
│   │                                 # - Match, Standing, PlayerStats 등 인터페이스
│   │                                 # - LEAGUES: 7개 리그 설정
│   │                                 # - LEVEL_THRESHOLDS: 레벨별 포인트 임계값
│   │                                 #   [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000]
│   │                                 # - getLevelFromPoints(), getNextLevelProgress() 유틸
│   │
│   ├── lib/
│   │   └── mock-data.ts             # 목(mock) 데이터 폴백
│   │                                 # - MOCK_MATCHES, MOCK_STANDINGS, MOCK_NEWS
│   │                                 # - MOCK_TOP_SCORERS, MOCK_PREDICTIONS
│   │                                 # - MOCK_USER_PROFILE
│   │                                 # (API 호출 실패 시 사용)
│   │
│   ├── app/
│   │   ├── layout.tsx               # 공통 레이아웃
│   │   │                             # - Header 컴포넌트 (상단 내비게이션)
│   │   │                             # - BottomNav 컴포넌트 (하단 탭 메뉴)
│   │   │                             # - AdSlot 컴포넌트 (광고 영역)
│   │   │                             # - AdSense 스크립트 로드
│   │   │                             # - PWA manifest, 서비스 워커 등록
│   │   │
│   │   ├── globals.css              # 전역 스타일
│   │   │                             # - 다크 테마 CSS 변수 정의
│   │   │                             # - form-dot (폼 요소 점) 스타일
│   │   │                             # - league-tab (리그 선택 탭) 스타일
│   │   │                             # - 폰트, 스크롤바 스타일
│   │   │
│   │   ├── page.tsx                 # 홈 페이지
│   │   │                             # - 라이브 스코어 표시 (LiveScores 컴포넌트)
│   │   │                             # - 하루 전체 경기 요약
│   │   │
│   │   ├── news/
│   │   │   └── page.tsx             # 뉴스 페이지
│   │   │                             # - NewsFeed 컴포넌트
│   │   │                             # - 카테고리별 뉴스 필터링
│   │   │
│   │   ├── predictions/
│   │   │   └── page.tsx             # 경기 예측 페이지
│   │   │                             # - PredictionSection 컴포넌트
│   │   │                             # - 예정된 경기 카드, 예측 입력
│   │   │
│   │   ├── standings/
│   │   │   └── page.tsx             # 순위표 페이지
│   │   │                             # - StandingsStats 컴포넌트
│   │   │                             # - 리그 선택 탭
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx             # 사용자 프로필 페이지
│   │   │                             # - ProfileSection 컴포넌트
│   │   │                             # - 레벨, 포인트, 배지 표시
│   │   │
│   │   └── api/
│   │       └── football/
│   │           └── route.ts         # API 라우트 (백엔드)
│   │                                 # - Type: live, standings, topscorers, news, predictions, profile
│   │                                 # - football-data.org v4 API 호출
│   │                                 # - Google News RSS 파싱
│   │                                 # - 인메모리 캐싱 (2분 API, 10분 뉴스)
│   │
│   └── components/
│       ├── Header.tsx               # 상단 헤더 (로고, 앱 제목)
│       ├── BottomNav.tsx            # 하단 5개 탭 네비게이션
│       │                             # - 홈, 뉴스, 순위, 예측, 프로필
│       ├── LiveScores.tsx           # 라이브 스코어 섹션
│       │                             # - 실시간 경기 카드 표시
│       │
│       ├── NewsFeed.tsx             # 뉴스 피드
│       │                             # - 뉴스 아이템 렌더링
│       │                             # - 카테고리 배지
│       │
│       ├── PredictionSection.tsx    # 경기 예측 섹션
│       │                             # - 예측 입력 UI
│       │                             # - 포인트 계산 로직
│       │
│       ├── StandingsStats.tsx       # 순위표 통계
│       │                             # - 리그별 테이블
│       │                             # - 팀 폼, 포인트 등
│       │
│       ├── ProfileSection.tsx       # 사용자 프로필
│       │                             # - 레벨 프로그레스 바
│       │                             # - 포인트 및 통계
│       │
│       ├── AdSlot.tsx               # AdSense 광고 슬롯
│       │                             # - ins 태그 렌더링
│       │                             # - adsbygoogle.push() 호출
│       │
│       └── SelfAdBanner.tsx         # 자체 프로모션 배너
│                                     # - 내부 광고 콘텐츠
│
├── .git/                            # Git 저장소 (선택사항)
├── .next/                           # Next.js 빌드 출력 (자동 생성)
├── .vercel/                         # Vercel 배포 설정 (자동 생성)
└── node_modules/                    # npm 패키지 (자동 생성)
```

---

## API 연동

### football-data.org v4 API

**API 키 관리:**
- 환경변수 `FOOTBALL_DATA_API_KEY`로 관리
- `.env.local` 파일에 저장 (버전 관리에서 제외)
- Vercel 배포 시 Vercel 프로젝트 설정에서 환경변수 설정

**API 엔드포인트:**
- 기본 URL: `https://api.football-data.org/v4`
- `/api/football?type=live` — 라이브 경기
- `/api/football?type=standings&league=39` — 순위표 (리그 ID 지정)
- `/api/football?type=topscorers&league=39` — 득점 순위
- `/api/football?type=predictions` — 경기 예측 (예정 경기)
- `/api/football?type=news` — 한국어 뉴스

**리그 코드 매핑 (LEAGUE_CODES):**
```
39  → PL    (Premier League)
140 → PD    (La Liga)
135 → SA    (Serie A)
78  → BL1   (Bundesliga)
61  → FL1   (Ligue 1)
2   → CL    (Champions League)
3   → EL    (Europa League)
```

**캐싱 전략:**
- API 응답: 2분 (120초) 인메모리 캐시
- 뉴스 피드: 10분 (600초) 캐시
- 서비스 워커: network-first 전략으로 최신 데이터 우선

**무료 티어 제한사항:**
- 요청 제한: 분당 10개 요청 (10 requests/min)
- K리그 데이터: 무료 티어에서 지원되지 않음 (리그 ID 292는 유료)
- 선수 사진: football-data.org에서 제공하지 않음 (이니셜 아바타로 대체)

### Google News RSS

**뉴스 소스:**
- Google News RSS 피드 (한국어, 축구 키워드)
- URL: `https://news.google.com/rss/search?q=축구&hl=ko&gl=KR&ceid=KR:ko`
- 캐시: 10분

**뉴스 카테고리 자동 분류:**
- Transfer (이적, 영입, 계약, 방출)
- Match (골, 승, 패, 경기, 리그, 승부, 스코어, 결과)
- Injury (부상, 복귀, 수술, 결장)
- General (그 외)

**데이터 처리:**
- XML 파싱으로 항목 추출
- HTML 엔티티 디코딩 및 태그 제거
- 최대 10개 뉴스 아이템 반환

---

## 배포 정보

### Vercel

**배포 플랫폼:** Vercel

**프로젝트 정보:**
- Organization: teagardenearlgrey-5116s-projects
- Project Name: football-hub
- Domain: https://football-hub-two.vercel.app

**배포 명령어:**
```bash
vercel deploy --prod --yes
```

**환경변수 설정:**
- Vercel 대시보드 → Settings → Environment Variables
- 변수명: `FOOTBALL_DATA_API_KEY`
- 값: football-data.org API 키 (프로젝트 소유자가 관리)

**배포 프로세스:**
1. GitHub에 커밋 푸시
2. Vercel이 자동으로 감지 (GitHub 연결 활성화 시)
3. 프리뷰 배포 (PR) 또는 프로덕션 배포 (main)
4. Next.js 빌드 실행 → 배포 완료

---

## 서비스 워커 (PWA)

### 파일 위치
`public/sw.js`

### 캐시 설정

**캐시 이름:** `goalkick-v2`

**사전 캐시(Precache) 목록:**
```
/
/manifest.json
/icons/icon-192.png
/icons/icon-512.png
```

### 캐싱 전략

1. **API 요청** (`/api/*`)
   - Network-first, cache fallback
   - 네트워크 응답을 캐시에 저장 (성공 시)

2. **페이지 네비게이션** (`event.request.mode === "navigate"`)
   - Network-first, cache fallback
   - 항상 최신 페이지 콘텐츠 제공

3. **정적 자산** (JS, CSS, 이미지 등)
   - Cache-first, network fallback
   - 오프라인 모드에서 캐시된 버전 제공

### 특수 처리

- **비-HTTP 요청 필터링:** `chrome-extension://` 등 비-HTTP 스킴 무시
- **GET 요청만 처리:** POST, PUT 등 다른 메서드는 우회
- **캐시 업그레이드:** Install 이벤트에서 구 캐시 자동 삭제
  - `CACHE_NAME` 변경 시 이전 버전 캐시 자동 제거

### 서비스 워커 갱신

1. `public/sw.js` 수정 후 배포
2. 또는 `CACHE_NAME` 버전 변경 (예: `goalkick-v3`)
3. 사용자 방문 시 새 서비스 워커 설치 및 활성화

---

## 수익화

### Google AdSense

**Publisher ID:** `ca-pub-3498371918924514`

**통합 방식:**
- `src/components/AdSlot.tsx` 컴포넌트로 광고 배치
- `src/app/layout.tsx`에서 AdSense 스크립트 자동 로드
- `<ins>` 태그 렌더링 후 `adsbygoogle.push({})` 호출

**지원 광고 크기:**
- 배너 (320x50, 728x90)
- 리더보드 (728x90)
- 직사각형 (300x250, 336x280)

**광고 표시 조건:**
- Google AdSense 사이트 심사 승인 필요
- 승인 전까지는 광고 미표시 (Preview 모드)
- 심사 승인 후 자동으로 실제 광고 표시

### SelfAdBanner

`src/components/SelfAdBanner.tsx`로 자체 프로모션 콘텐츠 표시 가능

---

## 레벨/포인트 시스템

### 레벨 임계값 (LEVEL_THRESHOLDS)

```typescript
[0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000]
```

각 레벨의 시작점:
- Level 1: 0 포인트
- Level 2: 100 포인트
- Level 3: 300 포인트
- Level 4: 600 포인트
- Level 5: 1,000 포인트
- Level 6: 1,500 포인트
- Level 7: 2,200 포인트
- Level 8: 3,000 포인트
- Level 9: 4,000 포인트
- Level 10: 5,500 포인트
- Level 11: 7,500 포인트
- Level 12: 10,000 포인트

### 포인트 획득

- 경기 예측 성공 시 포인트 획득
- 예측 정확성: 정답 예측(승리/무승부/패배)에 대해 포인트 부여

### 유틸 함수

**`getLevelFromPoints(points: number): number`**
- 현재 포인트에 해당하는 레벨 반환

**`getNextLevelProgress(points: number): { current: number; next: number; progress: number }`**
- 현재 레벨의 시작점, 다음 레벨의 시작점, 진행률(%) 반환
- 프로필 페이지에서 레벨 프로그레스 바 표시

### 현재 제한사항

- 포인트/레벨 시스템: 로컬 상태 (브라우저 localStorage 또는 메모리)
- 서버 DB 미연동: 새 장치에서는 데이터 초기화됨
- 향후 확장: 사용자 계정 및 DB 연동으로 영구 저장 가능

---

## 개발 가이드

### 로컬 개발

**설치:**
```bash
npm install
```

**개발 서버 실행:**
```bash
npm run dev
```
- 로컬 주소: http://localhost:3000
- Hot reload 활성화

**프로덕션 빌드:**
```bash
npm run build
```

**시작:**
```bash
npm start
```
- 프로덕션 최적화 버전 실행

**린트 검사:**
```bash
npm run lint
```

### Tailwind CSS v4 사용

**임포트:**
```css
@import "tailwindcss";
```

**테마 커스터마이징:**
```css
@theme inline {
  --accent: #10b981;       /* 에메랄드 */
  --warning: #fbbf24;      /* 옐로 */
  --danger: #ef4444;       /* 레드 */
  --bg-card: #1e293b;      /* 카드 배경 */
  --bg-card-hover: #334155; /* 카드 호버 */
  --text-muted: #64748b;   /* 음소거된 텍스트 */
  --text-secondary: #94a3b8;
  --border: #475569;
}
```

**CSS 변수 사용:**
```css
background-color: var(--bg-card);
color: var(--text-secondary);
```

### TypeScript 설정

`tsconfig.json`:
- 타겟: ES2020
- 경로 별칭: `@/*` → `src/*`
- 엄격 모드: 활성화

### 환경변수

**`.env.local` (버전 관리 제외):**
```
FOOTBALL_DATA_API_KEY=your_api_key_here
```

**`.env.example` (템플릿):**
```
FOOTBALL_DATA_API_KEY=
```

개발자가 로컬에서 `.env.local`을 생성할 때 참고

---

## 알려진 제한사항

### API 제한

1. **football-data.org 무료 티어**
   - 분당 10개 요청 제한 (Rate Limiting)
   - K리그 데이터 미지원 (유료 플랜 필요)

2. **선수 사진**
   - football-data.org는 선수 사진 미제공
   - 현재 이니셜 그래디언트 아바타로 대체
   - 향후 다른 이미지 소스 통합 고려

3. **Google News RSS**
   - 뉴스 썸네일 이미지 미제공
   - RSS 피드에서 기본 구조화 데이터 제한

### 기능 제한

1. **AdSense**
   - 사이트 심사 승인 필요 (사전 심사 없으면 광고 미표시)
   - Publisher ID 등록 필수

2. **레벨/포인트 시스템**
   - 로컬 상태만 지원 (서버 DB 미연동)
   - 장치 간 동기화 불가
   - localStorage 기반 저장소 활용

3. **뉴스 카테고리**
   - 자동 분류 알고리즘 기반 (완벽하지 않음)
   - 키워드 기반 분류로 오분류 가능

### 성능 고려사항

1. **인메모리 캐싱**
   - Vercel 서버 콜드 스타트 시 캐시 초기화
   - 장기 캐시 필요 시 Redis 등 외부 캐시 검토

2. **이미지 최적화**
   - Next.js Image 컴포넌트 미사용 (성능 개선 기회)
   - 외부 이미지 도메인 많음 (로딩 시간 영향)

3. **번들 크기**
   - Tailwind CSS v4 적용으로 스타일 크기 최적화
   - 향후 동적 import로 페이지 분할 가능

---

## 커밋 히스토리 (주요)

프로젝트 주요 개발 단계:

1. **Initial PWA Build**
   - PWA 기본 설정 (manifest, sw.js)
   - 다크 테마 적용
   - 기본 레이아웃 및 내비게이션

2. **Multi-Page Refactor**
   - App Router 기반 5개 페이지 (Home, News, Standings, Predictions, Profile)
   - 하단 탭 네비게이션 구현

3. **Real Data Integration**
   - football-data.org v4 API 연동
   - Google News RSS 파싱
   - 라이브 스코어, 순위표, 득점 순위 표시

4. **Bug Fixes & Improvements**
   - 리그 선택자 수정
   - 최근 폼 W/D/L 데이터 파싱 수정
   - 선수 이니셜 아바타 그래디언트 개선

5. **AdSense Integration**
   - Google AdSense ins 태그 수정
   - AdSlot 컴포넌트 구현

6. **Service Worker v2**
   - 캐시 이름 업그레이드 (goalkick-v1 → goalkick-v2)
   - 비-HTTP 스킴 필터링 추가 (chrome-extension:// 등)
   - Network-first 캐싱 전략 개선

---

## 개발자 체크리스트

새 개발자가 프로젝트 설정 시:

- [ ] 저장소 클론
- [ ] `npm install` 실행
- [ ] `.env.local` 생성 및 `FOOTBALL_DATA_API_KEY` 입력
- [ ] `npm run dev`로 로컬 서버 시작
- [ ] http://localhost:3000 접속 확인
- [ ] 서비스 워커 등록 확인 (DevTools → Application → Service Workers)
- [ ] 각 페이지 기능 테스트
- [ ] `npm run lint` 로 코드 품질 검사

### 배포 전 체크리스트

- [ ] 모든 환경변수 Vercel에 등록
- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] 링크 모두 유효한지 확인
- [ ] 모바일 반응형 테스트
- [ ] 서비스 워커 캐시 버전 확인
- [ ] Google AdSense 심사 상태 확인
- [ ] `npm run lint` 에러 없음
- [ ] Git 커밋 메시지 명확함
- [ ] Vercel 배포 트리거

---

## 문제 해결

### API 키 오류
- `.env.local`에 `FOOTBALL_DATA_API_KEY` 설정되었는지 확인
- API 키가 유효한지 확인 (football-data.org 대시보드)
- Rate limiting으로 일시적 차단되었을 가능성 확인

### 서비스 워커 미작동
- DevTools → Application → Service Workers 확인
- `public/sw.js` 파일이 배포됨을 확인
- `CACHE_NAME` 변경으로 캐시 초기화 시도
- 브라우저 캐시 및 cookies 전체 삭제

### 광고 미표시
- Google AdSense 심사 상태 확인 (ca-pub-3498371918924514)
- AdSlot 컴포넌트가 페이지에 렌더링되는지 확인
- 개발 환경 vs 프로덕션 환경 구분 (localhost에서는 미표시)
- 브라우저 콘솔 오류 확인

### 뉴스 피드 공백
- Google News RSS 피드 가용성 확인
- 네트워크 요청 (DevTools → Network) 확인
- RSS 파싱 로직 검증 (`src/app/api/football/route.ts`)

### 레벨 시스템 미작동
- 브라우저 localStorage 확인 (DevTools → Application → Local Storage)
- `src/types/football.ts`의 LEVEL_THRESHOLDS 값 확인
- ProfileSection 컴포넌트에서 레벨 계산 로직 검증

---

## 라이선스 및 귀속

- **Next.js:** MIT License
- **React:** MIT License
- **Tailwind CSS:** MIT License
- **football-data.org:** API 이용 약관 준수
- **Google News:** Google 서비스 약관 준수
- **Google AdSense:** Google AdSense 정책 준수

---

마지막 업데이트: 2026년 2월 23일
프로젝트 유지자: Hwemo-Chung
