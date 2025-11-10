/* main.js — loads header/footer templates, sets active link, common behaviors */
(async function () {
  async function loadFragment(url){
    const res = await fetch(url, {credentials:'same-origin'});
    if(!res.ok) return "";
    return await res.text();
  }

  // Mount header & footer
  const [header, footer] = await Promise.all([
    loadFragment('/templates/header.html'),
    loadFragment('/templates/footer.html')
  ]);
  const headerMount = document.getElementById('headerMount');
  const footerMount = document.getElementById('footerMount');
  if(headerMount) headerMount.innerHTML = header;
  if(footerMount) footerMount.innerHTML = footer;

  // Init common header behaviors
  const now = new Date(); 
  document.getElementById('year')?.replaceWith((() => {
    const span = document.createElement('span');
    span.id = 'year';
    span.textContent = now.getFullYear().toString();
    return span;
  })());

  // nav active state
  function setActive(){
    const path = location.pathname.replace(/\/$/, '/index.html');
    document.querySelectorAll('nav a[data-link]').forEach(a => {
      a.removeAttribute('aria-current');
      const href = a.getAttribute('href');
      if(href === path) a.setAttribute('aria-current', 'page');
    });
  }
  setActive();

  // mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu?.classList.toggle('open');
    if(menu?.classList.contains('open')){
      menu.style.display = 'grid';
    } else {
      menu.style.display = '';
    }
  });

  // expose a simple event bus
  window.AppBus = new EventTarget();

  // Re-apply admin visibility if already logged in
  window.AppBus.addEventListener('auth:change', () => applyAdminState());
  applyAdminState();

  function applyAdminState(){
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    document.getElementById('adminBadge')?.classList.toggle('hidden', !isAdmin);
    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.toggle('hidden', !isAdmin);
    });
  }

  // keyboard: allow ESC to close any <dialog open>
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      document.querySelectorAll('dialog[open]').forEach(d => d.close());
    }
  });

  // Optional: prefetch data on initial load to warm cache
  try {
    ['photos','albums','articles'].forEach(key => fetch(`/data/${key}.json`, {cache:'force-cache'}));
  } catch {}
})();
