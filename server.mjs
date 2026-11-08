import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
const vite = process.env.NODE_ENV === 'production' ? null : await (await import('vite')).createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
const server = http.createServer(async (req, res) => {
  const host = req.headers.host;
  if (![`localhost:${port}`, `127.0.0.1:${port}`].includes(host)) return json(res, 403, { error: '로컬 ADA에서만 접근할 수 있습니다.' });
  const url = new URL(req.url, `http://${host}`);
  if (url.pathname.startsWith('/api/')) return json(res, 404, { error: '앱 소스 수정 API는 제공하지 않습니다.' });
  if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: '허용되지 않는 요청입니다.' });
  if (vite) return vite.middlewares(req, res, () => { res.writeHead(404); res.end(); });
  try {
    const dist = path.join(root, 'dist');
    const indexFile = process.env.ADA_INDEX_FILE ? path.resolve(root, process.env.ADA_INDEX_FILE) : path.join(dist, 'index.html');
    const requested = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (requested !== dist && !requested.startsWith(dist + path.sep)) return json(res, 403, { error: '잘못된 경로입니다.' });
    let file = url.pathname.endsWith('/') ? indexFile : requested;
    let content;
    try { content = await readFile(file); }
    catch (error) { if (!['ENOENT', 'EISDIR'].includes(error.code)) throw error; file = indexFile; content = await readFile(file); }
    const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(content);
  } catch { json(res, 404, { error: '배포 파일이 없습니다. 먼저 build를 실행하세요.' }); }
});
server.listen(port, '127.0.0.1', () => console.log(`ADA: http://127.0.0.1:${port}`));
