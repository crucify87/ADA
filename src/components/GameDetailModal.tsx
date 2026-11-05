import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Download, 
  RefreshCw, 
  Star, 
  Clock, 
  Trophy, 
  Cpu, 
  HardDrive, 
  Cloud, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Square
} from 'lucide-react';
import { GameItem } from '../types';
import { GameCoverArtwork } from './GameCoverArtwork';

interface Props {
  game: GameItem | null;
  onClose: () => void;
  onLaunch: (gameId: string) => void;
  onStop: (gameId: string) => void;
  onInstallOrUpdate: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const GameDetailModal: React.FC<Props> = ({
  game,
  onClose,
  onLaunch,
  onStop,
  onInstallOrUpdate,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');
  const [launchArgs, setLaunchArgs] = useState('-novid -high -fullscreen +fps_max 60');
  const [syncingCloud, setSyncingCloud] = useState(false);

  if (!game) return null;

  const isRunning = game.status === 'RUNNING';
  const isUpdate = game.status === 'UPDATE_AVAILABLE';
  const isInstalled = game.status === 'INSTALLED' || isRunning;

  const handleSyncCloud = () => {
    setSyncingCloud(true);
    setTimeout(() => {
      setSyncingCloud(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#131B2E] border border-[#2A3854] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Close and Favorite */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A3854]/60 bg-[#0f131d]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#00D2FF]">GAME DETAILS</span>
            <span className="text-slate-500">/</span>
            <span className="text-xs font-mono text-slate-300">{game.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                game.isFavorite 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                  : 'bg-[#1E293B] text-slate-400 border-[#2A3854] hover:text-white'
              }`}
              title="즐겨찾기 토글"
            >
              <Star className={`w-4 h-4 ${game.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1E293B] text-slate-400 hover:text-white border border-[#2A3854] transition-colors"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Top Banner & Launch Hero */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-56 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border border-[#2A3854]">
              <GameCoverArtwork game={game} className="w-full h-full" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#1E293B] text-[#00D2FF] border border-[#00D2FF]/30 font-bold">
                  {game.genre}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">{game.developer}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-400">{game.releaseDate}</span>
              </div>

              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-white">
                {game.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {game.description}
              </p>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {isRunning ? (
                  <>
                    <button
                      onClick={() => onLaunch(game.id)}
                      className="px-5 py-2.5 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:bg-[#a5e7ff]"
                    >
                      <Play className="w-4 h-4 fill-[#07101E]" />
                      인게임 화면으로 전환
                    </button>
                    <button
                      onClick={() => onStop(game.id)}
                      className="px-4 py-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white font-headline font-semibold text-sm flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" />
                      게임 종료
                    </button>
                  </>
                ) : isUpdate ? (
                  <button
                    onClick={() => onInstallOrUpdate(game.id)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-headline font-bold text-sm flex items-center gap-2 hover:bg-amber-400 shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    업데이트 시작 ({game.installSize})
                  </button>
                ) : isInstalled ? (
                  <button
                    onClick={() => onLaunch(game.id)}
                    className="px-6 py-2.5 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:bg-[#a5e7ff]"
                  >
                    <Play className="w-4 h-4 fill-[#07101E]" />
                    게임 실행 (PLAY)
                  </button>
                ) : (
                  <button
                    onClick={() => onInstallOrUpdate(game.id)}
                    className="px-6 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#262a35] text-[#00D2FF] border border-[#00D2FF]/40 font-headline font-bold text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    설치 시작 ({game.installSize})
                  </button>
                )}

                {/* Cloud Save Sync Button */}
                <button
                  onClick={handleSyncCloud}
                  disabled={syncingCloud}
                  className="px-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#2A3854] text-slate-300 hover:text-white hover:border-[#00D2FF]/40 text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <Cloud className={`w-3.5 h-3.5 text-[#00D2FF] ${syncingCloud ? 'animate-bounce' : ''}`} />
                  {syncingCloud ? '동기화 중...' : '클라우드 세이브 동기화'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs inside modal */}
          <div className="flex border-b border-[#2A3854] gap-6 text-sm font-headline">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 transition-colors relative font-semibold ${
                activeTab === 'overview' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              개요 및 사양
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`pb-2.5 transition-colors relative font-semibold ${
                activeTab === 'achievements' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              도전 과제 ({game.achievements.unlocked}/{game.achievements.total})
              {activeTab === 'achievements' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2.5 transition-colors relative font-semibold ${
                activeTab === 'settings' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              시작 옵션 및 설정
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f131d] border border-[#2A3854]/60 rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold text-[#00D2FF] uppercase block">
                  SYSTEM TELEMETRY & HARDWARE
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">권장 그래픽 카드 (GPU):</span>
                    <span className="text-slate-200">{game.systemReq.gpu}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">권장 프로세서 (CPU):</span>
                    <span className="text-slate-200">{game.systemReq.cpu}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">스토리지 요구 공간:</span>
                    <span className="text-slate-200">{game.systemReq.storage}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Steam Deck 호환성:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 완벽 지원 (Verified)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f131d] border border-[#2A3854]/60 rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold text-[#A855F7] uppercase block">
                  플레이 기록 & 세이브 정보
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">누적 플레이 타임:</span>
                    <span className="text-white font-bold">{game.playtimeHours}시간</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">마지막 실행:</span>
                    <span className="text-slate-200">{game.lastPlayed}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">메타크리틱 스코어:</span>
                    <span className="text-[#00D2FF] font-bold">{game.metascore}점</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">설치 위치:</span>
                    <span className="text-slate-300">/mnt/deck/games/{game.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>진척도: {game.achievements.unlocked} / {game.achievements.total} 달성</span>
                <span className="text-[#00D2FF] font-bold">
                  {Math.round((game.achievements.unlocked / game.achievements.total) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#0B0F19] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00D2FF] to-[#A855F7]"
                  style={{ width: `${(game.achievements.unlocked / game.achievements.total) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-lg bg-[#0f131d] border border-[#2A3854] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">첫 걸음의 정복자</div>
                    <div className="text-[11px] text-slate-400">프롤로그 챕터 완벽 클리어</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0f131d] border border-[#2A3854] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">사이버 하이퍼드라이브</div>
                    <div className="text-[11px] text-slate-400">피격 없이 3연속 콤보 피니시 성공</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  시작 명령줄 인수 (LAUNCH OPTIONS)
                </label>
                <input
                  type="text"
                  value={launchArgs}
                  onChange={(e) => setLaunchArgs(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono bg-[#0f131d] border border-[#2A3854] rounded-lg text-slate-200 focus:outline-none focus:border-[#00D2FF]"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  예: -novid -fullscreen +fps_max 60 -dx12
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f131d] border border-[#2A3854] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Proton 호환성 강제 지정</div>
                    <div className="text-[11px] text-slate-400">덱 최적화 GE-Proton 9.4 런타임 사용</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#00D2FF] w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">셰이더 사전 컴파일 캐시 활성화</div>
                    <div className="text-[11px] text-slate-400">인게임 끊김(스터터링) 방지</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#00D2FF] w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
