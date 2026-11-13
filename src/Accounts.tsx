import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  GoogleAuthProvider, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber,
  signInWithPopup, signOut, type ConfirmationResult, type User,
} from 'firebase/auth';
import {
  collection, doc, onSnapshot, runTransaction,
  serverTimestamp, updateDoc, writeBatch,
} from 'firebase/firestore';
import App, { readEntries, type Entry } from './App';
import { services } from './firebase';

type Status = 'pending' | 'approved' | 'rejected' | 'suspended';
type Member = { email: string; phone: string; status: Status };
const statusText: Record<Status, string> = {
  pending: '승인 대기', approved: '승인됨', rejected: '가입 반려', suspended: '이용 정지',
};
const button = 'rounded-lg bg-deck-elevated px-4 py-2 text-sm font-semibold disabled:opacity-50';
const primary = 'rounded-lg bg-deck-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';
const input = 'w-full rounded-lg border border-deck-border bg-deck-base px-3 py-2';

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <main className="min-h-screen bg-deck-base px-4 py-12 text-deck-ink">
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-deck-border bg-deck-surface p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </section>
  </main>;
}

export default function Accounts() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    if (services) return onAuthStateChanged(services.auth, setUser);
  }, []);
  if (!services) return <Panel title="ADA Hub"><p>로그인을 사용하려면 Firebase 연결 설정이 필요합니다.</p></Panel>;
  if (user === undefined) return <Panel title="ADA Hub"><p role="status">로그인 확인 중…</p></Panel>;
  return user ? <Membership key={user.uid} user={user}/> : <Login/>;
}

function Login() {
  const auth = services!.auth;
  const captchaElement = useRef<HTMLDivElement>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function attempt(action: () => Promise<unknown>, failure: string) {
    setBusy(true);
    setError('');
    try { await action(); } catch { setError(failure); } finally { setBusy(false); }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (confirmation) {
      void attempt(() => confirmation.confirm(code.trim()), '인증번호가 올바르지 않거나 만료되었습니다.');
      return;
    }
    const digits = phone.replace(/[\s()-]/g, '');
    const number = /^010\d{8}$/.test(digits) ? '+82' + digits.slice(1) : digits;
    if (!/^\+[1-9]\d{7,14}$/.test(number)) {
      setError('010으로 시작하는 휴대전화 번호 또는 국가번호가 포함된 번호를 입력해주세요.');
      return;
    }
    void attempt(async () => {
      const verifier = new RecaptchaVerifier(auth, captchaElement.current!, { size: 'invisible' });
      try {
        setConfirmation(await signInWithPhoneNumber(auth, number, verifier));
      } finally {
        verifier.clear();
      }
    }, '인증 문자를 보내지 못했습니다. 번호를 확인한 뒤 잠시 후 다시 시도해주세요.');
  }

  return <Panel title="ADA Hub 로그인 · 회원가입">
    <p className="text-sm text-deck-muted">처음 이용하는 분은 본인 인증 후 가입을 신청할 수 있습니다.</p>
    <button className={button} disabled={busy} onClick={() => void attempt(
      () => signInWithPopup(auth, new GoogleAuthProvider()), 'Google 로그인에 실패했습니다. 팝업 설정을 확인하고 다시 시도해주세요.',
    )}>Google 계정으로 계속</button>
    <form className="space-y-3 border-t border-deck-border pt-4" onSubmit={submit}>
      <label className="block text-sm">휴대전화 번호
        <input className={input} type="tel" autoComplete="tel" value={phone} placeholder="01012345678"
          required disabled={busy || !!confirmation} onChange={event => setPhone(event.target.value)}/>
      </label>
      {confirmation && <label className="block text-sm">문자 인증번호
        <input className={input} inputMode="numeric" autoComplete="one-time-code" value={code}
          required pattern="[0-9]{6}" onChange={event => setCode(event.target.value)}/>
      </label>}
      <p className="text-xs text-deck-muted">문자 인증에 입력한 번호는 Google Firebase에서 처리합니다. 번호를 바꾸거나 타인에게 양도하면 계정 보안에 영향을 줄 수 있습니다.</p>
      <div className="flex gap-2">
        <button className={primary} disabled={busy}>{confirmation ? '인증번호 확인' : '인증 문자 보내기'}</button>
        {confirmation && <button type="button" className={button} disabled={busy} onClick={() => {
          setConfirmation(null);
          setCode('');
          setError('');
        }}>번호 변경 · 다시 보내기</button>}
      </div>
      <div ref={captchaElement}/>
    </form>
    {error && <p role="alert">{error}</p>}
  </Panel>;
}

