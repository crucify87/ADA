import React from 'react';
import { Play, Download, RefreshCw, Star, Info, HardDrive, CheckCircle2 } from 'lucide-react';
import { GameItem } from '../types';
import { GameCoverArtwork } from './GameCoverArtwork';

interface Props {
  game: GameItem;
  onSelect: (game: GameItem) => void;
  onLaunch: (gameId: string) => void;
  onInstallOrUpdate: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const GameCard: React.FC<Props> = ({
  game,
  onSelect,
  onLaunch,
  onInstallOrUpdate,
  onToggleFavorite
}) => {
  const isRunning = game.status === 'RUNNING';
  const isUpdate = game.status === 'UPDATE_AVAILABLE';
  const isInstalled = game.status === 'INSTALLED' || isRunning;

  return (
    <div 
      className={`group relative bg-[#131B2E] rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        isRunning 
          ? 'border-[#00D2FF] shadow-[0_0_20px_rgba(0,210,255,0.25)]' 
          : 'border-[#2A3854]/60 hover:border-[#00D2FF]/80 hover:shadow-[0_8px_24px_rgba(0,210,255,0.12)]'
      }`}
      onClick={() => onSelect(game)}
    >
      {/* Favorite Star Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(game.id);
        }}
        className={`absolute top-3 right-3 z-20 p-1.5 rounded-lg backdrop-blur-md transition-all ${
          game.isFavorite 
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm' 
            : 'bg-black/40 text-slate-400 hover:text-white border border-slate-700/60'
        }`}
        title={game.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      >
        <Star className={`w-3.5 h-3.5 ${game.isFavorite ? 'fill-amber-400' : ''}`} />
      </button>

      {/* Status Pill Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        {isRunning && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-[#00D2FF] text-[#07101E] flex items-center gap-1 shadow-[0_0_10px_#00D2FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#07101E] animate-ping" />
            RUNNING
          </span>
        )}
        {isUpdate && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            UPDATE AVAILABLE
          </span>
        )}
        {game.status === 'INSTALLED' && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-slate-900/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            INSTALLED
          </span>
        )}
      </div>

      {/* Poster Artwork with smooth zoom on hover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          <GameCoverArtwork game={game} className="w-full h-full" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-[#131B2E]">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-headline font-bold text-sm sm:text-base text-white group-hover:text-[#00D2FF] transition-colors line-clamp-1">
              {game.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
            <span>{game.developer}</span>
            <span aria-hidden="true">·</span>
            <span>{game.installSize}</span>
          </div>

          {/* Achievement Bar if available */}
          {game.achievements.total > 0 && (
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>도전 과제 ({game.achievements.unlocked}/{game.achievements.total})</span>
                <span className="text-[#dab1ff]">
                  {Math.round((game.achievements.unlocked / game.achievements.total) * 100)}%
                </span>
              </div>
              <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00D2FF] to-[#A855F7] rounded-full"
                  style={{ width: `${(game.achievements.unlocked / game.achievements.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button Area */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-700/40 flex items-center justify-between gap-2">
          {isRunning ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLaunch(game.id);
              }}
              className="flex-1 h-9 rounded-lg bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.4)] hover:bg-[#a5e7ff] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-[#07101E]" />
              인게임 열기
            </button>
          ) : isUpdate ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInstallOrUpdate(game.id);
              }}
              className="flex-1 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              업데이트 ({game.installSize})
            </button>
          ) : isInstalled ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLaunch(game.id);
              }}
              className="flex-1 h-9 rounded-lg bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.4)] hover:bg-[#a5e7ff] active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-[#07101E]" />
              플레이
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInstallOrUpdate(game.id);
              }}
              className="flex-1 h-9 rounded-lg bg-[#1E293B] hover:bg-[#262a35] text-[#00D2FF] border border-[#00D2FF]/40 font-headline font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              설치 ({game.installSize})
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(game);
            }}
            className="w-9 h-9 shrink-0 rounded-lg bg-[#1E293B] border border-[#2A3854] text-slate-400 hover:text-white hover:border-slate-500 flex items-center justify-center transition-colors"
            title="상세 정보 보기"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
