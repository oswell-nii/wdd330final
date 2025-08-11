export const storage = {
  get(key, defaultVal = null){
    try{ return JSON.parse(localStorage.getItem(key)) ?? defaultVal; }catch{ return defaultVal; }
  },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
  remove(key){ localStorage.removeItem(key); }
}