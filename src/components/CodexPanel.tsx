import React, { useEffect, useState } from 'react';

type Job = { id: string; appId: string; status: string; prompt: string; summary?: string; error?: string; createdAt: string; buildOutput?: string };
type Connection = { directory: string; autoBuild: boolean };
const field = 'w-full rounded-xl border border-slate-700 bg-[#0B0F19] px-3 py-2.5 text-sm';
const labels: Record<string, string> = { running: '코덱 수정 중', building: '자동 빌드 중', completed: '완료 · 소스 반영됨', failed: '실패 · 변경 내용 확인 필요' };
async function api(url: string, method = 'GET', value?: unknown) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (method !== 'GET') {
    const session = await fetch('/api/session');
    if (!session.ok) throw new Error('ADA 연동 서버에 연결할 수 없습니다. npm start로 실행하세요.');
    headers['X-ADA-Token'] = (await session.json()).token;
  }
  const response = await fetch(url, { method, headers, body: value ? JSON.stringify(value) : undefined });
  let data; try { data = await response.json(); } catch { throw new Error('코덱 연동 서버가 없습니다. 로컬 ADA 서버로 접속하세요.'); }
  if (!response.ok) throw new Error(data.error || '요청을 처리하지 못했습니다.');
  return data;
}
export default function CodexPanel({ appId, appName, onApplied }: { appId: string; appName: string; onApplied: (appId: string, jobId: string) => void }) {
  const [directory, setDirectory] = useState('');
  const [autoBuild, setAutoBuild] = useState(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [prompt, setPrompt] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [health, setHealth] = useState('코덱 연결 확인 중…');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all([api('/api/connections'), api('/api/health')]).then(([connections, status]) => {
      if (!active) return;
      const saved = connections[appId]; setConnection(saved || null); setDirectory(saved?.directory || ''); setAutoBuild(saved?.autoBuild || false);
      setHealth(status.message); setReady(status.connected);
    }).catch(e => { if (active) { setHealth('연동 서버 연결 안 됨'); setError(e.message); } });
    async function refresh() {
      try { const data = await api(`/api/jobs?appId=${encodeURIComponent(appId)}`); if (active) setJobs(data); }
      catch (e) { if (active) setError((e as Error).message); }
    }
    void refresh(); const timer = window.setInterval(refresh, 2000);
    return () => { active = false; window.clearInterval(timer); };
  }, [appId]);
  const latest = jobs[0];
  useEffect(() => { if (latest?.status === 'completed') onApplied(appId, latest.id); }, [appId, latest?.id, latest?.status, onApplied]);
  const running = jobs.some(job => ['running', 'building'].includes(job.status));
  const dirty = !connection || connection.directory !== directory || connection.autoBuild !== autoBuild;
  return <section className="mt-6 border-t border-slate-700 pt-5 space-y-4">
    <div><h3 className="font-semibold text-cyan-300">코덱으로 앱 수정</h3><p role="status" className="text-xs text-slate-400 mt-2">{health}</p></div>
    <p className="text-xs text-slate-400 leading-5">수정 권한이 있는 앱의 로컬 소스 폴더를 연결하세요. 요청을 실행하면 코덱이 해당 폴더의 파일을 직접 수정합니다. 개발 서버는 변경을 자동 반영하며, 공개 앱 배포는 별도로 진행해야 합니다.</p>
    <label className="block text-sm">로컬 소스 폴더 (절대 경로)<input className={field + ' mt-2'} placeholder="C:\Projects\my-app" value={directory} disabled={running || busy} onChange={e => setDirectory(e.target.value)}/></label>
    <label className="flex gap-2 text-sm items-start"><input type="checkbox" checked={autoBuild} disabled={running || busy} onChange={e => setAutoBuild(e.target.checked)}/>수정 완료 후 이 앱의 npm run build 자동 실행</label>
    <button type="button" disabled={busy || running || !directory.trim()} onClick={async () => {
      setBusy(true); setError(''); try { const saved = await api('/api/connections', 'PUT', { appId, directory: directory.trim(), autoBuild }); setConnection(saved); setDirectory(saved.directory); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
    }} className="rounded-xl border border-cyan-700 px-4 py-2 text-sm text-cyan-200 disabled:opacity-40">{connection && !dirty ? '소스 연결됨' : '소스 연결 저장'}</button>
    <label className="block text-sm">앱 수정 요청<textarea className={field + ' mt-2 min-h-28'} maxLength={12000} placeholder="예: 메인 화면에 다크 모드 전환 버튼을 추가해줘." value={prompt} onChange={e => setPrompt(e.target.value)} disabled={running || busy}/></label>
    {error && <p role="alert" className="text-sm text-rose-300 whitespace-pre-wrap break-words">{error}</p>}
    <button type="button" disabled={!ready || dirty || !prompt.trim() || running || busy} onClick={async () => {
      setBusy(true); setError(''); try { const job = await api('/api/jobs', 'POST', { appId, appName, prompt }); setJobs(prev => [job, ...prev]); setPrompt(''); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
    }} className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40">{running ? '코덱 작업 진행 중…' : '코덱 수정 실행 · 소스 자동 반영'}</button>
    {dirty && connection && <p className="text-xs text-amber-300">변경한 연결 설정을 먼저 저장하세요.</p>}
    {!!jobs.length && <div className="space-y-3"><h4 className="text-sm font-semibold">앱별 수정 이력</h4>{jobs.map(job => <details key={job.id} open={job.id === latest?.id} className="rounded-xl border border-slate-700 p-3 text-xs"><summary className="cursor-pointer">{labels[job.status] || job.status} · {new Date(job.createdAt).toLocaleString('ko-KR')}</summary><p className="mt-3 whitespace-pre-wrap break-words text-slate-300">{job.prompt}</p>{job.summary && <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-slate-400">{job.summary}</pre>}{job.error && <p role="alert" className="mt-3 whitespace-pre-wrap break-words text-rose-300">{job.error}</p>}{job.buildOutput && <pre className="mt-3 whitespace-pre-wrap break-words text-slate-500">{job.buildOutput}</pre>}</details>)}</div>}
  </section>;
}
