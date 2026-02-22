"use client";

import { NewsItem } from "@/types/football";

interface NewsFeedProps {
  news: NewsItem[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const categoryLabels: Record<string, string> = {
  match: "경기",
  transfer: "이적",
  injury: "부상",
  general: "일반",
};

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="animate-fade-in px-4 space-y-3">
      {news.map((item) => (
        <a
          key={item.id}
          href={item.url}
          className="section-card block p-4 hover:bg-[var(--bg-card-hover)] transition-colors"
        >
          <div className="flex items-start gap-1.5 mb-2">
            <span className={`news-badge ${item.category}`}>
              {categoryLabels[item.category]}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{timeAgo(item.publishedAt)}</span>
          </div>
          <h3 className="text-sm font-bold leading-snug mb-1.5">{item.title}</h3>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{item.description}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-2">{item.source}</p>
        </a>
      ))}
      {news.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <p className="text-3xl mb-2">📰</p>
          <p className="text-sm">뉴스가 없습니다</p>
        </div>
      )}
    </div>
  );
}
