import React, { useState } from 'react';
import { AppWindow } from 'lucide-react';

function imageSources(url: string, imageUrl?: string) {
  const sources: string[] = [];
  if (imageUrl) {
    try { const image = new URL(imageUrl); if (['https:', 'http:'].includes(image.protocol)) sources.push(image.href); } catch {}
  }
  try {
    const app = new URL(url);
    if (['https:', 'http:'].includes(app.protocol)) sources.push(`${app.origin}/apple-touch-icon.png`, `${app.origin}/favicon.ico`);
  } catch {}
  return [...new Set(sources)];
}

function IconImage({ sources, name }: { sources: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  return <div className="w-14 h-14 shrink-0 rounded-2xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center overflow-hidden">
    {sources[index] ? <img key={sources[index]} src={sources[index]} alt={`${name || '앱'} 아이콘`} width={40} height={40} className="w-10 h-10 object-contain" loading="lazy" referrerPolicy="no-referrer" onError={() => setIndex(current => current + 1)}/> : <AppWindow size={28} aria-label={`${name || '앱'} 기본 아이콘`}/>}
  </div>;
}

export default function AppIcon({ url, imageUrl, name }: { url: string; imageUrl?: string; name: string }) {
  const sources = imageSources(url, imageUrl);
  return <IconImage key={JSON.stringify(sources)} sources={sources} name={name}/>;
}
