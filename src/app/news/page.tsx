"use client";

import { useState, useEffect } from "react";
import { NewsItem } from "@/types/football";
import NewsFeed from "@/components/NewsFeed";
import AdSlot from "@/components/AdSlot";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/football?type=news");
        const data = await res.json();
        setNews(data.response ?? []);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <NewsFeed news={news} />
      <AdSlot size="banner" className="mx-4 mt-4" />
    </>
  );
}
