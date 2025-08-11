export function debounce(fn, ms = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function formatPopulation(n){
  try{ return Number(n).toLocaleString(); }catch{ return n; }
}

export function showToast(message, timeout = 2000){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = message;
  t.hidden = false;
  setTimeout(() => { t.hidden = true; }, timeout);
}