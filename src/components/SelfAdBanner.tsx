export default function SelfAdBanner() {
  return (
    <div className="mx-4 my-3 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm leading-tight">
          🏆 프리미엄 예측 분석
        </p>
        <p className="text-emerald-100 text-xs mt-1">
          정확도 85% 이상! AI 기반 경기 분석
        </p>
      </div>
      <button className="shrink-0 bg-white text-emerald-700 font-bold text-xs px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">
        업그레이드
      </button>
    </div>
  );
}
