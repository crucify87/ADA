import { GameItem, FriendItem, NotificationItem } from '../types';

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    tagline: 'Phantom Liberty Expansion · Night City Chronicles',
    genre: 'Cyberpunk',
    status: 'RUNNING',
    installSize: '68.4 GB',
    playtimeHours: 124.6,
    lastPlayed: '방금 전 (실행 중)',
    metascore: 92,
    achievements: { unlocked: 38, total: 44 },
    tags: ['Cyberpunk', 'Open World', 'Ray Tracing', 'RPG'],
    description: '황폐한 거대 도시 나이트 시티의 용병 V가 되어 권력, 화려함, 신체 개조에 사로잡힌 위험천만한 첩보 스릴러의 세계로 뛰어드십시오.',
    developer: 'CD PROJEKT RED',
    releaseDate: '2023.09.26',
    isFavorite: true,
    themeColor: '#00D2FF',
    accentGradient: 'from-cyan-500/20 via-sky-600/30 to-[#0B0F19]',
    iconName: 'Zap',
    heroBadge: 'NOW RUNNING · 60 FPS',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'RTX 3070 / RDNA 2 Custom Deck',
      cpu: 'Ryzen 7 7800X3D / Zen 2 Quad',
      storage: 'NVMe SSD 70 GB'
    }
  },
  {
    id: 'armored-core-vi',
    title: 'ARMORED CORE VI',
    tagline: 'FIRES OF RUBICON · High-Speed Mecha Action',
    genre: 'Action RPG',
    status: 'INSTALLED',
    installSize: '62.1 GB',
    playtimeHours: 78.2,
    lastPlayed: '어제',
    metascore: 88,
    achievements: { unlocked: 26, total: 30 },
    tags: ['Mecha', 'Action', 'Customization', 'Sci-Fi'],
    description: '루비콘 3 행성에서 펼쳐지는 파괴적인 기계 전쟁. 메카의 각 부품을 조립해 전방위 3D 기동을 구사하여 강적들을 격파하십시오.',
    developer: 'FromSoftware Inc.',
    releaseDate: '2023.08.25',
    isFavorite: true,
    themeColor: '#EF4444',
    accentGradient: 'from-red-600/20 via-amber-700/20 to-[#0B0F19]',
    iconName: 'Shield',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'GeForce GTX 1060 / Radeon RX 580',
      cpu: 'Intel Core i7-4790K / AMD Ryzen 5',
      storage: '65 GB SSD'
    }
  },
  {
    id: 'hades-2',
    title: 'HADES II',
    tagline: 'God of the Underworld · Rogue-like Dungeon Crawler',
    genre: 'Indie',
    status: 'UPDATE_AVAILABLE',
    installSize: '9.8 GB',
    playtimeHours: 46.9,
    lastPlayed: '3일 전',
    metascore: 94,
    achievements: { unlocked: 19, total: 32 },
    tags: ['Roguelike', 'Mythology', 'Hack and Slash', 'Deck Verified'],
    description: '지하세계를 탈출해 시간을 초월한 타이탄 크로노스에 맞서십시오. 올림포스의 모든 신들의 축복을 받아 펼치는 마법과 전투.',
    developer: 'Supergiant Games',
    releaseDate: '2024.05.06',
    isFavorite: true,
    themeColor: '#A855F7',
    accentGradient: 'from-purple-600/20 via-indigo-700/20 to-[#0B0F19]',
    iconName: 'Flame',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'DirectX 12 Compatible 2GB VRAM',
      cpu: 'Dual Core 2.4 GHz',
      storage: '10 GB High-Speed'
    }
  },
  {
    id: 'system-shock',
    title: 'SYSTEM SHOCK',
    tagline: 'Citadel Station Remake · SHODAN Cyber-Horror',
    genre: 'Cyberpunk',
    status: 'INSTALLED',
    installSize: '21.5 GB',
    playtimeHours: 23.4,
    lastPlayed: '5일 전',
    metascore: 85,
    achievements: { unlocked: 12, total: 40 },
    tags: ['Immersive Sim', 'Cyberpunk', 'Classic Remake', 'Sci-Fi'],
    description: '시타델 우주 정거장을 지배한 미치광이 인공지능 SHODAN을 저지하기 위한 사이버네틱스 해커의 사투.',
    developer: 'Nightdive Studios',
    releaseDate: '2023.05.30',
    isFavorite: false,
    themeColor: '#10B981',
    accentGradient: 'from-emerald-600/20 via-teal-700/20 to-[#0B0F19]',
    iconName: 'Terminal',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'GTX 970 4GB / RX 480 4GB',
      cpu: 'Intel i5-2400 / AMD FX-8320',
      storage: '25 GB SSD'
    }
  },
  {
    id: 'ghostrunner-2',
    title: 'GHOSTRUNNER 2',
    tagline: 'Hardcore First-Person Cyber-Slasher',
    genre: 'Action RPG',
    status: 'NOT_INSTALLED',
    downloadProgress: 0,
    installSize: '65.0 GB',
    playtimeHours: 0,
    lastPlayed: '플레이 기록 없음',
    metascore: 82,
    achievements: { unlocked: 0, total: 34 },
    tags: ['Fast-Paced', 'Cyberpunk', 'Swordplay', 'Motorcycle'],
    description: '인류의 마지막 피난처 다르마 타워 너머의 황무지를 가르는 사이버 닌자 잭의 신속무쌍한 칼부림과 하이 스피드 바이크 액션.',
    developer: 'One More Level',
    releaseDate: '2023.10.26',
    isFavorite: false,
    themeColor: '#F59E0B',
    accentGradient: 'from-amber-600/20 via-orange-700/20 to-[#0B0F19]',
    iconName: 'Sword',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'RTX 2070 / RX 5700 XT',
      cpu: 'Intel Core i7-6700K / Ryzen 5 2600X',
      storage: '65 GB SSD'
    }
  },
  {
    id: 'dead-cells',
    title: 'DEAD CELLS',
    tagline: 'Return to Castlevania Edition',
    genre: 'Indie',
    status: 'INSTALLED',
    installSize: '4.8 GB',
    playtimeHours: 189.5,
    lastPlayed: '1주일 전',
    metascore: 91,
    achievements: { unlocked: 68, total: 72 },
    tags: ['Metroidvania', 'Souls-lite', 'Pixel Art', 'Controller Recommended'],
    description: '실패한 연금술 실험체가 되어 끊임없이 변화하는 거대한 성을 탐험하십시오. 영구적인 죽음은 없고, 오직 학습과 무기 업그레이드만 있을 뿐입니다.',
    developer: 'Motion Twin / Evil Empire',
    releaseDate: '2023.03.06',
    isFavorite: true,
    themeColor: '#38BDF8',
    accentGradient: 'from-blue-600/20 via-cyan-800/20 to-[#0B0F19]',
    iconName: 'Crosshair',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'Nvidia GTX 460 / Radeon HD 5750',
      cpu: 'Intel i5+ / AMD Phenom II',
      storage: '5 GB'
    }
  },
  {
    id: 'cyberdeck-tools',
    title: 'CyberDeck Pro Studio',
    tagline: 'Hardware Overclock & Emulator BIOS Suite',
    genre: 'Tools',
    status: 'INSTALLED',
    installSize: '1.2 GB',
    playtimeHours: 312.0,
    lastPlayed: '어제',
    metascore: 98,
    achievements: { unlocked: 15, total: 15 },
    tags: ['Telemetry', 'Overclocking', 'Emulator Manager', 'Deck Utility'],
    description: '핸드헬드 디바이스 및 PC의 TDP 제어, GPU 언더볼팅, 팬 커브 튜닝, 멀티 에뮬레이터 세이브 파일 싱크를 지원하는 올인원 파워 유저 툴킷.',
    developer: 'CyberDeck Core Labs',
    releaseDate: '2024.10.15',
    isFavorite: true,
    themeColor: '#00D2FF',
    accentGradient: 'from-cyan-600/20 via-indigo-900/30 to-[#0B0F19]',
    iconName: 'Cpu',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'DirectX 12 / Vulkan 1.3 Support',
      cpu: 'Any modern x86/ARM64 64-bit',
      storage: '2 GB'
    }
  },
  {
    id: 'starfield',
    title: 'STARFIELD',
    tagline: 'Shattered Space · Endless Galaxies',
    genre: 'Sci-Fi Sim',
    status: 'INSTALLED',
    installSize: '139.8 GB',
    playtimeHours: 64.3,
    lastPlayed: '2주 전',
    metascore: 84,
    achievements: { unlocked: 22, total: 50 },
    tags: ['Space', 'Exploration', 'Ship Builder', 'Sci-Fi'],
    description: '2330년, 태양계를 넘어 우주로 뻗어나간 인류. 희귀한 유물을 찾는 우주 탐사 조직 콘스텔레이션의 일원이 되어 1,000개 이상의 행성을 탐험하십시오.',
    developer: 'Bethesda Game Studios',
    releaseDate: '2023.09.06',
    isFavorite: false,
    themeColor: '#818CF8',
    accentGradient: 'from-indigo-600/20 via-sky-900/20 to-[#0B0F19]',
    iconName: 'Compass',
    cloudSyncStatus: 'synced',
    systemReq: {
      gpu: 'NVIDIA GeForce RTX 2080 / AMD RX 6800 XT',
      cpu: 'AMD Ryzen 5 3600X / Intel i5-10600K',
      storage: '140 GB SSD Essential'
    }
  }
];

