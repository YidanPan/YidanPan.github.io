---
title: Projects
layout: page
---

<div class="projects-layout" data-projects-layout>
  <aside class="projects-nav" aria-label="Project navigation">
    <div class="projects-nav-inner">
      <div class="projects-nav-label">PROJECTS</div>
      <div class="projects-progress"><span id="projectsProgress">1 / 2 Projects</span><i aria-hidden="true"><b id="projectsProgressBar"></b></i></div>
      <nav class="projects-nav-list">
        <a class="project-nav-link is-active" href="#gesture-particle-system" data-project-nav="gesture-particle-system"><span class="project-nav-index">01</span><span class="project-nav-dot"></span><span>3D Gesture<br>Particle System</span></a>
        <a class="project-nav-link" href="#personal-website" data-project-nav="personal-website"><span class="project-nav-index">02</span><span class="project-nav-dot"></span><span>Personal<br>Website</span></a>
      </nav>
    </div>
  </aside>

<div class="projects-content">
<article class="proj-card" id="gesture-particle-system" data-project-card>
<header class="proj-card-head">
<div>
<h2>3D Gesture Particle System</h2>
<div class="proj-label">Python · MediaPipe · OpenGL</div>
</div>
<div class="proj-card-meta"><span class="proj-status proj-status-active">Active</span><time datetime="2024-03">2024.03 – Present</time></div>
</header>

<div class="proj-description">
<p>A real-time hand gesture recognition system that controls an interactive 3D particle field with dynamic physics and visual effects.</p>
<ul>
<li>Real-time hand landmark detection via MediaPipe</li>
<li>Dynamic particle generation and physics simulation</li>
<li>Gesture-based interaction modes</li>
<li>OpenGL rendering for smooth 60fps performance</li>
</ul>
</div>

<div class="proj-links">
<a class="proj-link" href="https://github.com/YidanPan" target="_blank" rel="noopener">GitHub →</a>
</div>
</article>

<article class="proj-card" id="personal-website" data-project-card>
<header class="proj-card-head">
<div>
<h2>Personal Website</h2>
<div class="proj-label">Hexo · EJS · CSS</div>
</div>
<div class="proj-card-meta"><span class="proj-status proj-status-progress">In Progress</span><time datetime="2026-08">2026.08 – Present</time></div>
</header>

<div class="proj-description">
<p>This website — a clean, minimal personal academic homepage built with Hexo static site generator and custom theming inspired by modern academic homepages.</p>
<ul>
<li>Custom responsive sidebar + main layout</li>
<li>Dark mode with CSS custom properties</li>
<li>Pill-style navigation with animated indicator</li>
<li>Merriweather serif typography</li>
</ul>
</div>

<div class="proj-links">
<a class="proj-link" href="https://github.com/YidanPan/YidanPan.github.io" target="_blank" rel="noopener">Source →</a>
<a class="proj-link" href="https://YidanPan.github.io" target="_blank" rel="noopener">Live →</a>
</div>
</article>
</div>
</div>

<script>
(function() {
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project-card]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-project-nav]'));
  var progressLabel = document.getElementById('projectsProgress');
  var progressBar = document.getElementById('projectsProgressBar');
  if (!cards.length || !links.length || !progressLabel || !progressBar) return;

  function activate(id) {
    var index = cards.findIndex(function(card) { return card.id === id; });
    if (index === -1) return;
    links.forEach(function(link) {
      var isActive = link.getAttribute('data-project-nav') === id;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    progressLabel.textContent = (index + 1) + ' / ' + cards.length + ' Projects';
    progressBar.style.height = ((index + 1) / cards.length * 100) + '%';
  }

  var observer = new IntersectionObserver(function(entries) {
    var visible = entries.filter(function(entry) { return entry.isIntersecting; });
    if (visible.length) {
      visible.sort(function(a, b) { return b.intersectionRatio - a.intersectionRatio; });
      activate(visible[0].target.id);
    }
  }, { rootMargin: '-18% 0px -62% 0px', threshold: [0.1, 0.35, 0.65] });

  cards.forEach(function(card) { observer.observe(card); });
  links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var target = document.getElementById(link.getAttribute('data-project-nav'));
      if (!target) return;
      activate(target.id);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '#' + target.id);
    });
  });

  var initialId = window.location.hash.slice(1);
  activate(cards.some(function(card) { return card.id === initialId; }) ? initialId : cards[0].id);
})();
</script>
