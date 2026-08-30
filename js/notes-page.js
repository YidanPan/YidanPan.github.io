(function () {
  var page = document.querySelector('[data-notes-page]');
  if (!page) return;

  fetch('/Notes/notes-summary.json', { cache: 'no-store' })
    .then(function (response) { return response.ok ? response.json() : []; })
    .then(function (categories) {
      categories.forEach(function (category) {
        var card = page.querySelector('a[href^="/Notes/category/' + category.slug + '/"]');
        if (!card) return;

        if (!category.count) {
          card.hidden = true;
          return;
        }

        card.href = category.href;
        var chips = card.querySelector('.notes-chip-list');
        if (chips) {
          chips.innerHTML = category.tags.slice(0, 3).map(function (tag) {
            return '<span class="notes-chip">' + tag + '</span>';
          }).join('');
        }

        var host = card.querySelector('.notes-card-body') || card;
        var footer = document.createElement('div');
        footer.className = 'notes-card-footer';
        var link = card.querySelector('.notes-card-link');
        if (link) footer.appendChild(link);

        host.appendChild(footer);
      });
    })
    .catch(function () {});

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
    sections.forEach(function (section) { if (section.offsetTop <= probe) id = section.id; });
    activate(id);
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var target = document.getElementById(link.getAttribute('data-notes-nav'));
      if (!target) return;
      history.replaceState(null, '', '#' + target.id);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activate(target.id);
    });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