export const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'f-1',
    name: 'Neo_K3',
    status: 'in-game',
    gameTitle: 'Cyberpunk 2077',
    avatarLetter: 'N',
    avatarColor: 'bg-cyan-500',
    timeInGame: '2시간째 플레이 중'
  },
  {
    id: 'f-2',
    name: 'Ghost_Pilot',
    status: 'in-game',
    gameTitle: 'ARMORED CORE VI',
    avatarLetter: 'G',
    avatarColor: 'bg-red-500',
    timeInGame: '루비콘 격전지 04'
  },
  {
    id: 'f-3',
    name: 'DeckMaster_KR',
    status: 'online',
    avatarLetter: 'D',
    avatarColor: 'bg-emerald-500'
  },
  {
    id: 'f-4',
    name: 'Sora_Chrono',
    status: 'away',
    avatarLetter: 'S',
    avatarColor: 'bg-amber-500'
  },
  {
    id: 'f-5',
    name: 'Valkyrie_99',
    status: 'offline',
    avatarLetter: 'V',
    avatarColor: 'bg-slate-600'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'HADES II 업데이트 준비 완료',
    detail: '패치 v1.04 성능 개선 및 덱 최적화 업데이트를 다운로드할 수 있습니다.',
    time: '10분 전',
    type: 'update',
    unread: true
  },
  {
    id: 'n-2',
    title: '도전 과제 달성!',
    detail: 'Cyberpunk 2077: "나이트 시티의 전설" 트로피를 획득했습니다.',
    time: '1시간 전',
    type: 'achievement',
    unread: true
  },
  {
    id: 'n-3',
    title: '클라우드 저장 데이터 동기화',
    detail: '모든 게임 세이브가 CyberDeck Cloud와 안전하게 동기화되었습니다.',
    time: '2시간 전',
    type: 'download',
    unread: false
  }
];
