import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

test('local bridge: access checks, connection, source edits, failures and persistence', { timeout: 90000 }, async () => {
  const testRoot = fileURLToPath(new URL('../.ada/', import.meta.url));
  await mkdir(testRoot, { recursive: true });
  const dir = await mkdtemp(path.join(testRoot, 'test-'));
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
  // Node acts as a deterministic CLI. No AI requests or user source edits in this test.
  await writeFile(path.join(dir, 'exec.js'), `const fs = require('node:fs'); let text = ''; process.stdin.on('data', d => text += d); process.stdin.on('end', () => { setTimeout(() => { if (text.includes('FAIL_TEST')) { console.error('fixture failure'); process.exit(1); } fs.writeFileSync('result.txt', text); console.log(JSON.stringify({type:'item.completed', item:{type:'agent_message', text:'테스트 수정 완료'}})); console.log(JSON.stringify({type:'turn.completed'})); }, 200); });`);
  const npmCli = path.join(dir, 'npm-cli.js');
  await writeFile(npmCli, `const fs = require('node:fs'); if (fs.existsSync('fail-build')) { console.error('build fixture failure'); process.exit(1); } fs.writeFileSync('built.txt', 'built'); console.log('build success');`);
  const port = 31000 + Math.floor(Math.random() * 10000);
  let output = '';
  const server = spawn(process.execPath, ['server.mjs'], { cwd: new URL('..', import.meta.url), env: { ...process.env, NODE_ENV: 'production', PORT: String(port), ADA_DATA_DIR: path.join(dir, 'data'), ADA_CODEX_BIN: process.execPath, ADA_NPM_CLI: npmCli }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', d => output += d); server.stderr.on('data', d => output += d);
  const base = `http://127.0.0.1:${port}`;
  let token;
  async function request(route, method = 'GET', value, headers = {}) {
    return fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { 'X-ADA-Token': token } : {}), ...headers }, body: value ? JSON.stringify(value) : undefined });
  }
  async function waitJob() {
    for (let i = 0; i < 200; i++) { const jobs = await (await request('/api/jobs?appId=app-1')).json(); if (jobs[0] && !['running', 'building'].includes(jobs[0].status)) return jobs[0]; await new Promise(r => setTimeout(r, 100)); }
    assert.fail('job timed out');
  }
  try {
    for (let i = 0; i < 200; i++) { try { const response = await request('/api/session'); token = (await response.json()).token; break; } catch { await new Promise(r => setTimeout(r, 100)); } }
    assert.ok(token, output);
    assert.equal((await request('/api/jobs', 'POST', {}, { 'X-ADA-Token': '' })).status, 403);
    assert.equal((await request('/api/session', 'GET', undefined, { Origin: 'https://other.example' })).status, 403);
    assert.equal((await request('/api/connections', 'PUT', { appId: 'app-1', directory: 'relative' })).status, 400);
    assert.equal((await request('/api/jobs', 'POST', { appId: 'missing', prompt: 'test' })).status, 400);
    assert.equal((await request('/api/connections', 'PUT', { appId: 'app-1', directory: dir, autoBuild: true })).status, 400);
    assert.equal((await request('/api/connections', 'PUT', { appId: 'app-1', directory: dir, autoBuild: false })).status, 200);
    assert.equal((await request('/api/jobs', 'POST', { appId: 'app-1', prompt: '   ' })).status, 400);
    assert.equal((await request('/api/jobs', 'POST', { appId: 'app-1', appName: '테스트 앱', prompt: '요청대로 수정' })).status, 202);
    assert.equal((await request('/api/jobs', 'POST', { appId: 'app-1', prompt: 'duplicate' })).status, 409);
    const success = await waitJob(); assert.equal(success.status, 'completed', success.error); assert.match(success.summary, /수정 완료/);
    assert.match(await readFile(path.join(dir, 'result.txt'), 'utf8'), /요청대로 수정/);
    assert.equal((await request('/api/jobs?appId=other')).status, 200);
    assert.deepEqual(await (await request('/api/jobs?appId=other')).json(), []);
    await request('/api/jobs', 'POST', { appId: 'app-1', prompt: 'FAIL_TEST' });
    const failed = await waitJob(); assert.equal(failed.status, 'failed'); assert.match(failed.error, /fixture failure/);
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ type: 'commonjs', scripts: { build: 'fixture' } }));
    assert.equal((await request('/api/connections', 'PUT', { appId: 'app-1', directory: dir, autoBuild: true })).status, 200);
    await request('/api/jobs', 'POST', { appId: 'app-1', prompt: 'build test' });
    const built = await waitJob(); assert.equal(built.status, 'completed'); assert.match(built.buildOutput, /build success/); assert.equal(await readFile(path.join(dir, 'built.txt'), 'utf8'), 'built');
    await writeFile(path.join(dir, 'fail-build'), 'yes');
    await request('/api/jobs', 'POST', { appId: 'app-1', prompt: 'build failure test' });
    const buildFailed = await waitJob(); assert.equal(buildFailed.status, 'failed'); assert.match(buildFailed.error, /build fixture failure/);
    const saved = JSON.parse(await readFile(path.join(dir, 'data/state.json'), 'utf8')); assert.equal(saved.jobs.length, 4); assert.equal(saved.connections['app-1'].directory, await (await import('node:fs/promises')).realpath(dir));
  } finally {
    server.kill(); await new Promise(resolve => server.once('close', resolve));
    await rm(dir, { recursive: true, force: true });
  }
});
