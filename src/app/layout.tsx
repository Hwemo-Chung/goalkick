import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoalKick 골킥 - 축구 라이브 허브",
  description: "실시간 축구 스코어, 뉴스, 경기 예측, 통계를 한 페이지에서. EPL, K리그, 챔피언스리그 등 주요 리그 완벽 커버.",
  manifest: "/manifest.json",
  keywords: ["축구", "라이브 스코어", "EPL", "K리그", "챔피언스리그", "축구 예측", "축구 뉴스", "프리미어리그", "유럽축구"],
  authors: [{ name: "GoalKick" }],
  openGraph: {
    title: "GoalKick 골킥 - 축구 라이브 허브",
    description: "실시간 축구 스코어, 뉴스, 경기 예측, 통계를 한 페이지에서",
    type: "website",
    locale: "ko_KR",
    siteName: "GoalKick 골킥",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoalKick 골킥 - 축구 라이브 허브",
    description: "실시간 축구 스코어, 뉴스, 경기 예측, 통계를 한 페이지에서",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoalKick",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3498371918924514"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
