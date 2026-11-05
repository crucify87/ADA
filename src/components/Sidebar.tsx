import React from 'react';
import { 
  Gamepad2, 
  ShoppingBag, 
  Download, 
  Cpu, 
  Users, 
  Settings, 
  HardDrive, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface Props {
  activeSection: 'library' | 'store' | 'downloads' | 'hardware' | 'friends' | 'settings';
  onSelectSection: (section: 'library' | 'store' | 'downloads' | 'hardware' | 'friends' | 'settings') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  installedCount: number;
  activeDownloadsCount: number;
  onlineFriendsCount: number;
}

interface NavItem {
  id: 'library' | 'store' | 'downloads' | 'hardware' | 'friends' | 'settings';
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  installedCount,
  activeDownloadsCount,
  onlineFriendsCount
}) => {
  const navItems: NavItem[] = [
    {
      id: 'library',
      label: '라이브러리',
      sub: 'My Games',
      icon: Gamepad2,
      badge: installedCount > 0 ? installedCount : undefined,
      badgeColor: 'bg-[#1E293B] text-slate-300'
    },
    {
      id: 'store',
      label: '스토어 & 신작',
      sub: 'Discover',
      icon: ShoppingBag,
      badge: 'HOT',
      badgeColor: 'bg-[#A855F7]/20 text-[#edd4ff]'
    },
    {
      id: 'downloads',
      label: '다운로드 매니저',
      sub: 'Updates',
      icon: Download,
      badge: activeDownloadsCount > 0 ? `${activeDownloadsCount}` : undefined,
      badgeColor: 'bg-[#00D2FF]/20 text-[#00D2FF]'
    },
    {
      id: 'hardware',
      label: '성능 튜닝 & TDP',
      sub: 'Telemetry',
      icon: Cpu,
      badge: '60 FPS',
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      id: 'friends',
      label: '친구 & 커뮤니티',
      sub: 'Community',
      icon: Users,
      badge: onlineFriendsCount > 0 ? `${onlineFriendsCount}` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'settings',
      label: '시스템 설정',
      sub: 'Preferences',
      icon: Settings
    }
  ];

  const handleItemClick = (id: typeof activeSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 md:top-[57px] left-0 z-50 md:z-30 h-screen md:h-[calc(100vh-57px)] bg-[#0f131d] border-r border-[#2A3854]/60 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Section Header / Collapse Button */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#2A3854]/40">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00D2FF] uppercase">
                  DECK NAVIGATION
                </span>
              </div>
            )}
            
            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className={`hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] border border-transparent hover:border-[#2A3854] transition-colors ${
                collapsed ? 'mx-auto' : ''
              }`}
              title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 relative group min-h-[44px] ${
                    isActive 
                      ? 'bg-[#131B2E] text-white shadow-[0_0_15px_rgba(0,210,255,0.15)] border border-[#00D2FF]/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/60 border border-transparent'
                  }`}
                  title={item.label}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#00D2FF] rounded-r-full shadow-[0_0_8px_#00D2FF]" />
                  )}

                  <div className={`shrink-0 p-1.5 rounded-lg transition-transform group-hover:scale-105 ${
                    isActive ? 'bg-[#00D2FF]/15 text-[#00D2FF]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {!collapsed && (
                    <div className="flex-1 text-left flex items-center justify-between overflow-hidden">
                      <div className="truncate">
                        <span className={`block font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono -mt-0.5 block">
                          {item.sub}
                        </span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tooltip on Collapsed Mode */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1E293B] border border-[#2A3854] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Storage & Quick Status */}
        <div className="p-3 border-t border-[#2A3854]/40 bg-[#0a0e18]/40">
          {!collapsed ? (
            <div className="bg-[#131B2E] border border-[#2A3854] rounded-xl p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                  <HardDrive className="w-3.5 h-3.5 text-[#00D2FF]" /> NVMe SSD
                </span>
                <span className="text-[11px] font-mono font-bold text-[#00D2FF]">412 GB 여유</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00D2FF] to-[#A855F7] rounded-full"
                  style={{ width: '58%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>사용 중 588 GB</span>
                <span>총 1.0 TB</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2 text-slate-400" title="NVMe SSD: 412 GB 여유">
              <HardDrive className="w-5 h-5 text-[#00D2FF]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
