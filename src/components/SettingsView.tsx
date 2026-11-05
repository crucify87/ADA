import React, { useState } from 'react';
import { 
  Settings, 
  Monitor, 
  Volume2, 
  Cloud, 
  Gamepad2, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Globe 
} from 'lucide-react';
import { HubSettings } from '../types';

interface Props {
  settings: HubSettings;
  onUpdateSettings: (updated: Partial<HubSettings>) => void;
}

export const SettingsView: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [syncedMsg, setSyncedMsg] = useState(false);

  const handleSyncCloud = () => {
    setSyncedMsg(true);
    setTimeout(() => setSyncedMsg(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-6 shadow-xl">
        <h2 className="font-headline font-bold text-2xl text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#00D2FF]" />
          시스템 및 하드웨어 환경설정
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          CyberDeck OS v3.8.2 · 커스텀 리눅스 게이밍 런타임
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        
        {/* 1. General & Language */}
        <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-5 space-y-4">
          <h3 className="font-headline font-bold text-sm text-[#00D2FF] uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" /> 일반 & 인터페이스 언어
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-[#2A3854]/60">
            <div>
              <div className="text-sm font-semibold text-white">표시 언어 (Interface Language)</div>
              <div className="text-xs text-slate-400">UI 레이블 및 텔레메트리 텍스트 언어</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSettings({ language: 'ko' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  settings.language === 'ko'
                    ? 'bg-[#00D2FF] text-[#07101E] border-[#00D2FF]'
                    : 'bg-[#1E293B] text-slate-300 border-[#2A3854]'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  settings.language === 'en'
                    ? 'bg-[#00D2FF] text-[#07101E] border-[#00D2FF]'
                    : 'bg-[#1E293B] text-slate-300 border-[#2A3854]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-semibold text-white">백그라운드 자동 업데이트</div>
              <div className="text-xs text-slate-400">유휴 시간에 최신 게임 패치 및 셰이더 캐시 자동 수신</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoUpdate}
              onChange={(e) => onUpdateSettings({ autoUpdate: e.target.checked })}
              className="accent-[#00D2FF] w-5 h-5 cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Cloud Saves & Synchronization */}
        <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-5 space-y-4">
          <h3 className="font-headline font-bold text-sm text-[#A855F7] uppercase tracking-wider flex items-center gap-2">
            <Cloud className="w-4 h-4" /> 클라우드 세이브 동기화
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-[#2A3854]/60">
            <div>
              <div className="text-sm font-semibold text-white">클라우드 세이브 자동 백업</div>
              <div className="text-xs text-slate-400">PC 및 핸드헬드 덱 간의 세이브 파일 실시간 연동</div>
            </div>
            <input
              type="checkbox"
              checked={settings.cloudSaves}
              onChange={(e) => onUpdateSettings({ cloudSaves: e.target.checked })}
              className="accent-[#A855F7] w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-semibold text-white">수동 세이브 동기화 실행</div>
              <div className="text-xs text-slate-400">로컬 세이브 파일과 클라우드 저장소 간의 무결성 검사</div>
            </div>
            <button
              onClick={handleSyncCloud}
              className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#262a35] text-slate-200 border border-[#2A3854] text-xs font-mono flex items-center gap-2"
            >
              {syncedMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <RotateCcw className="w-4 h-4 text-[#A855F7]" />}
              {syncedMsg ? '동기화 완료됨!' : '지금 즉시 동기화'}
            </button>
          </div>
        </div>

        {/* 3. Audio & Haptics */}
        <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-5 space-y-4">
          <h3 className="font-headline font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" /> 컨트롤러 및 햅틱 진동
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-[#2A3854]/60">
            <div>
              <div className="text-sm font-semibold text-white">핸드헬드 햅틱 피드백</div>
              <div className="text-xs text-slate-400">트랙패드 및 버튼 조작 시 촉각 진동 활성화</div>
            </div>
            <input
              type="checkbox"
              checked={settings.hapticFeedback}
              onChange={(e) => onUpdateSettings({ hapticFeedback: e.target.checked })}
              className="accent-emerald-400 w-5 h-5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>시스템 오디오 볼륨</span>
              <span className="text-[#00D2FF] font-bold">{settings.audioVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.audioVolume}
              onChange={(e) => onUpdateSettings({ audioVolume: Number(e.target.value) })}
              className="w-full accent-[#00D2FF]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
