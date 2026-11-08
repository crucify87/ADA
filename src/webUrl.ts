// Accept ordinary domains, local hosts and full web URLs without tying them to a host.
export function normalizeWebUrl(value: string): string | null {
  const text = value.trim();
  if (!text) return '';
  if (/\s/.test(text)) return null;
  const explicit = /^[a-z][a-z\d+.-]*:/i.test(text) && !/^[^/:]+:\d+(?:[/?#]|$)/.test(text);
  const candidate = text.startsWith('//') ? `https:${text}` : explicit ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    if (!explicit && !url.hostname.includes('.') && url.hostname !== 'localhost' && !url.hostname.startsWith('[')) return null;
    return url.href;
  } catch { return null; }
}
