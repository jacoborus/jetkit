export function localSave(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localLoad<T>(key: string) {
  const raw = localStorage.getItem(key) as string;
  if (!raw) return;
  return JSON.parse(raw) as T;
}
