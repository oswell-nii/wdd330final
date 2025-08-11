import { storage } from './storage.mjs';

export function toggleThemeInit(){
  const btns = document.querySelectorAll('#theme-toggle');
  const saved = storage.get('theme', 'light');
  document.documentElement.dataset.theme = saved;
  btns.forEach(b => b.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme;
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    storage.set('theme', next);
    b.setAttribute('aria-pressed', next === 'dark');
  }));
}