import React, { useState } from 'react';
import { ShoppingBag, Star, Sparkles, Tag, Check, Download, ShieldCheck } from 'lucide-react';
import { GameItem } from '../types';

interface StoreItem {
  id: string;
  title: string;
  genre: string;
  price: string;
  originalPrice?: string;
  discountPct?: number;
  rating: number;
  reviewsCount: string;
  deckRating: 'Verified' | 'Playable';
  tagline: string;
  tags: string[];
  color: string;
}

const STORE_CATALOG: StoreItem[] = [
  {
    id: 's-1',
    title: 'Elden Ring: Shadow of the Erdtree',
    genre: 'Action RPG',
    price: '₩ 49,800',
    originalPrice: '₩ 59,800',
    discountPct: 20,
    rating: 96,
    reviewsCount: '28,490개 (압도적으로 긍정적)',
    deckRating: 'Verified',
    tagline: '그림자의 땅에서 펼쳐지는 미켈라의 발자취와 전설의 무기들',
    tags: ['Souls-like', 'Dark Fantasy', 'Open World'],
    color: '#F59E0B'
  },
  {
    id: 's-2',
    title: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'Cyberpunk',
    price: '₩ 34,900',
    originalPrice: '₩ 42,000',
    discountPct: 25,
    rating: 92,
    reviewsCount: '84,120개 (매우 긍정적)',
    deckRating: 'Verified',
    tagline: '신규 도그타운 구역과 첩보 스릴러 메인 퀘스트',
    tags: ['Cyberpunk', 'Ray Tracing', 'Story Rich'],
    color: '#00D2FF'
  },
  {
    id: 's-3',
    title: 'Balatro: Poker Roguelike',
    genre: 'Indie',
    price: '₩ 16,500',
    rating: 97,
    reviewsCount: '49,200개 (압도적으로 긍정적)',
    deckRating: 'Verified',
    tagline: '불법 조커 카드를 조합해 포커 핸드를 폭발시키는 하이퍼 로그라이크',
    tags: ['Deckbuilder', 'Roguelike', 'Strategy'],
    color: '#EF4444'
  },
  {
    id: 's-4',
    title: 'Helldivers 2',
    genre: 'Tactical',
    price: '₩ 44,800',
    rating: 84,
    reviewsCount: '190,000개 (대체로 긍정적)',
    deckRating: 'Playable',
    tagline: '은하계의 자유와 민주주의를 전파하는 4인 협동 슈터',
    tags: ['Co-op', 'Shooter', 'Multiplayer'],
    color: '#38BDF8'
  }
];

interface Props {
  onAddToLibrary: (item: StoreItem) => void;
  ownedGameIds: string[];
}

export const StoreView: React.FC<Props> = ({ onAddToLibrary, ownedGameIds }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleBuyOrAdd = (item: StoreItem) => {
    onAddToLibrary(item);
    setAddedIds(prev => [...prev, item.id]);
  };

  const tags = ['All', 'Action RPG', 'Cyberpunk', 'Indie', 'Tactical'];

  const filtered = selectedTag === 'All' 
    ? STORE_CATALOG 
    : STORE_CATALOG.filter(item => item.genre === selectedTag);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Store Featured Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0053db] via-[#1E293B] to-[#131B2E] border border-[#2A3854] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] text-xs font-mono font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> CYBERDECK SPECIAL DEALS
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-white">
            2026 봄 시즌 핸드헬드 게이밍 할인전
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-mono leading-relaxed">
            Deck Verified 최적화 타이틀 최대 75% 특별 프로모션 및 보너스 프로필 아바타 증정
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-headline font-semibold transition-all shrink-0 ${
              selectedTag === t
                ? 'bg-[#00D2FF] text-[#07101E] shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                : 'bg-[#131B2E] text-slate-400 hover:text-white border border-[#2A3854]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isOwned = addedIds.includes(item.id) || ownedGameIds.some(id => id.includes('cyberpunk') && item.id === 's-2');

          return (
            <div
              key={item.id}
              className="bg-[#131B2E] border border-[#2A3854] hover:border-[#00D2FF]/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400">{item.genre}</span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> {item.deckRating}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-lg text-white group-hover:text-[#00D2FF] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-slate-400 border border-slate-700/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 mt-4 border-t border-[#2A3854]/60 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  {item.discountPct && (
                    <span className="px-1.5 py-0.5 rounded bg-[#00D2FF] text-[#07101E] font-mono font-bold text-xs">
                      -{item.discountPct}%
                    </span>
                  )}
                  <span className="font-mono font-bold text-sm text-white">
                    {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="font-mono text-xs text-slate-500 line-through">
                      {item.originalPrice}
                    </span>
                  )}
                </div>

                {isOwned ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 보유 중
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyOrAdd(item)}
                    className="px-4 py-2 rounded-xl bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs hover:bg-[#a5e7ff] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.25)]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    라이브러리 추가
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
