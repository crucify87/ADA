import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

test('static server serves ADA and rejects all former app editing APIs', { timeout: 15000 }, async () => {
  const port = 31000 + Math.floor(Math.random() * 10000);
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port), ADA_INDEX_FILE: 'ada-entry.html' },
    windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', data => { logs += data; });
  child.stderr.on('data', data => { logs += data; });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try { const response = await fetch(base); if (response.ok) { assert.match(await response.text(), /ADA Hub/); ready = true; break; } }
      catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, logs);
    for (const route of ['/api/jobs', '/api/connections', '/api/session', '/api/health']) {
      for (const method of ['GET', 'POST', 'PUT']) {
        const response = await fetch(base + route, { method });
        assert.equal(response.status, 404, `${method} ${route}`);
      }
    }
    assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  } finally {
    child.kill();
    if (child.exitCode === null) await new Promise(resolve => child.once('close', resolve));
  }
});
