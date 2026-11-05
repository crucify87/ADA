import React, { useState } from 'react';
import { 
  Search, 
  X, 
  BatteryCharging, 
  Wifi, 
  Bell, 
  Users, 
  Sliders, 
  Monitor, 
  Gamepad2, 
  Menu, 
  Check, 
  CloudCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { NotificationItem, TelemetryState } from '../types';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'desktop' | 'deck';
  onToggleViewMode: () => void;
  telemetry: TelemetryState;
  notifications: NotificationItem[];
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenTelemetry: () => void;
  onOpenFriends: () => void;
  onToggleMobileMenu: () => void;
  onlineFriendsCount: number;
}

export const TopBar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  telemetry,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  onOpenTelemetry,
  onOpenFriends,
  onToggleMobileMenu,
  onlineFriendsCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [wifiPing, setWifiPing] = useState(telemetry.wifiLatencyMs);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleWifiTest = () => {
    // Quick interactive simulated ping test
    const newPing = Math.floor(Math.random() * 12) + 12;
    setWifiPing(newPing);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f131d]/90 backdrop-blur-md border-b border-[#2A3854]/60 px-3 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1600px] mx-auto">
        
        {/* Left: Mobile Menu Trigger + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1E293B] active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="메뉴 열기"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#00D2FF]" />
          </button>

          <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={() => onSearchChange('')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0053db] to-[#00D2FF] flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(0,210,255,0.4)]">
              <Gamepad2 className="w-full h-full text-[#07101E]" />
            </div>
            <div className="hidden xs:flex flex-col">
              <span className="font-headline font-bold text-base tracking-wider text-white leading-tight flex items-center gap-1.5">
                CYBERDECK
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#00D2FF]/15 text-[#00D2FF] rounded border border-[#00D2FF]/30">HUB</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">TACTICAL COMMAND</span>
            </div>
          </div>
        </div>

        {/* Center: Live Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="게임, 앱 또는 도구 검색..."
              className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm bg-[#131B2E] border border-[#2A3854] rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-white"
                title="검색어 지우기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Mode Switch, Telemetry & Interactive Control Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* PC / Deck View Mode Switcher Button */}
          <button
            onClick={onToggleViewMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border min-h-[38px] ${
              viewMode === 'deck'
                ? 'bg-[#00D2FF]/15 text-[#00D2FF] border-[#00D2FF]/40 shadow-[0_0_10px_rgba(0,210,255,0.2)]'
                : 'bg-[#131B2E] text-slate-300 border-[#2A3854] hover:border-slate-500'
            }`}
            title="화면 보기 모드 변경 (PC 모드 ↔ 핸드헬드 덱 모드)"
          >
            {viewMode === 'deck' ? (
              <>
                <Gamepad2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span className="hidden sm:inline font-bold">DECK MODE</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">PC MODE</span>
              </>
            )}
          </button>

          {/* Wi-Fi Ping Telemetry Button */}
          <button
            onClick={handleWifiTest}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#131B2E] border border-[#2A3854] text-[11px] font-mono text-emerald-400 hover:border-emerald-500/50 transition-colors"
            title="네트워크 핑 테스트 실행"
          >
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>{wifiPing}ms</span>
          </button>

          {/* Battery Telemetry Button */}
          <button
            onClick={onOpenTelemetry}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#131B2E] border border-[#2A3854] text-[11px] font-mono text-slate-300 hover:border-[#00D2FF]/40 transition-colors"
            title="하드웨어 성능 튜닝 패널 열기"
          >
            <BatteryCharging className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>{telemetry.batteryPct}%</span>
          </button>

          {/* Hardware Quick Access Trigger Button */}
          <button
            onClick={onOpenTelemetry}
            className="p-2 rounded-lg bg-[#131B2E] border border-[#2A3854] text-slate-300 hover:text-[#00D2FF] hover:border-[#00D2FF]/50 transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="TDP / FPS 하드웨어 오버레이 설정"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Friends Quick Panel Trigger */}
          <button
            onClick={onOpenFriends}
            className="relative p-2 rounded-lg bg-[#131B2E] border border-[#2A3854] text-slate-300 hover:text-white hover:border-[#2563EB] transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="친구 및 접속 상태 열기"
          >
            <Users className="w-4 h-4" />
            {onlineFriendsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-[10px] font-bold text-slate-950 rounded-full flex items-center justify-center border border-[#0B0F19]">
                {onlineFriendsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-[#131B2E] border border-[#2A3854] text-slate-300 hover:text-white hover:border-[#A855F7] transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="알림 센터"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A855F7] text-[10px] font-bold text-white rounded-full flex items-center justify-center border border-[#0B0F19] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Modal */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131B2E] border border-[#2A3854] rounded-xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-sm text-white">알림 센터</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#A855F7]/20 text-[#dab1ff] rounded">
                        {unreadCount}개 신규
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-[#00D2FF] transition-colors"
                    >
                      모두 지우기
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      새로운 알림이 없습니다.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-2.5 rounded-lg border transition-all ${
                          item.unread 
                            ? 'bg-[#1E293B] border-[#00D2FF]/30' 
                            : 'bg-[#171b26] border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-white">{item.title}</span>
                          <button
                            onClick={() => onDismissNotification(item.id)}
                            className="text-slate-400 hover:text-slate-200"
                            title="알림 삭제"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {item.detail}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">
                          {item.time}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-lg bg-[#131B2E] border border-[#2A3854] hover:border-[#00D2FF]/60 transition-all min-h-[38px]"
              title="사용자 프로필 메뉴"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                V
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-slate-200">CyberPilot</span>
              <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00D2FF]/15 text-[#00D2FF]">
                LV.48
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#131B2E] border border-[#2A3854] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-700/60">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-sm text-white">
                    V
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">CyberPilot</div>
                    <div className="text-[11px] font-mono text-[#00D2FF]">CyberDeck Founder · LV.48</div>
                  </div>
                </div>

                <div className="py-2.5 space-y-1 text-xs text-slate-300 border-b border-slate-700/60">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">지갑 잔액:</span>
                    <span className="font-mono font-bold text-emerald-400">₩ 48,500</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">보유 타이틀:</span>
                    <span className="font-mono">42개</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">클라우드 세이브:</span>
                    <span className="font-mono text-[#00D2FF] flex items-center gap-1">
                      <Check className="w-3 h-3" /> 정상 동기화됨
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenTelemetry();
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-[#1E293B] hover:text-[#00D2FF] rounded transition-colors"
                  >
                    덱 하드웨어 상태 보기
                  </button>
                  <button 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-400 hover:bg-[#1E293B] hover:text-white rounded transition-colors"
                  >
                    프로필 설정 및 배지 관리
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
