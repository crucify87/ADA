function publicUrl(value, base) {
  try {
    const url = new URL(value, base);
    const host = url.hostname.toLowerCase();
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        !host.includes('.') || host.endsWith('.local') || host.endsWith('.localhost') ||
        /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':')) return null;
    return url;
  } catch { return null; }
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    if (incoming.pathname !== '/api/app-image') return env.ASSETS.fetch(request);
    if (request.method !== 'GET') return new Response(null, { status: 405 });
    const target = publicUrl(incoming.searchParams.get('url'));
    const reply = (images, status = 200) => Response.json({ images }, {
      status, headers: { 'Cache-Control': status === 200 ? 'public, max-age=3600' : 'no-store' },
    });
    if (!target || target.origin === incoming.origin) return reply([], 400);
    try {
      let page = target;
      let response;
      for (let i = 0; i < 4; i++) {
        response = await fetch(page, { redirect: 'manual', signal: AbortSignal.timeout(5000),
          headers: { Accept: 'text/html' } });
        if (response.status < 300 || response.status >= 400) break;
        const location = response.headers.get('location');
        await response.body?.cancel();
        page = location && publicUrl(location, page);
        if (!page || page.origin === incoming.origin) return reply([], 400);
      }
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return reply([]);
      // Limit the document read; metadata belongs in the head.
      const reader = response.body.getReader();
      const chunks = []; let size = 0;
      while (size < 262144) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(value.subarray(0, 262144 - size)); size += value.length;
      }
      await reader.cancel();
      const meta = [], icons = [];
      let base = page.href;
      const rewriter = new HTMLRewriter()
        .on('base[href]', { element(el) { const url = publicUrl(el.getAttribute('href'), page); if (url) base = url.href; } })
        .on('meta', { element(el) {
          const key = (el.getAttribute('property') || el.getAttribute('name') || '').toLowerCase();
          if (['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'].includes(key)) {
            meta.push({ value: el.getAttribute('content'), rank: key.startsWith('og:') ? 0 : 1 });
          }
        } })
        .on('link[href]', { element(el) {
          const rel = (el.getAttribute('rel') || '').toLowerCase().split(/\s+/);
          if (rel.some(r => ['icon', 'apple-touch-icon', 'apple-touch-icon-precomposed'].includes(r))) icons.push(el.getAttribute('href'));
        } });
      await rewriter.transform(new Response(new Blob(chunks), { headers: { 'Content-Type': 'text/html' } })).text();
      const candidates = [...meta.sort((a, b) => a.rank - b.rank).map(m => m.value), ...icons];
      return reply([...new Set(candidates.filter(Boolean).map(v => publicUrl(v, base)?.href).filter(Boolean))]);
    } catch { return reply([], 502); }
  },
};
