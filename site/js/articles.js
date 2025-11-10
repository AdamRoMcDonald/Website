(async function(){
  const list = document.getElementById('articlesList');
  const addBtn = document.getElementById('addArticleBtn');
  if(!list) return;
  const res = await fetch('/data/articles.json');
  const articles = await res.json();

  function render(){
    list.innerHTML = '';
    articles.forEach(a => {
      const card = document.createElement('article');
      card.className = 'card';
      card.tabIndex = 0;
      card.innerHTML = \`
        <h3>\${a.title}</h3>
        <p class="muted">Published \${new Date(a.published).toLocaleDateString()}</p>
        <p>\${a.summary}</p>
        <p><a href="\${a.url}" aria-label="Open article \${a.title}">Open →</a></p>
      \`;
      list.appendChild(card);
    });
  }

  // Admin-only "new article" (placeholder)
  addBtn?.addEventListener('click', () => {
    if(localStorage.getItem('isAdmin') !== 'true') return;
    const title = prompt('Article title?'); if(!title) return;
    const url = prompt('Link URL?'); if(!url) return;
    const summary = prompt('Short summary?') || '';
    articles.unshift({ title, url, summary, published: new Date().toISOString() });
    render();
    alert('Article added (demo). Persisting requires a backend.');
  });

  render();
})();
