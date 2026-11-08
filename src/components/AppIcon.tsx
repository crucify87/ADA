import React, { useEffect, useState } from 'react';
import { AppWindow } from 'lucide-react';

function imageSources(url: string, imageUrl?: string, discovered: string[] = []) {
  const sources: string[] = [];
  if (imageUrl) {
    try { const image = new URL(imageUrl); if (['https:', 'http:'].includes(image.protocol)) sources.push(image.href); } catch {}
  }
  sources.push(...discovered);
  try {
    const app = new URL(url);
    if (['https:', 'http:'].includes(app.protocol)) sources.push(`${app.origin}/apple-touch-icon.png`, `${app.origin}/favicon.ico`);
  } catch {}
  return [...new Set(sources)];
}

function IconImage({ sources, name }: { sources: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  return <div className="relative w-40 max-w-full aspect-video shrink-0 rounded-xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center overflow-hidden">
    {sources[index] ? <img key={sources[index]} src={sources[index]} alt={`${name || '앱'} 대표 이미지`} width={160} height={90} className="absolute inset-0 w-full h-full object-contain" loading="lazy" referrerPolicy="no-referrer" onError={() => setIndex(current => current + 1)}/> : <AppWindow size={28} aria-label={`${name || '앱'} 기본 아이콘`}/>}
  </div>;
}

export default function AppIcon({ url, imageUrl, name }: { url: string; imageUrl?: string; name: string }) {
  const [discovered, setDiscovered] = useState<{ url: string; images: string[] }>({ url: '', images: [] });
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/app-image?url=${encodeURIComponent(url)}`, { signal: controller.signal })
        .then(response => response.ok ? response.json() : { images: [] })
        .then(data => {
          if (!controller.signal.aborted) setDiscovered({ url, images: Array.isArray(data.images) ? data.images.filter((value: unknown) => typeof value === 'string' && /^https?:\/\//i.test(value)) : [] });
        }).catch(() => {});
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [url]);
  const sources = imageSources(url, imageUrl, discovered.url === url ? discovered.images : []);
  return <IconImage key={JSON.stringify(sources)} sources={sources} name={name}/>;
}
