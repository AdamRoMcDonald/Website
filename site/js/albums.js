(async function(){
  const grid = document.getElementById('albumsGrid');
  const view = document.getElementById('albumView');
  const titleEl = document.getElementById('albumTitle');
  const descEl = document.getElementById('albumDesc');
  const photosEl = document.getElementById('albumPhotos');
  const backBtn = document.getElementById('albumBack');
  const slideBtn = document.getElementById('albumSlideshow');
  const addAlbumBtn = document.getElementById('addAlbumBtn');

  if(!grid) return;

  const [albumsRes, photosRes] = await Promise.all([
    fetch('/data/albums.json'),
    fetch('/data/photos.json')
  ]);
  const albums = await albumsRes.json();
  const photos = await photosRes.json();

  function renderAlbums(){
    grid.innerHTML = '';
    view.classList.add('hidden');
    albums.forEach(a => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = \`
        <img class="thumb" loading="lazy" src="\${a.cover}" alt="Cover for \${a.title}"/>
        <h3>\${a.title}</h3>
        <p class="muted">\${a.description||''}</p>
      \`;
      card.addEventListener('click', () => openAlbum(a));
      grid.appendChild(card);
    });
  }

  function openAlbum(album){
    grid.innerHTML = '';
    view.classList.remove('hidden');
    titleEl.textContent = album.title;
    descEl.textContent = album.description || '';
    const subset = photos.filter(p => (p.albums||[]).includes(album.slug));
    photosEl.innerHTML = '';
    subset.forEach(p => {
      const a = document.createElement('button');
      a.className = 'card';
      a.setAttribute('aria-label', `Open ${p.title}`);
      a.innerHTML = \`
        <img class="thumb" loading="lazy" src="\${p.src}" alt="\${p.alt}"/>
        <h4>\${p.title}</h4>
      \`;
      a.addEventListener('click', () => {
        // Reuse global image modal if present on the page (not guaranteed here)
        const modal = document.getElementById('imageModal');
        if(modal){
          document.getElementById('modalImg').src = p.src;
          document.getElementById('modalImg').alt = p.alt || p.title;
          document.getElementById('imageTitle').textContent = p.title;
          document.getElementById('imageCaption').textContent = p.caption || '';
          document.getElementById('imageAlbums').textContent = p.albums?.length ? ('Albums: ' + p.albums.join(', ')) : '';
          modal.showModal();
        }
      });
      photosEl.appendChild(a);
    });

    // simple slideshow through subset
    let timer = null;
    function start(){
      let i=0;
      timer = setInterval(() => {
        if(subset.length === 0) return;
        const p = subset[i % subset.length];
        const modal = document.getElementById('imageModal');
        if(modal){
          document.getElementById('modalImg').src = p.src;
          document.getElementById('modalImg').alt = p.alt || p.title;
          document.getElementById('imageTitle').textContent = p.title;
          document.getElementById('imageCaption').textContent = p.caption || '';
          document.getElementById('imageAlbums').textContent = p.albums?.length ? ('Albums: ' + p.albums.join(', ')) : '';
          modal.showModal();
        }
        i++;
      }, 2000);
      slideBtn.textContent = 'Stop Slideshow';
    }
    function stop(){
      clearInterval(timer); timer=null;
      slideBtn.textContent = 'View as Slideshow';
    }
    slideBtn.onclick = () => timer ? stop() : start();
  }

  backBtn?.addEventListener('click', renderAlbums);

  // Admin-only "create album" (placeholder)
  addAlbumBtn?.addEventListener('click', () => {
    if(localStorage.getItem('isAdmin') !== 'true') return;
    const title = prompt('Album title?'); if(!title) return;
    const slug = title.toLowerCase().replace(/\W+/g,'-');
    const cover = prompt('Cover image URL?'); if(!cover) return;
    const description = prompt('Album description?') || '';
    albums.unshift({ slug, title, cover, description });
    renderAlbums();
    alert('Album created (demo). Persisting requires a backend.');
  });

  renderAlbums();
})();
