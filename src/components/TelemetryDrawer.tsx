import React from 'react';
import { 
  X, 
  Cpu, 
  Activity, 
  BatteryCharging, 
  Zap, 
  Fan, 
  Sliders, 
  Gauge, 
  Eye, 
  Check 
} from 'lucide-react';
import { TelemetryState } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetryState;
  onUpdateTelemetry: (updated: Partial<TelemetryState>) => void;
}

export const TelemetryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  telemetry,
  onUpdateTelemetry
}) => {
  if (!isOpen) return null;

  const fpsOptions = [30, 40, 45, 60, 0]; // 0 means uncapped

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#0f131d] border-l border-[#2A3854] h-full overflow-y-auto flex flex-col justify-between shadow-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#2A3854]/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base sm:text-lg text-white">
                  하드웨어 성능 & 텔레메트리
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  DECK APU & POWER MANAGEMENT
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#131B2E] text-slate-400 hover:text-white border border-[#2A3854]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-time Battery & Power Summary Box */}
          <div className="mt-5 p-4 rounded-xl bg-[#131B2E] border border-[#2A3854] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-[#00D2FF]" /> 배터리 상태
              </span>
              <span className="text-sm font-mono font-bold text-[#00D2FF]">
                {telemetry.batteryPct}% (충전 중)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-[#0a0e18] p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">예상 구동 시간</span>
                <span className="text-white font-bold">약 3시간 40분</span>
              </div>
              <div className="bg-[#0a0e18] p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">현재 소비 전력</span>
                <span className="text-amber-400 font-bold">{telemetry.tdpWatt + 4.2}W 총계</span>
              </div>
            </div>
          </div>

          {/* Performance Sliders & Controls */}
          <div className="mt-6 space-y-6">
            
            {/* 1. FPS Limit Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-headline font-bold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#00D2FF]" /> 프레임 속도 제한 (FPS Limit)
                </label>
                <span className="text-xs font-mono text-[#00D2FF] font-bold">
                  {telemetry.fpsLimit > 0 ? `${telemetry.fpsLimit} FPS` : '제한 없음 (Max)'}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {fpsOptions.map((limit) => (
                  <button
                    key={limit}
                    onClick={() => onUpdateTelemetry({ fpsLimit: limit })}
                    className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                      telemetry.fpsLimit === limit
                        ? 'bg-[#00D2FF] text-[#07101E] border-[#00D2FF] shadow-[0_0_10px_rgba(0,210,255,0.3)]'
                        : 'bg-[#131B2E] text-slate-300 border-[#2A3854] hover:border-slate-500'
                    }`}
                  >
                    {limit > 0 ? limit : 'OFF'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. TDP Wattage Limit Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-headline font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> 열 설계 전력 (TDP 리밋)
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {telemetry.tdpWatt} Watts
                </span>
              </div>

              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={telemetry.tdpWatt}
                onChange={(e) => onUpdateTelemetry({ tdpWatt: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-[#131B2E] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>3W (초절전)</span>
                <span>15W (덱 표준)</span>
                <span>25W (터보 부스트)</span>
              </div>
            </div>

            {/* 3. FSR Sharpness Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-headline font-bold text-slate-200 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#A855F7]" /> AMD FSR 선명도 (FidelityFX)
                </label>
                <span className="text-xs font-mono font-bold text-[#A855F7]">
                  레벨 {telemetry.fsrSharpness}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={telemetry.fsrSharpness}
                onChange={(e) => onUpdateTelemetry({ fsrSharpness: Number(e.target.value) })}
                className="w-full accent-[#A855F7] cursor-pointer h-2 bg-[#131B2E] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>부드러움 (0)</span>
                <span>균형 (3)</span>
                <span>초고선명 (5)</span>
              </div>
            </div>

            {/* 4. Overlay Level Selector */}
            <div>
              <label className="text-xs font-headline font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                <Eye className="w-4 h-4 text-emerald-400" /> 인게임 성능 오버레이 레벨
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => onUpdateTelemetry({ overlayLevel: level as 1|2|3|4 })}
                    className={`py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
                      telemetry.overlayLevel === level
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-[#131B2E] text-slate-300 border-[#2A3854] hover:border-slate-500'
                    }`}
                  >
                    레벨 {level}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1.5 block">
                {telemetry.overlayLevel === 1 && 'FPS 단일 지표만 표시'}
                {telemetry.overlayLevel === 2 && 'FPS 및 배터리 잔여율 표시'}
                {telemetry.overlayLevel === 3 && 'GPU 온도, CPU 사용량, TDP 전체 텔레메트리 표시'}
                {telemetry.overlayLevel === 4 && '프레임 타임 그래프 + 전력 상세 분석'}
              </span>
            </div>

          </div>
        </div>

        {/* Footer Reset & Apply */}
        <div className="pt-4 border-t border-[#2A3854]/60">
          <button
            onClick={() => {
              onUpdateTelemetry({
                fpsLimit: 60,
                tdpWatt: 15,
                fsrSharpness: 3,
                overlayLevel: 2
              });
            }}
            className="w-full py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#2A3854] text-xs font-mono text-slate-300 transition-colors"
          >
            기본 권장 프로필로 초기화
          </button>
        </div>

      </div>
    </div>
  );
};
