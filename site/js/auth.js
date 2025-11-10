(function(){
  const endpoint = "https://ancient-dream-8fe4.adam-rowan-mcdonald.workers.dev;

  function track(event = "pageview") {
    const data = {
      event,
      path: location.pathname,
    };

    navigator.sendBeacon(endpoint, JSON.stringify(data));
  }

  // Track pageview on load
  window.addEventListener('load', () => track("pageview"));

  // Optional: track link clicks
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    track("click:" + (a.href || a.textContent));
  });
})();
