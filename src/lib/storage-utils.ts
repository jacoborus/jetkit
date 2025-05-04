// const bellFiles = ["beep"] as const;
//
// const bellAudios = Object.fromEntries(bellFiles.map(getAudioBell));
//
// export function playBell(kind: (typeof bellFiles)[number]) {
//   const audio = bellAudios[kind].cloneNode();
//   audio.play();
// }
//
// function getAudioBell(kind: (typeof bellFiles)[number]) {
//   const audio = new Audio();
//   audio.src = `/audio/${kind}.wav`;
//   audio.load();
//   return [kind, audio];
// }

export function localSave(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localLoad<T>(key: string) {
  const raw = localStorage.getItem(key) as string;
  if (!raw) return;
  return JSON.parse(raw) as T;
}

export function sessionSave(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function sessionLoad<T>(key: string) {
  const raw = sessionStorage.getItem(key) as string;
  if (!raw) return;
  return JSON.parse(raw) as T;
}

export function formatMoney(n: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(n);
}
