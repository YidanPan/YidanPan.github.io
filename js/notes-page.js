(function () {
  var page = document.querySelector('[data-notes-page]');
  if (!page) return;

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
