(function () {
  var page = document.querySelector('[data-notes-page]');
  if (!page) return;

  var search = page.querySelector('[data-notes-search]');
  var input = page.querySelector('#notes-search-input');
  var results = page.querySelector('[data-search-results]');
  var status = page.querySelector('[data-search-status]');
  var notes = [];
  if (search) search.hidden = false;
  function renderSearch() {
    var query = input.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    results.hidden = !query;
    if (!query) { status.textContent = ''; return; }
    var matches = notes.filter(function(note) {
      return query.split(/\s+/).every(function(term) {
        return [note.title, note.category, note.group, note.path].join(' ').toLocaleLowerCase().includes(term);
      });
    });
    status.textContent = matches.length ? '找到 ' + matches.length + ' 篇笔记' : '没有匹配的笔记，试试其他关键词。';
    matches.forEach(function(note) {
      var link = document.createElement('a');
      link.className = 'notes-search-result';
      link.href = note.permalink;
      var title = document.createElement('strong');
      title.textContent = note.title;
      var detail = document.createElement('small');
      detail.textContent = note.category + ' / ' + note.group;
      link.append(title, detail);
      results.appendChild(link);
    });
  }
  if (input) {
    input.disabled = true;
    status.textContent = '正在加载搜索…';
    fetch('/Notes/notes-index.json').then(function(response) {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json();
    }).then(function(data) {
      notes = data;
      input.disabled = false;
      renderSearch();
    }).catch(function() { status.textContent = '搜索暂时不可用，请通过下方分类浏览。'; });
    input.addEventListener('input', renderSearch);
  }

  var sections = Array.prototype.slice.call(page.querySelectorAll('[data-notes-section]'));
  var links = Array.prototype.slice.call(page.querySelectorAll('[data-notes-nav]'));
  var fill = page.querySelector('[data-notes-progress-fill]');
  if (!sections.length || !links.length || !fill) return;

  function activate(id) {
    links.forEach(function (link) {
      var active = link.getAttribute('data-notes-nav') === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    var doc = document.documentElement;
    var total = Math.max(doc.scrollHeight - window.innerHeight, 1);
    fill.style.width = (Math.min(window.scrollY / total, 1) * 100).toFixed(2) + '%';
    var probe = window.scrollY + window.innerHeight * 0.42;
    var id = sections[0].id;
    sections.forEach(function (section) { if (window.scrollY + section.getBoundingClientRect().top <= probe) id = section.id; });
    activate(id);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
