 
// This file wires analytics without inline JS.
// To enable GA4:
// 1) In index.html, uncomment the GA4 loader and set your ID: G-XXXXXXX
// 2) Below, set MEASUREMENT_ID to the same value.
// 3) (Optional) Uncomment the init block.

const MEASUREMENT_ID = 'G-XXXXXXX'; // <-- put your GA4 ID here when ready

// GA bootstrap without inline <script> config
function initGA() {
  if (!window.dataLayer) window.dataLayer = [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
}

// Track a photo open using GA4 recommended event fields
function trackPhotoOpen(figIndex) {
  if (typeof window.gtag !== 'function') return;
  const fig = window.__galleryHooks?.getFigure(figIndex);
  if (!fig) return;
  const img = fig.querySelector('img');
  const title = fig.querySelector('.title')?.textContent || '(untitled)';
  window.gtag('event', 'select_content', {
    content_type: 'photo',
    item_id: img.getAttribute('data-full') || img.src,
    photo_title: title
  });
}

// Patch openAt to also track photo opens
(function wireTracking(){
  document.addEventListener('DOMContentLoaded', () => {
    // If GA loader script is present and an ID is set, initialize
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]') && MEASUREMENT_ID && MEASUREMENT_ID !== 'G-XXXXXXX') {
      initGA();
    }

    // If main.js exported hooks, wrap its openAt
    const hooks = window.__galleryHooks;
    if (hooks && typeof hooks.openAtRef === 'function') {
      const originalOpenAt = hooks.openAtRef;
      const wrapped = function(i){
        try { trackPhotoOpen(i); } catch(e){}
        return originalOpenAt(i);
      };
      // Replace the function reference globally so event handlers use the wrapped version
      window.__galleryHooks.openAtRef = wrapped;
      // Also replace the global openAt (if accessible)
      if (typeof window.openAt === 'function') window.openAt = wrapped;
    }

    // Outbound link tracking (optional)
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || typeof window.gtag !== 'function') return;
      try {
        const url = new URL(a.href);
        if (url.origin !== location.origin) {
          window.gtag('event', 'click', {
            event_category: 'outbound',
            event_label: a.href
          });
        }
      } catch(_) {}
    });
  });
})();

