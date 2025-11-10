/* auth.js — simple front-end admin toggle (demo only)
   Credentials: admin / demo
*/
(function(){
  function $(sel){ return document.querySelector(sel); }
  function openLogin(){ $('#loginModal')?.showModal(); $('#username')?.focus(); }
  function closeLogin(){ $('#loginModal')?.close(); }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#loginBtn');
    if(btn){ openLogin(); }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if(form && form.id === 'loginForm'){
      e.preventDefault();
      const u = form.username.value.trim();
      const p = form.password.value.trim();
      if(u === 'admin' && p === 'demo'){
        localStorage.setItem('isAdmin', 'true');
        document.getElementById('loginError')?.setAttribute('hidden','');
        closeLogin();
        window.AppBus?.dispatchEvent(new Event('auth:change'));
      } else {
        document.getElementById('loginError')?.removeAttribute('hidden');
      }
    }
  });

  // allow logging out via console: localStorage.removeItem('isAdmin'); AppBus.dispatchEvent(new Event('auth:change'))
})();

