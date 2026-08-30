(function () {
  var list = document.querySelector('[data-home-updates]');
  if (!list) return;

  var icons = {
    project: '<svg viewBox="0 0 24 24"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2.5h6.5A2.5 2.5 0 0 1 21 10v8.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5z"/><path d="M3 10h18"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h6"/></svg>',
    blog: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h6"/></svg>'
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function relativeDate(value) {
    var date = new Date(value);
    var now = new Date();
    var days = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (date.getFullYear() === now.getFullYear()) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  fetch('/home-updates.json', { cache: 'no-store' })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) {
      var updates = data && Array.isArray(data.updates) ? data.updates : [];
      if (!updates.length) return;
      list.innerHTML = updates.map(function (item) {
        var type = item.type === 'project' || item.type === 'blog' ? item.type : 'note';
        var label = type === 'project' ? 'Project' : type === 'blog' ? 'Blog' : 'Note';
        return '<a href="' + escapeHtml(item.href) + '" class="feed-item">'
          + '<span class="feed-icon feed-icon-' + type + '" aria-hidden="true">' + icons[type] + '</span>'
          + '<span class="feed-copy"><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.description) + '</small></span>'
          + '<span class="feed-side"><time class="feed-time" datetime="' + escapeHtml(item.updated) + '">' + relativeDate(item.updated) + '</time><span class="feed-meta feed-meta-' + type + '">' + label + '</span></span>'
          + '</a>';
      }).join('');
    })
    .catch(function () {});
})();
