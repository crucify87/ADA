import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  Flame, 
  Check, 
  Layers, 
  Clock, 
  SlidersHorizontal,
  FolderSync
} from 'lucide-react';
import { GameItem, TelemetryState, NotificationItem, FriendItem, HubSettings } from './types';
import { INITIAL_GAMES, INITIAL_FRIENDS, INITIAL_NOTIFICATIONS } from './data/mockGames';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { SpotlightHero } from './components/SpotlightHero';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { GameRunningOverlay } from './components/GameRunningOverlay';
import { DownloadsView } from './components/DownloadsView';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { FriendsView } from './components/FriendsView';
import { StoreView } from './components/StoreView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // --- Core State ---
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [friends, setFriends] = useState<FriendItem[]>(INITIAL_FRIENDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [telemetry, setTelemetry] = useState<TelemetryState>({
    fps: 60,
    fpsLimit: 60,
    tdpWatt: 15,
    batteryPct: 84,
    isCharging: true,
    fanRpm: 3200,
    gpuTemp: 64,
    cpuUsage: 42,
    ramUsageGb: 9.8,
    wifiLatencyMs: 18,
    fsrSharpness: 3,
    overlayLevel: 2
  });

  const [settings, setSettings] = useState<HubSettings>({
    language: 'ko',
    autoUpdate: true,
    cloudSaves: true,
    hapticFeedback: true,
    audioVolume: 75,
    screenBrightness: 80,
    performanceProfile: 'balanced',
    deckGamepadLayout: 'standard'
  });

  // Navigation & View Mode
  const [activeSection, setActiveSection] = useState<'library' | 'store' | 'downloads' | 'hardware' | 'friends' | 'settings'>('library');
  const [viewMode, setViewMode] = useState<'desktop' | 'deck'>('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'installed' | 'action' | 'cyberpunk' | 'indie' | 'tools' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'playtime' | 'title' | 'score'>('recent');

  // Modals & Overlays
  const [selectedGameForModal, setSelectedGameForModal] = useState<GameItem | null>(null);
  const [runningGameId, setRunningGameId] = useState<string>('cyberpunk-2077');
  const [isGameOverlayOpen, setIsGameOverlayOpen] = useState<boolean>(false);
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState<boolean>(false);
  const [isFriendsDrawerOpen, setIsFriendsDrawerOpen] = useState<boolean>(false);
  const [featuredGameId, setFeaturedGameId] = useState<string>('cyberpunk-2077');

  const runningGame = useMemo(() => {
    return games.find(g => g.id === runningGameId && g.status === 'RUNNING') || null;
  }, [games, runningGameId]);

  const featuredGame = useMemo(() => {
    return games.find(g => g.id === featuredGameId) || games[0];
  }, [games, featuredGameId]);

  // --- Handlers ---
  const handleLaunchGame = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, status: 'RUNNING', lastPlayed: '방금 전 (실행 중)' };
      }
      return g;
    }));
    setRunningGameId(gameId);
    setIsGameOverlayOpen(true);
  };

  const handleStopGame = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, status: 'INSTALLED', lastPlayed: '방금 전' };
      }
      return g;
    }));
    if (runningGameId === gameId) {
      setRunningGameId('');
    }
    setIsGameOverlayOpen(false);
  };

  const handleInstallOrUpdate = (gameId: string) => {
    const target = games.find(g => g.id === gameId);
    if (!target) return;

    // Start animated download simulation
    let progress = 10;
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { 
          ...g, 
          status: 'NOT_INSTALLED', 
          downloadProgress: 10,
          downloadSpeed: '82.4 MB/s' 
        };
      }
      return g;
    }));

    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setGames(prev => prev.map(g => {
          if (g.id === gameId) {
            return {
              ...g,
              status: 'INSTALLED',
              downloadProgress: undefined,
              downloadSpeed: undefined,
              lastPlayed: '최근 설치됨'
            };
          }
          return g;
        }));

        setNotifications(prev => [
          {
            id: `n-${Date.now()}`,
            title: `${target.title} 설치 완료`,
            detail: '게임 파일 무결성 확인 및 셰이더 프리캐시 완료. 지금 바로 플레이할 수 있습니다.',
            time: '방금 전',
            type: 'download',
            unread: true
          },
          ...prev
        ]);
      } else {
        setGames(prev => prev.map(g => {
          if (g.id === gameId) {
            return { ...g, downloadProgress: progress };
          }
          return g;
        }));
      }
    }, 400);
  };

  const handleCancelDownload = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          status: 'NOT_INSTALLED',
          downloadProgress: 0,
          downloadSpeed: undefined
        };
      }
      return g;
    }));
  };

  const handleToggleFavorite = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, isFavorite: !g.isFavorite };
      }
      return g;
    }));
  };

  const handleToggleFpsLimit = () => {
    const limits = [30, 40, 60, 0];
    const currentIndex = limits.indexOf(telemetry.fpsLimit);
    const nextLimit = limits[(currentIndex + 1) % limits.length];
    setTelemetry(prev => ({ ...prev, fpsLimit: nextLimit }));
  };

  const handleAddToLibrary = (storeItem: any) => {
    const newGame: GameItem = {
      id: `game-${storeItem.id}`,
      title: storeItem.title,
      tagline: storeItem.tagline,
      genre: storeItem.genre as any,
      status: 'NOT_INSTALLED',
      installSize: '42.5 GB',
      playtimeHours: 0,
      lastPlayed: '플레이 기록 없음',
      metascore: storeItem.rating,
      achievements: { unlocked: 0, total: 35 },
      tags: storeItem.tags,
      description: storeItem.tagline,
      developer: 'CyberDeck Store Partner',
      releaseDate: '2024.11',
      isFavorite: false,
      themeColor: storeItem.color,
      accentGradient: 'from-cyan-600/20 to-[#0B0F19]',
      iconName: 'Gamepad2',
      cloudSyncStatus: 'synced',
      systemReq: {
        gpu: 'Deck RDNA 2 / GTX 1660',
        cpu: 'Quad Core x86',
        storage: '45 GB SSD'
      }
    };

    setGames(prev => [newGame, ...prev]);
    setActiveSection('library');
  };

  // --- Filtering & Sorting ---
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesTag = game.tags.some(t => t.toLowerCase().includes(q));
        const matchesDev = game.developer.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTag && !matchesDev) return false;
      }

      // Category matching
      if (categoryFilter === 'installed') {
        return game.status === 'INSTALLED' || game.status === 'RUNNING';
      }
      if (categoryFilter === 'action') {
        return game.genre === 'Action RPG' || game.genre === 'Tactical';
      }
      if (categoryFilter === 'cyberpunk') {
        return game.genre === 'Cyberpunk';
      }
      if (categoryFilter === 'indie') {
        return game.genre === 'Indie';
      }
      if (categoryFilter === 'tools') {
        return game.genre === 'Tools';
      }
      if (categoryFilter === 'favorites') {
        return game.isFavorite;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        if (a.status === 'RUNNING') return -1;
        if (b.status === 'RUNNING') return 1;
        return b.playtimeHours - a.playtimeHours;
      }
      if (sortBy === 'playtime') {
        return b.playtimeHours - a.playtimeHours;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'score') {
        return b.metascore - a.metascore;
      }
      return 0;
    });
  }, [games, searchQuery, categoryFilter, sortBy]);

  const installedCount = games.filter(g => g.status === 'INSTALLED' || g.status === 'RUNNING').length;
  const activeDownloadsCount = games.filter(g => g.downloadProgress && g.downloadProgress > 0).length;
  const onlineFriendsCount = friends.filter(f => f.status === 'online' || f.status === 'in-game').length;

  return (
    <div className={`min-h-screen bg-[#0B0F19] text-[#dfe2f1] flex flex-col ${viewMode === 'deck' ? 'deck-handheld-view' : ''}`}>
      
      {/* 1. TOP BAR */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => prev === 'desktop' ? 'deck' : 'desktop')}
        telemetry={telemetry}
        notifications={notifications}
        onDismissNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onClearAllNotifications={() => setNotifications([])}
        onOpenTelemetry={() => setIsTelemetryDrawerOpen(true)}
        onOpenFriends={() => setActiveSection('friends')}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        onlineFriendsCount={onlineFriendsCount}
      />

      {/* 2. BODY LAYOUT (Sidebar + Main Content Area) */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto">
        
        {/* SIDEBAR (Responsive Navigation Rail) */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          installedCount={installedCount}
          activeDownloadsCount={activeDownloadsCount}
          onlineFriendsCount={onlineFriendsCount}
        />

        {/* MAIN VIEWPORT CONTAINER */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 pb-24 md:pb-16 overflow-x-hidden">
          
          {/* SECTION: LIBRARY (Default Game Library View) */}
          {activeSection === 'library' && (
            <div className="space-y-6">
              
              {/* Spotlight Hero Banner (Featured Game Showcase) */}
              <SpotlightHero
                featuredGame={featuredGame}
                allFeatured={games.slice(0, 4)}
                onSelectFeatured={(g) => setFeaturedGameId(g.id)}
                onLaunch={handleLaunchGame}
                onOpenDetails={(g) => setSelectedGameForModal(g)}
              />

              {/* Filter Tabs & Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131B2E] border border-[#2A3854] rounded-2xl p-3 sm:p-4 shadow-md">
                
                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                  {[
                    { id: 'all', label: '전체 타이틀' },
                    { id: 'installed', label: '설치됨' },
                    { id: 'favorites', label: '즐겨찾기' },
                    { id: 'action', label: '액션 RPG' },
                    { id: 'cyberpunk', label: '사이버펑크' },
                    { id: 'indie', label: '인디' },
                    { id: 'tools', label: '도구 & 유틸' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCategoryFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-headline font-semibold transition-all shrink-0 min-h-[36px] ${
                        categoryFilter === tab.id
                          ? 'bg-[#00D2FF] text-[#07101E] shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                          : 'bg-[#1E293B] text-slate-300 hover:text-white border border-[#2A3854]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">정렬:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#1E293B] border border-[#2A3854] text-xs font-mono text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00D2FF]"
                  >
                    <option value="recent">최근 플레이 순</option>
                    <option value="playtime">플레이 시간 많은 순</option>
                    <option value="title">이름순 (A-Z)</option>
                    <option value="score">메타크리틱 점수순</option>
                  </select>
                </div>
              </div>

              {/* Games Grid (Fluid Responsive Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <span>게임 라이브러리</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00D2FF]/15 text-[#00D2FF]">
                      {filteredGames.length}개
                    </span>
                  </h3>
                </div>

                {filteredGames.length === 0 ? (
                  <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-10 text-center">
                    <p className="text-slate-400 text-sm font-mono">
                      검색 조건에 맞는 게임이 없습니다.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('all');
                      }}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs"
                    >
                      필터 초기화
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onSelect={(g) => setSelectedGameForModal(g)}
                        onLaunch={handleLaunchGame}
                        onInstallOrUpdate={handleInstallOrUpdate}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* SECTION: STORE */}
          {activeSection === 'store' && (
            <StoreView
              onAddToLibrary={handleAddToLibrary}
              ownedGameIds={games.map(g => g.id)}
            />
          )}

          {/* SECTION: DOWNLOADS */}
          {activeSection === 'downloads' && (
            <DownloadsView
              games={games}
              onCancelDownload={handleCancelDownload}
              onLaunchGame={handleLaunchGame}
            />
          )}

          {/* SECTION: HARDWARE TELEMETRY */}
          {activeSection === 'hardware' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-6 shadow-xl">
                <h2 className="font-headline font-bold text-2xl text-white flex items-center gap-2.5">
                  <SlidersHorizontal className="w-6 h-6 text-[#00D2FF]" />
                  실시간 덱 APU & 성능 컨트롤
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  배터리 수명 및 프레임 레이트 밸런싱을 위한 하드웨어 직접 제어
                </p>
              </div>

              {/* Quick Launch Drawer Button */}
              <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl p-6 text-center space-y-4">
                <p className="text-sm text-slate-300">
                  인게임 오버레이 및 세부 전력 튜닝 패널을 호출하여 TDP와 FSR 선명도를 조정하십시오.
                </p>
                <button
                  onClick={() => setIsTelemetryDrawerOpen(true)}
                  className="px-6 py-3 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:bg-[#a5e7ff] transition-all"
                >
                  하드웨어 오버레이 패널 열기
                </button>
              </div>
            </div>
          )}

          {/* SECTION: FRIENDS & COMMUNITY */}
          {activeSection === 'friends' && (
            <FriendsView
              friends={friends}
              onJoinFriendGame={(gameTitle) => {
                const target = games.find(g => g.title.toLowerCase().includes(gameTitle.toLowerCase()));
                if (target) {
                  handleLaunchGame(target.id);
                } else {
                  alert(`'${gameTitle}' 게임 세션에 참가 요청을 전송했습니다.`);
                }
              }}
            />
          )}

          {/* SECTION: SETTINGS */}
          {activeSection === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(updated) => setSettings(prev => ({ ...prev, ...updated }))}
            />
          )}

        </main>
      </div>

      {/* 3. BOTTOM BAR (Desktop Dock + Mobile Bottom Navigation) */}
      <BottomBar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        runningGame={runningGame}
        onOpenRunningOverlay={() => setIsGameOverlayOpen(true)}
        onStopGame={handleStopGame}
        telemetry={telemetry}
        onToggleFpsLimit={handleToggleFpsLimit}
        onOpenTelemetry={() => setIsTelemetryDrawerOpen(true)}
      />

      {/* 4. MODALS & OVERLAYS */}
      {/* Game Details Modal */}
      <GameDetailModal
        game={selectedGameForModal}
        onClose={() => setSelectedGameForModal(null)}
        onLaunch={handleLaunchGame}
        onStop={handleStopGame}
        onInstallOrUpdate={handleInstallOrUpdate}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Full Simulated In-Game Running HUD Overlay */}
      {isGameOverlayOpen && runningGame && (
        <GameRunningOverlay
          game={runningGame}
          telemetry={telemetry}
          onCloseOverlay={() => setIsGameOverlayOpen(false)}
          onQuitGame={(id) => handleStopGame(id)}
          onOpenTelemetryDrawer={() => setIsTelemetryDrawerOpen(true)}
        />
      )}

      {/* Hardware Telemetry Drawer */}
      <TelemetryDrawer
        isOpen={isTelemetryDrawerOpen}
        onClose={() => setIsTelemetryDrawerOpen(false)}
        telemetry={telemetry}
        onUpdateTelemetry={(updated) => setTelemetry(prev => ({ ...prev, ...updated }))}
      />

    </div>
  );
}