function Membership({ user }: { user: User }) {
  const { auth, db } = services!;
  const [status, setStatus] = useState<Status | 'new'>();
  const [admin, setAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setReady(false);
    const fail = () => { setReady(false); setError('회원 정보를 확인하지 못했습니다.'); };
    let active = true;
    const stopAdmin = onSnapshot(doc(db, 'admins', user.uid), { includeMetadataChanges: true }, snapshot => {
      setAdmin(false);
      if (!snapshot.metadata.fromCache && snapshot.exists()) {
        void user.getIdTokenResult().then(token => {
          if (active) setAdmin(token.signInProvider === 'google.com');
        }).catch(fail);
      }
    }, fail);
    const stopMember = onSnapshot(doc(db, 'members', user.uid), { includeMetadataChanges: true }, snapshot => {
      setStatus(snapshot.exists() ? snapshot.data().status : 'new');
      setReady(!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites);
    }, fail);
    return () => { active = false; stopAdmin(); stopMember(); };
  }, [db, user, retry]);

  async function register() {
    setBusy(true);
    setError('');
    try {
      const { claims } = await user.getIdTokenResult();
      const ref = doc(db, 'members', user.uid);
      await runTransaction(db, async transaction => {
        if (!(await transaction.get(ref)).exists()) {
          transaction.set(ref, { email: claims.email ?? '', phone: claims.phone_number ?? '',
            status: 'pending', createdAt: serverTimestamp() });
        }
      });
    } catch { setError('가입 신청을 저장하지 못했습니다. 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }

  const logout = <button className={button} onClick={() => void signOut(auth).catch(() => setError('로그아웃에 실패했습니다.'))}>로그아웃</button>;
  const retryButton = <button className={button} onClick={() => { setError(''); setRetry(value => value + 1); }}>다시 확인</button>;
  if (!ready || (!admin && status !== 'approved')) return <Panel title="ADA Hub">
    <p className="text-sm">{user.email || user.phoneNumber}</p>
    {!ready ? <p role="status">회원 정보를 확인하는 중입니다.</p> : status === 'new'
      ? <><p>가입 신청을 제출하면 최종관리자가 검토합니다.</p><button className={primary} disabled={busy} onClick={() => void register()}>회원가입 신청</button></>
      : status && <p role="status">{statusText[status]}</p>}
    {error && <><p role="alert">{error}</p>{retryButton}</>}
    {logout}
  </Panel>;
  if (admin && showAdmin) return <AdminPanel user={user} back={() => setShowAdmin(false)} logout={logout}/>;
  return <Library user={user} menu={<>
    {admin && <button className={button} onClick={() => setShowAdmin(true)}>회원 관리</button>}
    {logout}
    {error && <span role="alert">{error}</span>}
  </>}/>;
}

function Library({ user, menu }: { user: User; menu: ReactNode }) {
  const { db } = services!;
  const [entries, setEntries] = useState<Entry[]>();
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [legacy, setLegacy] = useState(readEntries);
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  useEffect(() => {
    const apps = collection(db, 'members', user.uid, 'apps');
    return onSnapshot(apps, { includeMetadataChanges: true }, snapshot => {
      if (!snapshot.metadata.fromCache) setEntries(snapshot.docs.map(app => app.data() as Entry));
    }, () => {
      setEntries(undefined);
      setError('앱 목록을 불러오지 못했습니다.');
    });
  }, [db, user.uid, retry]);

  async function changeEntries(update: (entries: Entry[]) => Entry[]) {
    if (!entries || saving.current) throw new Error('Save unavailable');
    saving.current = true;
    try {
      const changed = update(entries).filter(entry => !entries.includes(entry));
      if (changed.length > 500) throw new Error('Batch limit');
      const batch = writeBatch(db);
      const previousById = new Map(entries.map(entry => [entry.id, entry]));
      changed.forEach(entry => {
        const ref = doc(db, 'members', user.uid, 'apps', entry.id);
        const previous = previousById.get(entry.id);
        if (!previous) {
          batch.set(ref, entry);
        } else {
          const fields = Object.fromEntries(Object.entries(entry).filter(([key, value]) => value !== previous[key as keyof Entry]));
          if (Object.keys(fields).length) batch.update(ref, fields);
        }
      });
      if (changed.length) await batch.commit();
    } finally { saving.current = false; }
  }

  async function importLegacy() {
    setBusy(true);
    setError('');
    try {
      for (const entry of legacy) {
        if (!entry.id || entry.id.includes('/') || entry.id === '.' || entry.id === '..') continue;
        const ref = doc(db, 'members', user.uid, 'apps', entry.id);
        await runTransaction(db, async transaction => {
          if ((await transaction.get(ref)).exists()) return;
          transaction.set(ref, {
            id: entry.id, name: entry.name, description: entry.description, origin: entry.origin, status: entry.status,
            url: entry.url || '', repository: entry.repository || '', author: entry.author || '',
            imageUrl: entry.imageUrl || '', category: entry.category || '기타', favorite: !!entry.favorite,
            updatedAt: entry.updatedAt || new Date().toISOString(),
          });
        });
      }
      setLegacy([]);
    } catch { setError('기존 목록을 모두 가져오지 못했습니다. 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }

  if (!entries) return <Panel title="내 앱">
    <p role="status">{error || '앱 목록을 불러오는 중입니다.'}</p>
    {error && <button className={button} onClick={() => { setError(''); setRetry(value => value + 1); }}>다시 시도</button>}
    {menu}
  </Panel>;
  return <App entries={entries} setEntries={changeEntries} accountMenu={<>
    {legacy.length > 0 && <button className={button} disabled={busy} onClick={() => {
      if (window.confirm('이 브라우저에 저장된 앱을 현재 계정으로 복사할까요?')) void importLegacy();
    }}>기존 앱 가져오기</button>}
    {error && <span role="alert">{error}</span>}
    {menu}
  </>}/>;
}

function AdminPanel({ user, back, logout }: { user: User; back: () => void; logout: ReactNode }) {
  const { db } = services!;
  const [members, setMembers] = useState<(Member & { uid: string })[]>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => onSnapshot(collection(db, 'members'), { includeMetadataChanges: true }, snapshot => {
    if (snapshot.metadata.fromCache) return;
    setMembers(snapshot.docs.map(member => ({ ...member.data() as Member, uid: member.id }))
      .sort((a, b) => Number(b.status === 'pending') - Number(a.status === 'pending')));
  }, () => { setMembers(undefined); setError('회원 목록을 불러오지 못했습니다.'); }), [db, retry]);

  async function review(uid: string, status: Exclude<Status, 'pending'>) {
    setBusy(true);
    setError('');
    try {
      await updateDoc(doc(db, 'members', uid), { status, reviewedAt: serverTimestamp(), reviewedBy: user.uid });
    } catch { setError('회원 상태를 변경하지 못했습니다. 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }

  return <Panel title="회원 관리">
    <div className="flex gap-2"><button className={button} onClick={back}>내 앱</button>{logout}</div>
    {error && <><p role="alert">{error}</p><button className={button} onClick={() => { setError(''); setRetry(value => value + 1); }}>새로 확인</button></>}
    <ul className="space-y-3">
      {members?.map(member => <li key={member.uid} className="space-y-2 rounded-lg border border-deck-border p-3">
        <p className="break-all font-semibold">{member.email || member.phone}</p>
        <p className="text-sm text-deck-muted">{statusText[member.status]}</p>
        {member.uid !== user.uid && <div className="flex flex-wrap gap-2">
          {member.status !== 'approved' && <button className={primary} disabled={busy} onClick={() => void review(member.uid, 'approved')}>
            {member.status === 'suspended' ? '이용 재개' : '승인'}
          </button>}
          {member.status === 'pending' && <button className={button} disabled={busy} onClick={() => void review(member.uid, 'rejected')}>반려</button>}
          {member.status === 'approved' && <button className={button} disabled={busy} onClick={() => void review(member.uid, 'suspended')}>이용 정지</button>}
        </div>}
      </li>)}
    </ul>
    {!members && !error && <p role="status">회원 목록을 불러오는 중입니다.</p>}
    {members?.length === 0 && <p>가입 신청한 회원이 없습니다.</p>}
  </Panel>;
}
