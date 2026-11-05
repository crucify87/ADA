import React from 'react';
import { GameItem } from '../types';
import { 
  Zap, 
  Shield, 
  Flame, 
  Terminal, 
  Sword, 
  Crosshair, 
  Cpu, 
  Compass, 
  Gamepad2 
} from 'lucide-react';

interface Props {
  game: GameItem;
  className?: string;
  isHero?: boolean;
}

export const GameCoverArtwork: React.FC<Props> = ({ game, className = '', isHero = false }) => {
  const getIcon = () => {
    switch (game.iconName) {
      case 'Zap': return <Zap className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Shield': return <Shield className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Flame': return <Flame className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Terminal': return <Terminal className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Sword': return <Sword className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Crosshair': return <Crosshair className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Cpu': return <Cpu className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      case 'Compass': return <Compass className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
      default: return <Gamepad2 className={isHero ? "w-16 h-16" : "w-10 h-10"} />;
    }
  };

  return (
    <div 
      className={`relative overflow-hidden select-none bg-gradient-to-br ${game.accentGradient} flex flex-col justify-between p-4 ${className}`}
      style={{
        borderBottom: `2px solid ${game.themeColor}33`
      }}
    >
      {/* Background Cyber Grid lines */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, ${game.themeColor} 1px, transparent 1px), linear-gradient(to bottom, ${game.themeColor} 1px, transparent 1px)`,
          backgroundSize: isHero ? '36px 36px' : '20px 20px'
        }}
      />

      {/* Atmospheric ambient radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: game.themeColor }}
      />

      {/* Top watermark / genre */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-300/80 uppercase">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: game.themeColor }} />
          {game.genre}
        </span>
        <span className="text-[10px] opacity-70">METASCORE {game.metascore}</span>
      </div>

      {/* Central Emblem Art */}
      <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
        <div 
          className="p-3.5 rounded-2xl mb-3 shadow-lg transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
          style={{ 
            backgroundColor: `${game.themeColor}18`,
            border: `1px solid ${game.themeColor}40`,
            color: game.themeColor,
            boxShadow: `0 0 20px ${game.themeColor}22`
          }}
        >
          {getIcon()}
        </div>
        <div className="font-headline font-bold text-lg md:text-xl text-white tracking-wide drop-shadow-md">
          {game.title}
        </div>
        <div className="text-[11px] text-slate-400 font-normal line-clamp-1 max-w-[220px]">
          {game.tagline}
        </div>
      </div>

      {/* Bottom telemetry footer */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-700/40 text-[10px] font-mono text-slate-400">
        <span>{game.installSize}</span>
        <span>{game.playtimeHours > 0 ? `${game.playtimeHours}h PLAYED` : 'READY'}</span>
      </div>
    </div>
  );
};
