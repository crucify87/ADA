import http from 'node:http';
import { spawn } from 'node:child_process';
import { randomUUID, randomBytes } from 'node:crypto';
import { readFile, writeFile, mkdir, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.ADA_DATA_DIR || path.join(root, '.ada');
const dataFile = path.join(dataDir, 'state.json');
const port = Number(process.env.PORT || 3000);
const token = randomBytes(32).toString('hex');
const children = new Set();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { for (const child of children) child.kill(); process.exit(0); });
let state = { connections: {}, jobs: [] };
try { state = JSON.parse(await readFile(dataFile, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
for (const job of state.jobs) if (['running', 'building'].includes(job.status)) { job.status = 'failed'; job.error = '서버가 종료되어 작업이 중단되었습니다. 변경된 파일을 확인하세요.'; }
await mkdir(dataDir, { recursive: true });
let writes = Promise.resolve();
const persist = () => { const snapshot = JSON.stringify(state, null, 2); writes = writes.then(() => writeFile(dataFile, snapshot)); return writes; };
await persist();
const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
const publicJob = job => ({ ...job });
function command(executable, args, cwd, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { cwd, shell: false, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    children.add(child);
    let output = '', errors = '';
    child.stdout.on('data', data => { output = (output + data).slice(-100000); });
    child.stderr.on('data', data => { errors = (errors + data).slice(-20000); });
    child.on('error', error => { children.delete(child); reject(error); });
    child.stdin.on('error', () => {});
    child.stdin.end(input || '');
    child.on('close', code => { children.delete(child); code === 0 ? resolve(output) : reject(new Error(errors || output || `프로세스 종료 코드: ${code}`)); });
  });
}
async function runJob(job, connection) {
  try {
    const output = await command(process.env.ADA_CODEX_BIN || 'codex', ['exec', '--json', '--sandbox', 'workspace-write', '-c', 'approval_policy="never"', '--skip-git-repo-check', '-C', connection.directory, '-'], connection.directory,
      `ADA에서 사용자가 요청한 앱 수정입니다. 현재 폴더의 앱만 수정하고 기존 변경 내용을 보존하세요. 프로젝트 지침을 읽고 요청을 구현하고 적절한 검증을 실행하세요. 커밋, 푸시, 원격 배포는 하지 마세요. 완료 후 변경 사항과 검증 결과를 한국어로 설명하세요. 구현하지 못했거나 검증에 실패하면 최종 메시지에 명시하세요.\n앱: ${job.appName}\n수정 요청:\n${job.prompt}`);
    const events = output.split('\n').flatMap(line => { try { return [JSON.parse(line)]; } catch { return []; } });
    if (!events.some(event => event.type === 'turn.completed') || events.some(event => event.type === 'turn.failed' || event.type === 'error')) throw new Error('코덱이 작업을 완료하지 못했습니다. 로컬 소스 변경 내용을 확인하세요.');
    job.summary = events.filter(event => event.type === 'item.completed' && event.item?.type === 'agent_message').map(event => event.item.text).join('\n') || '코덱 작업이 종료되었습니다. 소스 변경 내용을 확인하세요.';
    if (connection.autoBuild) {
      job.status = 'building'; await persist();
      // Invoke the installed npm CLI through Node, avoiding cmd.exe interpolation on Windows.
      const npmCli = process.env.ADA_NPM_CLI || process.env.npm_execpath;
      if (!npmCli || !/(npm-cli\.js|pnpm\.(cjs|mjs))$/.test(npmCli)) throw new Error('자동 빌드에는 npm start 또는 pnpm start로 서버를 실행하거나 ADA_NPM_CLI를 설정해야 합니다.');
      job.buildOutput = await command(process.execPath, [npmCli, 'run', 'build'], connection.directory);
    }
    job.status = 'completed';
  } catch (error) { job.status = 'failed'; job.error = error.message; }
  job.finishedAt = new Date().toISOString();
  await persist();
}
async function body(req) {
  let value = ''; for await (const chunk of req) { value += chunk; if (value.length > 32000) throw new Error('요청이 너무 큽니다.'); }
  return JSON.parse(value || '{}');
}
const vite = process.env.NODE_ENV === 'production' ? null : await (await import('vite')).createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
const server = http.createServer(async (req, res) => {
  const host = req.headers.host;
  if (![`localhost:${port}`, `127.0.0.1:${port}`].includes(host)) return json(res, 403, { error: '로컬 ADA에서만 접근할 수 있습니다.' });
  const url = new URL(req.url, `http://${host}`);
  if (url.pathname.startsWith('/api/')) {
    try {
      if (req.headers.origin && req.headers.origin !== `http://${host}`) return json(res, 403, { error: '허용되지 않은 출처입니다.' });
      if (req.method !== 'GET' && req.headers['x-ada-token'] !== token) return json(res, 403, { error: 'ADA를 새로고침해 주세요.' });
      if (url.pathname === '/api/session' && req.method === 'GET') return json(res, 200, { token });
      if (url.pathname === '/api/health' && req.method === 'GET') {
        try { const result = await command(process.env.ADA_CODEX_BIN || 'codex', ['login', 'status'], root); return json(res, 200, { connected: true, message: result.trim() || '코덱 로그인 확인 완료' }); }
        catch { return json(res, 200, { connected: false, message: '코덱 CLI 설치 및 codex login을 확인하세요.' }); }
      }
      if (url.pathname === '/api/connections' && req.method === 'GET') return json(res, 200, state.connections);
      if (url.pathname === '/api/connections' && req.method === 'PUT') {
        const value = await body(req);
        if (typeof value.appId !== 'string' || !/^[\w-]{1,100}$/.test(value.appId) || typeof value.directory !== 'string' || !path.isAbsolute(value.directory)) throw new Error('앱 ID와 소스 폴더의 절대 경로를 확인하세요.');
        if (state.jobs.some(job => ['running', 'building'].includes(job.status) && job.appId === value.appId)) return json(res, 409, { error: '작업이 진행 중입니다.' });
        const directory = await realpath(value.directory);
        if (!(await stat(directory)).isDirectory()) throw new Error('소스 폴더를 찾을 수 없습니다.');
        if (value.autoBuild) { const pkg = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8')); if (!pkg.scripts?.build) throw new Error('이 앱에는 build 스크립트가 없습니다.'); }
        state.connections[value.appId] = { directory, autoBuild: value.autoBuild === true };
        await persist(); return json(res, 200, state.connections[value.appId]);
      }
      if (url.pathname === '/api/jobs' && req.method === 'GET') return json(res, 200, state.jobs.filter(job => !url.searchParams.get('appId') || job.appId === url.searchParams.get('appId')).map(publicJob));
      if (url.pathname === '/api/jobs' && req.method === 'POST') {
        const value = await body(req);
        const connection = Object.hasOwn(state.connections, value.appId) && state.connections[value.appId];
        if (!connection) throw new Error('먼저 앱의 소스 폴더를 연결하세요.');
        if (typeof value.prompt !== 'string' || !value.prompt.trim() || value.prompt.length > 12000) throw new Error('수정 요청을 1~12000자로 입력하세요.');
        if (state.jobs.some(job => ['running', 'building'].includes(job.status))) return json(res, 409, { error: '다른 코덱 작업이 진행 중입니다. 완료 후 다시 시도하세요.' });
        const job = { id: randomUUID(), appId: value.appId, appName: String(value.appName || '').slice(0, 200), prompt: value.prompt.trim(), status: 'running', createdAt: new Date().toISOString(), directory: connection.directory };
        state.jobs.unshift(job); await persist();
        json(res, 202, publicJob(job));
        void runJob(job, { ...connection }).catch(error => console.error('작업 저장 실패:', error)); return;
      }
      return json(res, 404, { error: 'API를 찾을 수 없습니다.' });
    } catch (error) { return json(res, 400, { error: error.message }); }
  }
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
