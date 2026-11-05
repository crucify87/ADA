import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  X, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight, 
  SlidersHorizontal 
} from 'lucide-react';
import { GameItem } from '../types';

interface Props {
  games: GameItem[];
  onCancelDownload: (gameId: string) => void;
  onLaunchGame: (gameId: string) => void;
}

export const DownloadsView: React.FC<Props> = ({
  games,
  onCancelDownload,
  onLaunchGame
}) => {
  const [isPausedAll, setIsPausedAll] = useState(false);
  const [bandwidthLimit, setBandwidthLimit] = useState(100); // 100% (unlimited)

  const activeDownloads = games.filter(
    g => g.status === 'NOT_INSTALLED' && (g.downloadProgress !== undefined && g.downloadProgress > 0 && g.downloadProgress < 100)
  );

  const completedGames = games.filter(g => g.status === 'INSTALLED' || g.status === 'RUNNING');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Telemetry Strip */}
      <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3854]/60">
          <div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-[#00D2FF]" />
              다운로드 매니저 & 업데이트 큐
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              고속 NVMe 셰이더 프리캐시 및 실시간 대역폭 제어
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPausedAll(!isPausedAll)}
              className={`px-4 py-2 rounded-xl text-xs font-headline font-bold flex items-center gap-2 transition-all ${
                isPausedAll 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                  : 'bg-[#1E293B] hover:bg-[#262a35] text-amber-300 border border-amber-500/30'
              }`}
            >
              {isPausedAll ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPausedAll ? '모두 재개' : '모두 일시 정지'}
            </button>
          </div>
        </div>

        {/* Live Network & Disk Speed Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-1 font-mono text-xs">
          <div className="bg-[#0f131d] border border-slate-800 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">다운로드 속도</span>
            <span className="text-lg font-bold text-[#00D2FF]">
              {isPausedAll ? '0.0 MB/s' : `${(84.2 * (bandwidthLimit / 100)).toFixed(1)} MB/s`}
            </span>
          </div>
          <div className="bg-[#0f131d] border border-slate-800 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">디스크 쓰기 속도</span>
            <span className="text-lg font-bold text-emerald-400">
              {isPausedAll ? '0.0 MB/s' : '112.5 MB/s'}
            </span>
          </div>
          <div className="bg-[#0f131d] border border-slate-800 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">남은 NVMe 여유 용량</span>
            <span className="text-lg font-bold text-slate-200">412.8 GB</span>
          </div>
          <div className="bg-[#0f131d] border border-slate-800 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">대역폭 제한</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min="20"
                max="100"
                value={bandwidthLimit}
                onChange={(e) => setBandwidthLimit(Number(e.target.value))}
                className="w-full accent-[#00D2FF]"
              />
              <span className="text-xs text-[#00D2FF] font-bold">{bandwidthLimit}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Downloading Items */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-base text-white flex items-center justify-between">
          <span>진행 중인 다운로드 ({activeDownloads.length})</span>
        </h3>

        {activeDownloads.length === 0 ? (
          <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-headline font-bold text-base text-white">모든 타이틀이 최신 상태입니다</h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              라이브러리 또는 스토어에서 새로운 게임을 설치하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          activeDownloads.map((game) => (
            <div 
              key={game.id}
              className="bg-[#131B2E] border border-[#00D2FF]/40 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/20 text-[#00D2FF] font-headline font-bold flex items-center justify-center shrink-0">
                    {game.title.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h4 className="font-headline font-bold text-sm sm:text-base text-white truncate">
                      {game.title}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      다운로드 중: {game.installSize} · {game.downloadSpeed || '78.4 MB/s'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onCancelDownload(game.id)}
                    className="p-2 rounded-lg bg-[#1E293B] text-slate-400 hover:text-white border border-[#2A3854]"
                    title="다운로드 취소"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>진척도: {game.downloadProgress || 45}%</span>
                  <span className="text-[#00D2FF] font-bold">약 2분 10초 남음</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0F19] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00D2FF] to-[#A855F7] rounded-full transition-all duration-300"
                    style={{ width: `${game.downloadProgress || 45}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Games Shelf */}
      <div className="space-y-3 pt-4">
        <h3 className="font-headline font-bold text-base text-white">
          최근 완료된 설치 및 업데이트 ({completedGames.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {completedGames.slice(0, 4).map((game) => (
            <div 
              key={game.id}
              className="bg-[#131B2E] border border-[#2A3854] rounded-xl p-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-xs sm:text-sm text-white truncate font-headline">{game.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{game.installSize} · 설치 완료</div>
                </div>
              </div>

              <button
                onClick={() => onLaunchGame(game.id)}
                className="px-3 py-1.5 rounded-lg bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs flex items-center gap-1 hover:bg-[#a5e7ff] shrink-0"
              >
                <Play className="w-3 h-3 fill-[#07101E]" />
                플레이
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
