(async function(){
  const grid = document.getElementById('galleryGrid');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('imageTitle');
  const modalCaption = document.getElementById('imageCaption');
  const modalAlbums = document.getElementById('imageAlbums');
  const slideshowBtn = document.getElementById('slideshowBtn');
  const addPhotoBtn = document.getElementById('addPhotoBtn');

  if(!grid) return;

  const res = await fetch('/data/photos.json');
  const photos = await res.json();

  function render(){
  console.log("Rendering photos:", photos);
  grid.innerHTML = '';
  photos.forEach(p => {
    const a = document.createElement('button');
    a.className = 'card';
    a.setAttribute('aria-label', `Open ${p.title}`);
    a.innerHTML = `
      <img class="thumb" loading="lazy" src="${p.src}" alt="${p.alt}"/>
      <h3>${p.title}</h3>
      <p class="muted">${p.caption || ''}</p>
    `;
    a.addEventListener('click', () => openModal(p));
    grid.appendChild(a);
  });
}


  function openModal(photo){
    modalImg.src = photo.src;
    modalImg.alt = photo.alt || photo.title;
    modalTitle.textContent = photo.title;
    modalCaption.textContent = photo.caption || '';
    modalAlbums.textContent = photo.albums?.length ? ('Albums: ' + photo.albums.join(', ')) : '';
    modal?.showModal();
  }

  // Basic slideshow
  let slideshow = null;
  function startSlideshow(){
    let idx = 0;
    slideshow = setInterval(() => {
      openModal(photos[idx % photos.length]);
      idx++;
    }, 2000);
    slideshowBtn.textContent = 'Stop Slideshow';
    slideshowBtn.setAttribute('aria-pressed', 'true');
  }
  function stopSlideshow(){
    if(slideshow) clearInterval(slideshow);
    slideshow = null;
    slideshowBtn.textContent = 'Start Slideshow';
    slideshowBtn.setAttribute('aria-pressed', 'false');
  }
  slideshowBtn?.addEventListener('click', () => slideshow ? stopSlideshow() : startSlideshow());

  // Admin-only "upload" (placeholder)
  addPhotoBtn?.addEventListener('click', async () => {
    if(localStorage.getItem('isAdmin') !== 'true') return;
    const title = prompt('Photo title?'); if(!title) return;
    const url = prompt('Image URL? (use an https link)'); if(!url) return;
    photos.unshift({ id: Date.now(), title, src: url, alt: title, caption: '', albums: [] });
    render();
    alert('Photo added (demo). Persisting requires a backend.');
  });

  render();
})();
