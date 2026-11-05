import React, { useState, useEffect } from 'react';
import { 
  X, 
  Square, 
  Camera, 
  Sliders, 
  Activity, 
  Volume2, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Check, 
  Sparkles,
  Gamepad2
} from 'lucide-react';
import { GameItem, TelemetryState } from '../types';

interface Props {
  game: GameItem;
  telemetry: TelemetryState;
  onCloseOverlay: () => void; // minimize to hub
  onQuitGame: (gameId: string) => void; // full terminate
  onOpenTelemetryDrawer: () => void;
}

export const GameRunningOverlay: React.FC<Props> = ({
  game,
  telemetry,
  onCloseOverlay,
  onQuitGame,
  onOpenTelemetryDrawer
}) => {
  const [secondsRunning, setSecondsRunning] = useState(482); // start with initial elapsed time
  const [isPaused, setIsPaused] = useState(false);
  const [liveFps, setLiveFps] = useState(telemetry.fpsLimit > 0 ? telemetry.fpsLimit : 60);
  const [screenshotFlash, setScreenshotFlash] = useState(false);
  const [screenshotNotification, setScreenshotNotification] = useState<string | null>(null);

  // Live session timer & subtle FPS fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setSecondsRunning(prev => prev + 1);
        // Small realistic micro fluctuation in FPS
        const target = telemetry.fpsLimit > 0 ? telemetry.fpsLimit : 60;
        const jitter = (Math.random() * 1.6 - 0.8);
        setLiveFps(Number((target + jitter).toFixed(1)));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, telemetry.fpsLimit]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTakeScreenshot = () => {
    setScreenshotFlash(true);
    setTimeout(() => setScreenshotFlash(false), 200);
    setScreenshotNotification(`📸 스크린샷 캡처 완료 (${new Date().toLocaleTimeString()})`);
    setTimeout(() => setScreenshotNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080F] flex flex-col justify-between overflow-hidden select-none animate-fade-in font-body">
      
      {/* Screenshot Flash FX */}
      {screenshotFlash && (
        <div className="absolute inset-0 bg-white/70 z-50 pointer-events-none transition-opacity duration-150" />
      )}

      {/* Top Gaming HUD Bar */}
      <header className="relative z-30 w-full bg-[#0a0e18]/85 backdrop-blur-md border-b border-[#2A3854]/60 px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Active Game Title & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="font-headline font-bold text-sm sm:text-base text-white">
              {game.title}
            </span>
          </div>

          <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30">
            SESSION: {formatTime(secondsRunning)}
          </span>

          {isPaused && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              일시 정지됨
            </span>
          )}
        </div>

        {/* Center: Real-time Telemetry (FPS, Temp, Watt) */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#131B2E] border border-[#2A3854] px-2.5 py-1 rounded-lg text-emerald-400 font-bold flex items-center gap-1.5 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{liveFps} FPS</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-[#131B2E] border border-[#2A3854] px-2.5 py-1 rounded-lg text-slate-300">
            <span>GPU: <strong className="text-[#00D2FF]">{telemetry.gpuTemp}°C</strong></span>
            <span className="text-slate-600">|</span>
            <span>TDP: <strong className="text-amber-400">{telemetry.tdpWatt}W</strong></span>
          </div>
        </div>

        {/* Right: Overlay Controls */}
        <div className="flex items-center gap-2">
          {/* Screenshot Button */}
          <button
            onClick={handleTakeScreenshot}
            className="p-2 rounded-lg bg-[#131B2E] border border-[#2A3854] text-slate-300 hover:text-white hover:border-[#00D2FF] transition-all"
            title="인게임 스크린샷 캡처 (F12)"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Quick Hardware Settings */}
          <button
            onClick={onOpenTelemetryDrawer}
            className="p-2 rounded-lg bg-[#131B2E] border border-[#2A3854] text-[#00D2FF] hover:bg-[#1E293B] transition-all"
            title="덱 오버레이 설정 (QAM)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Minimize / Return to Hub */}
          <button
            onClick={onCloseOverlay}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#131B2E] border border-[#2A3854] hover:border-slate-400 text-xs text-slate-200 transition-colors"
            title="게임을 백그라운드에 두고 허브로 돌아가기"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">허브로 최소화</span>
          </button>

          {/* Terminate Game */}
          <button
            onClick={() => onQuitGame(game.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-headline transition-colors shadow-md"
            title="게임 프로세스 종료"
          >
            <Square className="w-3.5 h-3.5" />
            <span>게임 종료</span>
          </button>
        </div>
      </header>

      {/* Main Simulated Game Canvas */}
      <main className="relative flex-1 w-full flex items-center justify-center p-6 overflow-hidden">
        
        {/* Dynamic Stylized In-Game Background Graphic */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${game.themeColor}33 0%, #06080F 85%)`
          }}
        />

        {/* Cyber Scifi Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, ${game.themeColor} 1px, transparent 1px), linear-gradient(to bottom, ${game.themeColor} 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Center Game Visualizer Card */}
        <div className="relative z-10 max-w-xl w-full bg-[#131B2E]/90 border border-[#2A3854] rounded-2xl p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl space-y-4">
          
          <div className="inline-flex p-4 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] mb-2 shadow-[0_0_20px_rgba(0,210,255,0.3)]">
            <Gamepad2 className="w-12 h-12" />
          </div>

          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-white tracking-wide">
            {game.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            {game.tagline}
          </p>

          <div className="py-2 inline-block px-4 rounded-lg bg-[#0a0e18] border border-slate-700/60 font-mono text-xs text-[#00D2FF]">
            인게임 렌더링 파이프라인: DirectX 12 · 60 FPS V-Sync 활성화됨
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#262a35] border border-[#2A3854] text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              {isPaused ? '세션 계속하기 (Resume)' : '세션 일시 정지 (Pause)'}
            </button>

            <button
              onClick={handleTakeScreenshot}
              className="px-5 py-2.5 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-[#a5e7ff] transition-all glow-cyan-sm"
            >
              <Camera className="w-4 h-4" />
              스크린샷 캡처
            </button>
          </div>
        </div>

        {/* Screenshot Floating Notification */}
        {screenshotNotification && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-emerald-600 text-white font-mono text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{screenshotNotification}</span>
          </div>
        )}
      </main>

      {/* In-Game Bottom Controller Guide Strip */}
      <footer className="relative z-30 bg-[#0a0e18]/90 border-t border-[#2A3854]/60 px-6 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[#00D2FF] font-bold border border-slate-700">ESC</kbd>
            <span>허브 최소화</span>
          </span>
          <span className="flex items-center gap-1.5 hidden sm:inline-flex">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[#00D2FF] font-bold border border-slate-700">F12</kbd>
            <span>스크린샷</span>
          </span>
          <span className="flex items-center gap-1.5 hidden md:inline-flex">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[#00D2FF] font-bold border border-slate-700">···</kbd>
            <span>퀵 엑세스 덱 메뉴</span>
          </span>
        </div>

        <button
          onClick={onCloseOverlay}
          className="text-xs text-[#00D2FF] hover:underline"
        >
          CyberDeck Hub로 복귀 →
        </button>
      </footer>

    </div>
  );
};
