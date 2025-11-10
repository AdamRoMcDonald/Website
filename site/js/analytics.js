/* analytics.js — minimal client-side analytics for demo
   - Logs page views & click events to console and localStorage
   - In production, swap with a proper privacy-friendly provider (e.g., Cloudflare Web Analytics)
*/
(function(){
  const key = 'demoAnalytics';
  function save(evt){
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push({...evt, t: Date.now(), path: location.pathname});
    localStorage.setItem(key, JSON.stringify(arr));
  }
  // page view
  save({type:'pageview'});
  // clicks
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a,button');
    if(!target) return;
    const label = target.getAttribute('aria-label') || target.textContent?.trim() || target.tagName;
    save({type:'click', label});
  });
  // expose for debugging
  window.Analytics = {
    dump(){ try { return JSON.parse(localStorage.getItem(key)||'[]'); } catch{ return [] } },
    clear(){ localStorage.removeItem(key) }
  };
})();
