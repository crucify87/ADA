export type GameStatus = 'RUNNING' | 'INSTALLED' | 'UPDATE_AVAILABLE' | 'NOT_INSTALLED';

export interface GameItem {
  id: string;
  title: string;
  tagline: string;
  genre: 'Action RPG' | 'Cyberpunk' | 'Sci-Fi Sim' | 'Indie' | 'Tactical' | 'Tools';
  status: GameStatus;
  downloadProgress?: number; // 0 - 100
  downloadSpeed?: string; // e.g. "84.2 MB/s"
  installSize: string;
  playtimeHours: number;
  lastPlayed: string;
  metascore: number;
  achievements: {
    unlocked: number;
    total: number;
  };
  tags: string[];
  description: string;
  developer: string;
  releaseDate: string;
  isFavorite: boolean;
  themeColor: string;
  accentGradient: string;
  iconName: string;
  heroBadge?: string;
  cloudSyncStatus: 'synced' | 'syncing' | 'error';
  systemReq: {
    gpu: string;
    cpu: string;
    storage: string;
  };
}

export interface TelemetryState {
  fps: number;
  fpsLimit: number;
  tdpWatt: number;
  batteryPct: number;
  isCharging: boolean;
  fanRpm: number;
  gpuTemp: number;
  cpuUsage: number;
  ramUsageGb: number;
  wifiLatencyMs: number;
  fsrSharpness: number;
  overlayLevel: 1 | 2 | 3 | 4;
}

export interface FriendItem {
  id: string;
  name: string;
  status: 'online' | 'in-game' | 'away' | 'offline';
  gameTitle?: string;
  avatarLetter: string;
  avatarColor: string;
  timeInGame?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'update' | 'achievement' | 'download' | 'friend';
  unread: boolean;
}

export interface HubSettings {
  language: 'ko' | 'en';
  autoUpdate: boolean;
  cloudSaves: boolean;
  hapticFeedback: boolean;
  audioVolume: number;
  screenBrightness: number;
  performanceProfile: 'balanced' | 'performance' | 'battery_saver';
  deckGamepadLayout: 'standard' | 'fps' | 'retro';
}
