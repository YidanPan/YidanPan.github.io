const fs = require('fs');
const path = require('path');

const notesRoot = path.join(hexo.source_dir, '_posts');

const categories = [
  {
    slug: 'math',
    label: '数学',
    description: '离散数学、微积分、图论、树、生成树与数论。',
    groups: [
      { slug: 'discrete-math', label: '离散数学', match: (relativePath) => relativePath.includes('Discrete Math') },
      { slug: 'calculus', label: '微积分', match: (relativePath) => relativePath.includes('微积分') }
    ]
  },
  {
    slug: 'cs',
    label: '计算机专业课',
    description: 'FDS、LeetCode、Hashing，以及体系化的 CTF 学习。',
    groups: [
      { slug: 'fds', label: 'FDS & LeetCode', match: (relativePath) => relativePath.includes('FDS') },
      { slug: 'ctf', label: 'CTF', match: (relativePath) => relativePath.includes('CTF') }
    ]
  },
  {
    slug: 'general-education',
    label: '通识课',
    description: '社会实践、双创、心理学、奇妙分子、形策与社会发展史。',
    groups: [
      { slug: 'general-education', label: '通识课笔记', match: (relativePath) => relativePath.includes('通识课') }
    ]
  },
  {
    slug: 'python',
    label: 'Python',
    description: 'Python 基础语法与实践记录。',
    groups: [
      { slug: 'python-basics', label: 'Python 基础', match: (relativePath) => path.posix.basename(normalizePath(relativePath)) === 'Python.md' }
    ]
  },
  {
    slug: 'frontend',
    label: 'Frontend',
    description: 'HTML、CSS、JavaScript 与前端随手记。',
    groups: [
      { slug: 'frontend-basics', label: '前端三件套', match: (relativePath) => relativePath.includes('html随手记') }
    ]
  },
  {
    slug: 'other',
    label: 'Other',
    description: '进制转换与其他零散知识。',
    groups: [
      { slug: 'miscellaneous', label: '杂项知识', match: (relativePath) => relativePath.includes('进制转换') }
    ]
  },
  {
    slug: 'tools',
    label: 'Tools / Environment',
    description: 'Shell、VS Code、Trae IDE、API 等工具环境笔记。',
    groups: [
      { slug: 'tools', label: '工具与环境', match: () => false }
    ]
  }
];

const IMAGE_MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const COMMON_IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

function normalizePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function titleFromPath(relativePath) {
  return path.posix.basename(normalizePath(relativePath), path.posix.extname(relativePath));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripFrontMatter(raw) {
  return raw.replace(/^---[\s\S]*?---\s*/, '');
}

function slugFromRelativePath(relativePath) {
  const segments = normalizePath(relativePath)
    .replace(/\.md$/i, '')
    .split('/');
  return segments[0] === segments[1] ? segments.slice(1) : segments;
}

function notePermalink(relativePath) {
  return `/Notes/article/${slugFromRelativePath(relativePath).map((segment) => encodeURIComponent(segment)).join('/')}/`;
}

function noteRoutePath(relativePath) {
  return `Notes/article/${slugFromRelativePath(relativePath).join('/')}/index.html`;
}

function renderDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = IMAGE_MIME_TYPES[ext] || 'application/octet-stream';
  const buffer = fs.readFileSync(filePath);
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

function placeholderDataUri(label) {
  const text = escapeHtml(label || 'image');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f6e9ed"/>
          <stop offset="100%" stop-color="#d9c0c6"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" rx="36" fill="url(#g)"/>
      <rect x="70" y="70" width="1060" height="535" rx="28" fill="rgba(255,255,255,0.42)" stroke="rgba(168,134,140,0.24)"/>
      <circle cx="176" cy="180" r="46" fill="rgba(168,134,140,0.22)"/>
      <rect x="266" y="140" width="630" height="24" rx="12" fill="rgba(86, 68, 73, 0.18)"/>
      <rect x="266" y="184" width="480" height="18" rx="9" fill="rgba(86, 68, 73, 0.12)"/>
      <rect x="112" y="288" width="976" height="238" rx="22" fill="rgba(255,255,255,0.72)" stroke="rgba(168,134,140,0.18)"/>
      <text x="600" y="398" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" fill="#7d6368">Obsidian image not found</text>
      <text x="600" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#8c7277">${text}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function findAssetFile(target, noteRelativeDir) {
  const cleanedTarget = normalizePath(target);
  if (!cleanedTarget) return null;

  const candidates = [];
  const targetHasExtension = path.posix.extname(cleanedTarget) !== '';
  const baseCandidates = targetHasExtension ? [cleanedTarget] : COMMON_IMAGE_EXTS.map((ext) => `${cleanedTarget}${ext}`);
  const noteDir = normalizePath(noteRelativeDir);

  baseCandidates.forEach((candidate) => {
    if (path.posix.isAbsolute(candidate)) {
      candidates.push(path.join(hexo.source_dir, candidate.replace(/^\/+/, '')));
      return;
    }

    candidates.push(path.join(notesRoot, noteDir, candidate));
    candidates.push(path.join(notesRoot, 'images', candidate));
    candidates.push(path.join(hexo.source_dir, 'img', candidate));
    candidates.push(path.join(hexo.source_dir, 'images', candidate));
    candidates.push(path.join(hexo.source_dir, candidate));
  });

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function resolveImageSrc(target, noteRelativePath) {
  const rawTarget = String(target || '').trim();
  if (!rawTarget) return placeholderDataUri('image');
  if (/^(?:https?:)?\/\//i.test(rawTarget) || rawTarget.startsWith('data:')) return rawTarget;

  const imageTarget = rawTarget.split('|')[0].split('#')[0].trim();
  const noteRelativeDir = path.posix.dirname(normalizePath(noteRelativePath));
  const assetPath = findAssetFile(imageTarget, noteRelativeDir);
  if (assetPath) return renderDataUri(assetPath);

  return placeholderDataUri(path.posix.basename(imageTarget || 'image'));
}

function buildNoteLookup(noteSources) {
  const lookup = new Map();

  noteSources.forEach((note) => {
    const relativePath = normalizePath(note.path);
    const pathWithoutExt = relativePath.replace(/\.md$/i, '');
    const title = note.title;
    const baseName = path.posix.basename(pathWithoutExt);

    [relativePath, pathWithoutExt, baseName, title, relativePath.toLowerCase(), pathWithoutExt.toLowerCase(), baseName.toLowerCase(), title.toLowerCase()]
      .filter(Boolean)
      .forEach((key) => {
        if (!lookup.has(key)) lookup.set(key, note);
      });
  });

  return lookup;
}

function resolveNoteTarget(target, noteLookup) {
  const cleaned = normalizePath(target).split('#')[0].trim();
  if (!cleaned) return null;

  const candidates = [
    cleaned,
    cleaned.toLowerCase(),
    path.posix.basename(cleaned),
    path.posix.basename(cleaned).toLowerCase()
  ];

  for (const candidate of candidates) {
    const found = noteLookup.get(candidate);
    if (found) return found;
  }

  return null;
}

function transformObsidianMarkdown(raw, note, noteLookup) {
  let content = stripFrontMatter(raw);

  content = content.replace(/!\[\[([^\]]+)\]\]/g, (_, inner) => {
    const [target, alias] = inner.split('|');
    const altText = (alias || path.posix.basename(normalizePath(target)) || note.title).trim();
    const src = resolveImageSrc(target, note.path);
    return `![${altText}](${src})`;
  });

  content = content.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const [targetPart, aliasPart] = inner.split('|');
    const [target, heading] = targetPart.split('#');
    const resolved = resolveNoteTarget(target, noteLookup);
    if (!resolved) return aliasPart || targetPart;

    const label = (aliasPart || path.posix.basename(normalizePath(target)) || resolved.title).trim();
    const fragment = heading ? `#${encodeURIComponent(heading.trim())}` : '';
    return `[${label}](${resolved.permalink}${fragment})`;
  });

  return content;
}

function buildNotes() {
  const files = walk(notesRoot).filter((file) => path.extname(file).toLowerCase() === '.md');
  const noteSources = [];

  files.forEach((file) => {
    const relativePath = path.relative(notesRoot, file);
    const category = categories.find((item) => item.groups.some((group) => group.match(relativePath)));
    if (!category) return;

    const group = category.groups.find((item) => item.match(relativePath));
    if (!group) return;

    noteSources.push({
      title: titleFromPath(relativePath),
      category: category.label,
      categorySlug: category.slug,
      group: group.label,
      groupSlug: group.slug,
      path: normalizePath(relativePath),
      permalink: notePermalink(relativePath),
      routePath: noteRoutePath(relativePath),
      raw: fs.readFileSync(file, 'utf8')
    });
  });

  const noteLookup = buildNoteLookup(noteSources);
  const notesByGroup = Object.fromEntries(
    categories.flatMap((category) => category.groups.map((group) => [`${category.slug}/${group.slug}`, []]))
  );

  noteSources.forEach((noteSource) => {
    const note = {
      title: noteSource.title,
      category: noteSource.category,
      categorySlug: noteSource.categorySlug,
      group: noteSource.group,
      groupSlug: noteSource.groupSlug,
      path: noteSource.path,
      permalink: noteSource.permalink,
      routePath: noteSource.routePath,
      content: hexo.render.renderSync({
        text: transformObsidianMarkdown(noteSource.raw, noteSource, noteLookup),
        engine: 'md'
      })
    };

    notesByGroup[`${note.categorySlug}/${note.groupSlug}`].push(note);
  });

  Object.values(notesByGroup).forEach((notes) => notes.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')));

  return { notesByGroup };
}

hexo.extend.generator.register('notes-archive', function() {
  const { notesByGroup } = buildNotes();
  const routes = [];

  categories.forEach((category) => {
    const groups = category.groups.map((group) => ({
      ...group,
      notes: notesByGroup[`${category.slug}/${group.slug}`],
      permalink: `/Notes/category/${category.slug}/${group.slug}/`
    }));

    routes.push({
      path: `Notes/category/${category.slug}/index.html`,
      data: {
        title: `${category.label} · Notes`,
        layout: 'notes-category',
        notesCategory: category,
        groups
      },
      layout: 'notes-category'
    });

    groups.forEach((group) => {
      const chapterGroups = {};
      group.notes.forEach((note) => {
        const chapterMatch = note.path.match(/(?:^|\/)Chapter\s+([^/]+)\//i);
        const chapterSlug = chapterMatch ? `chapter-${chapterMatch[1].trim().toLowerCase().replace(/\s+/g, '-')}` : 'other';
        const chapterLabel = chapterMatch ? `Chapter ${chapterMatch[1].trim()}` : 'Other notes';
        if (!chapterGroups[chapterSlug]) chapterGroups[chapterSlug] = { slug: chapterSlug, label: chapterLabel, notes: [] };
        chapterGroups[chapterSlug].notes.push(note);
      });

      const chapters = Object.values(chapterGroups).sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }));
      if (category.slug === 'math' && group.slug === 'discrete-math') {
        routes.push({
          path: `Notes/category/${category.slug}/${group.slug}/index.html`,
          data: {
            title: `${group.label} · ${category.label} · Notes`,
            layout: 'notes-category',
            notesCategory: { label: group.label, description: '按 Chapter 浏览离散数学笔记。' },
            groups: chapters.map((chapter) => ({
              ...chapter,
              permalink: `/Notes/category/${category.slug}/${group.slug}/${chapter.slug}/`
            }))
          },
          layout: 'notes-category'
        });
      } else {
        routes.push({
          path: `Notes/category/${category.slug}/${group.slug}/index.html`,
          data: {
            title: `${group.label} · ${category.label} · Notes`,
            layout: 'notes-group',
            notesCategory: category,
            notesGroup: group,
            notes: group.notes
          },
          layout: 'notes-group'
        });
      }

      if (category.slug === 'math' && group.slug === 'discrete-math') {
        chapters.forEach((chapter) => {
          routes.push({
            path: `Notes/category/${category.slug}/${group.slug}/${chapter.slug}/index.html`,
            data: {
              title: `${chapter.label} · ${group.label} · Notes`,
              layout: 'notes-group',
              notesCategory: { slug: `${category.slug}`, label: group.label, parentPermalink: `/Notes/category/${category.slug}/${group.slug}/` },
              notesGroup: chapter,
              notes: chapter.notes
            },
            layout: 'notes-group'
          });
        });
      }

      group.notes.forEach((note) => {
        routes.push({
          path: note.routePath,
          data: {
            title: `${note.title} · Notes`,
            layout: 'notes-article',
            note
          },
          layout: 'notes-article'
        });
      });
    });
  });

  return routes;
});
