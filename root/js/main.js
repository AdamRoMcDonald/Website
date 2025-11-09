 
// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Lightbox behavior
const gallery = Array.from(document.querySelectorAll('figure.photo'));
const lightbox = document.getElementById('lightbox');
const imgEl = document.getElementById('lightboxImg');
const titleEl = document.getElementById('lightboxTitle');
const metaEl = document.getElementById('lightboxMeta');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');

let currentIndex = -1;

function openAt(i){
  const fig = gallery[i];
  if(!fig) return;
  currentIndex = i;
  const img = fig.querySelector('img');
  imgEl.src = img.dataset.full || img.src; // use larger file if provided
  imgEl.alt = img.alt || '';
  titleEl.textContent = fig.querySelector('.title')?.textContent || '';
  metaEl.textContent = fig.querySelector('.meta')?.textContent || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBox(){
  lightbox.classList.remove('active');
  imgEl.src = '';
  document.body.style.overflow = '';
}

function prev(){
  if(currentIndex <= 0){ openAt(gallery.length - 1); }
  else { openAt(currentIndex - 1); }
}

function next(){
  if(currentIndex >= gallery.length - 1){ openAt(0); }
  else { openAt(currentIndex + 1); }
}

// Bind events
gallery.forEach((fig, i) => {
  fig.addEventListener('click', () => openAt(i));
  fig.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ openAt(i); }
  });
  fig.tabIndex = 0; // focusable for keyboard users
});

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
closeBtn.addEventListener('click', closeBox);
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeBox(); });
window.addEventListener('keydown', (e) => {
  if(!lightbox.classList.contains('active')) return;
  if(e.key === 'Escape') closeBox();
  if(e.key === 'ArrowLeft') prev();
  if(e.key === 'ArrowRight') next();
});

// Export functions for analytics.js to hook into if present
window.__galleryHooks = {
  getIndex: () => currentIndex,
  getFigure: (i) => gallery[i],
  openAtRef: openAt
};