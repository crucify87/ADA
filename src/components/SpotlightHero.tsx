import React from 'react';
import { Play, Info, Flame, Trophy, Sparkles, Cpu, Clock, Check } from 'lucide-react';
import { GameItem } from '../types';

interface Props {
  featuredGame: GameItem;
  allFeatured: GameItem[];
  onSelectFeatured: (game: GameItem) => void;
  onLaunch: (gameId: string) => void;
  onOpenDetails: (game: GameItem) => void;
}

export const SpotlightHero: React.FC<Props> = ({
  featuredGame,
  allFeatured,
  onSelectFeatured,
  onLaunch,
  onOpenDetails
}) => {
  const isRunning = featuredGame.status === 'RUNNING';

  return (
    <section className="relative w-full rounded-2xl overflow-hidden border border-[#2A3854]/80 bg-[#131B2E] shadow-2xl mb-8">
      {/* Background Graphic & Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${featuredGame.accentGradient} opacity-40`} 
      />
      
      {/* Decorative Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #00D2FF 1px, transparent 1px), linear-gradient(to bottom, #00D2FF 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Column: Info & Launch Action */}
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              SPOTLIGHT HIGHLIGHT
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">{featuredGame.developer}</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-400 font-bold">DECK VERIFIED ★</span>
          </div>

          <h2 className="font-headline font-bold text-2xl sm:text-4xl text-white tracking-tight drop-shadow-lg leading-tight mb-2">
            {featuredGame.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-4 line-clamp-2 max-w-xl">
            {featuredGame.description}
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-6">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>플레이 타임: <strong className="text-white">{featuredGame.playtimeHours}시간</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>도전 과제: <strong className="text-white">{featuredGame.achievements.unlocked}/{featuredGame.achievements.total}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>권장 FPS: <strong className="text-white">60 FPS</strong></span>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunch(featuredGame.id)}
              className="px-6 py-3 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-sm sm:text-base flex items-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.45)] hover:bg-[#a5e7ff] hover:scale-[1.02] active:scale-95 transition-all min-h-[46px]"
            >
              <Play className="w-4 h-4 fill-[#07101E]" />
              {isRunning ? '진행 중인 세션 복귀' : '지금 즉시 플레이'}
            </button>

            <button
              onClick={() => onOpenDetails(featuredGame)}
              className="px-4 py-3 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-[#2A3854] hover:border-[#00D2FF]/60 text-slate-200 font-headline font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all min-h-[46px]"
            >
              <Info className="w-4 h-4 text-[#00D2FF]" />
              상세 정보 & 가이드
            </button>
          </div>
        </div>

        {/* Right Column: Hero Showcase Selector Thumbnails (Desktop & Tablet) */}
        <div className="w-full lg:w-72 shrink-0 bg-[#0B0F19]/60 backdrop-blur-md rounded-xl p-3 border border-[#2A3854]/60">
          <div className="text-[11px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>추천 컬렉션</span>
            <span className="text-[#00D2FF]">{allFeatured.length}개 타이틀</span>
          </div>

          <div className="space-y-2">
            {allFeatured.slice(0, 3).map((game) => (
              <button
                key={game.id}
                onClick={() => onSelectFeatured(game)}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-3 border ${
                  featuredGame.id === game.id 
                    ? 'bg-[#1E293B] border-[#00D2FF] shadow-[0_0_12px_rgba(0,210,255,0.2)]' 
                    : 'bg-[#131B2E]/40 border-slate-800 hover:border-slate-700 hover:bg-[#131B2E]'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0"
                  style={{ backgroundColor: `${game.themeColor}33`, color: game.themeColor, border: `1px solid ${game.themeColor}55` }}
                >
                  {game.title.charAt(0)}
                </div>
                <div className="flex-1 truncate">
                  <div className="text-xs font-bold text-white truncate font-headline">{game.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{game.genre} · {game.metascore}점</div>
                </div>
                {featuredGame.id === game.id && (
                  <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
