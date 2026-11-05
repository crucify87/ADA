import React, { useState } from 'react';
import { 
  Gamepad2, 
  ShoppingBag, 
  Download, 
  Cpu, 
  Settings, 
  Play, 
  Square, 
  Maximize2, 
  Volume2, 
  Sliders, 
  Activity,
  Layers
} from 'lucide-react';
import { GameItem, TelemetryState } from '../types';

interface Props {
  activeSection: 'library' | 'store' | 'downloads' | 'hardware' | 'friends' | 'settings';
  onSelectSection: (section: 'library' | 'store' | 'downloads' | 'hardware' | 'friends' | 'settings') => void;
  runningGame: GameItem | null;
  onOpenRunningOverlay: () => void;
  onStopGame: (gameId: string) => void;
  telemetry: TelemetryState;
  onToggleFpsLimit: () => void;
  onOpenTelemetry: () => void;
}

export const BottomBar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  runningGame,
  onOpenRunningOverlay,
  onStopGame,
  telemetry,
  onToggleFpsLimit,
  onOpenTelemetry
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(75);

  return (
    <>
      {/* ========================================================
          MOBILE BOTTOM NAVIGATION (Touch-friendly, Height < 15% Viewport)
          ======================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f131d]/95 backdrop-blur-md border-t border-[#2A3854]/60">
        {/* Floating Mini Bar if a game is actively running */}
        {runningGame && (
          <div className="bg-gradient-to-r from-[#0053db] to-[#00D2FF] text-white px-3 py-1.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-xs font-bold truncate text-[#07101E] font-headline">
                {runningGame.title} 실행 중
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenRunningOverlay}
                className="px-2 py-1 bg-[#07101E] text-[#00D2FF] hover:bg-black text-[11px] font-bold rounded flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3" /> 열기
              </button>
              <button
                onClick={() => onStopGame(runningGame.id)}
                className="px-2 py-1 bg-red-600/90 text-white hover:bg-red-700 text-[11px] font-bold rounded flex items-center gap-1"
                title="게임 강제 종료"
              >
                <Square className="w-3 h-3" /> 종료
              </button>
            </div>
          </div>
        )}

        {/* 5 Ergonomic Mobile Bottom Tabs */}
        <div className="grid grid-cols-5 h-14 items-center">
          <button
            onClick={() => onSelectSection('library')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
              activeSection === 'library' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">라이브러리</span>
            {activeSection === 'library' && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectSection('store')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
              activeSection === 'store' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">스토어</span>
            {activeSection === 'store' && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectSection('downloads')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
              activeSection === 'downloads' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">다운로드</span>
            {activeSection === 'downloads' && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectSection('hardware')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
              activeSection === 'hardware' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">텔레메트리</span>
            {activeSection === 'hardware' && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
            )}
          </button>

          <button
            onClick={() => onSelectSection('settings')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
              activeSection === 'settings' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">설정</span>
            {activeSection === 'settings' && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          DESKTOP PERSISTENT BOTTOM DOCK (Steam Deck QAM style)
          ======================================================== */}
      <footer className="hidden md:flex sticky bottom-0 z-30 w-full bg-[#0f131d]/95 backdrop-blur-md border-t border-[#2A3854]/60 px-6 py-2">
        <div className="w-full flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
          
          {/* Left: Active Game Controller Status or System Standby */}
          <div className="flex items-center gap-3">
            {runningGame ? (
              <div className="flex items-center gap-3 bg-[#131B2E] border border-[#00D2FF]/40 rounded-xl px-3 py-1.5 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-headline font-bold text-xs text-white">
                    {runningGame.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#00D2FF] bg-[#00D2FF]/10 px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-700 mx-1" />

                <button
                  onClick={onOpenRunningOverlay}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00D2FF] text-[#07101E] hover:bg-[#a5e7ff] text-xs font-bold font-headline transition-all glow-cyan-sm active:scale-95"
                  title="게임 내 오버레이 화면으로 전환"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>인게임 화면 보기</span>
                </button>

                <button
                  onClick={() => onStopGame(runningGame.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white text-xs font-medium transition-colors"
                  title="게임 프로세스 종료"
                >
                  <Square className="w-3 h-3" />
                  <span>종료</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span>CYBERDECK STANDBY · 모든 코어 정상 대기 중</span>
              </div>
            )}
          </div>

          {/* Right: Quick Telemetry Controls (FPS Limiter, Volume, Quick Access Menu) */}
          <div className="flex items-center gap-2 relative">
            
            {/* FPS Limit Toggle Button */}
            <button
              onClick={onToggleFpsLimit}
              className="px-2.5 py-1 bg-[#131B2E] border border-[#2A3854] hover:border-[#00D2FF]/50 rounded-lg text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5"
              title="FPS 제한 토글 (30 FPS ↔ 40 FPS ↔ 60 FPS ↔ 제한 없음)"
            >
              <Activity className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>FPS 제한: <strong className="text-[#00D2FF]">{telemetry.fpsLimit > 0 ? `${telemetry.fpsLimit}` : 'MAX'}</strong></span>
            </button>

            {/* Quick Volume Slider Button */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="p-1.5 bg-[#131B2E] border border-[#2A3854] hover:border-[#00D2FF]/50 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="시스템 마스터 볼륨"
              >
                <Volume2 className="w-4 h-4 text-slate-300" />
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full mb-2 right-0 bg-[#131B2E] border border-[#2A3854] rounded-xl p-3 shadow-2xl w-48 z-50">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1.5">
                    <span>마스터 오디오 볼륨</span>
                    <span className="text-[#00D2FF] font-bold">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-[#00D2FF] cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Steam Deck Quick Access Menu (QAM) Button */}
            <button
              onClick={onOpenTelemetry}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#131B2E] border border-[#2A3854] hover:border-[#00D2FF] rounded-lg text-xs font-mono text-slate-200 hover:text-[#00D2FF] transition-all group"
              title="빠른 하드웨어 텔레메트리 패널 열기 (QAM)"
            >
              <Sliders className="w-3.5 h-3.5 text-[#00D2FF] group-hover:rotate-45 transition-transform" />
              <span className="font-semibold">QUICK ACCESS (···)</span>
            </button>
          </div>

        </div>
      </footer>
    </>
  );
};
