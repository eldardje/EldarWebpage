const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHARED = path.join(ROOT, 'templates', 'shared');

const PAGES = [
  { file: 'index.html', depth: 0, active: 'home', contactActive: false },
  { file: '404.html', depth: 0, active: null, contactActive: false },
  { file: path.join('pages', 'about.html'), depth: 1, active: 'about', contactActive: false },
  { file: path.join('pages', 'experience.html'), depth: 1, active: 'experience', contactActive: false },
  { file: path.join('pages', 'projects.html'), depth: 1, active: 'projects', contactActive: false },
  { file: path.join('pages', 'stack.html'), depth: 1, active: 'stack', contactActive: false },
  { file: path.join('pages', 'contact.html'), depth: 1, active: null, contactActive: true },
];

function readShared(name) {
  return fs.readFileSync(path.join(SHARED, name), 'utf8').trim();
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.replace(/\r?\n/g, '\n') + '\n', 'utf8');
}

function render(template, tokens) {
  return template.replace(/{{([A-Z0-9_]+)}}/g, (_, key) => tokens[key] ?? '');
}

function links(depth) {
  if (depth === 0) {
    return {
      HOME_HREF: 'index.html',
      ABOUT_HREF: 'pages/about.html',
      EXPERIENCE_HREF: 'pages/experience.html',
      PROJECTS_HREF: 'pages/projects.html',
      STACK_HREF: 'pages/stack.html',
      CONTACT_HREF: 'pages/contact.html',
      CSS_HREF: 'css/style.css',
    };
  }

  return {
    HOME_HREF: '../index.html',
    ABOUT_HREF: 'about.html',
    EXPERIENCE_HREF: 'experience.html',
    PROJECTS_HREF: 'projects.html',
    STACK_HREF: 'stack.html',
    CONTACT_HREF: 'contact.html',
    CSS_HREF: '../css/style.css',
  };
}

function navClasses(active) {
  const cls = { home: 'nav-link', about: 'nav-link', experience: 'nav-link', projects: 'nav-link', stack: 'nav-link' };
  if (active && cls[active]) {
    cls[active] = 'nav-link active';
  }
  return {
    HOME_CLASS: cls.home,
    ABOUT_CLASS: cls.about,
    EXPERIENCE_CLASS: cls.experience,
    PROJECTS_CLASS: cls.projects,
    STACK_CLASS: cls.stack,
  };
}

function replaceHeadLinks(html, headLinks) {
  const headPattern = /(<title[^>]*>[\s\S]*?<\/title>)\s*[\s\S]*?(<\/head>)/;
  if (!headPattern.test(html)) {
    throw new Error('Could not locate <head> shared block after <title>.');
  }
  const wrapped = `<!-- SHARED:HEAD START -->\n  ${headLinks.replace(/\n/g, '\n  ')}\n  <!-- SHARED:HEAD END -->`;
  return html.replace(headPattern, `$1\n  ${wrapped}\n$2`);
}

function replaceNavAndMenu(html, nav, mobileMenu) {
  const navPattern = /(?:<!-- SHARED:NAV START -->[\s\S]*?<!-- SHARED:NAV END -->|<nav id="nav">[\s\S]*?<\/nav>[\s\S]*?<div class="mobile-menu" id="mobileMenu"[\s\S]*?<\/div>)/;
  if (!navPattern.test(html)) {
    throw new Error('Could not locate nav/mobile menu block.');
  }
  const combined = `<!-- SHARED:NAV START -->\n\n${nav}\n${mobileMenu}\n\n<!-- SHARED:NAV END -->`;
  return html.replace(navPattern, combined);
}

function replaceFooter(html, footer) {
  const footerPattern = /(?:<!-- SHARED:FOOTER START -->[\s\S]*?<!-- SHARED:FOOTER END -->|<footer class="footer">[\s\S]*?<\/footer>)/;
  if (!footerPattern.test(html)) {
    throw new Error('Could not locate footer block.');
  }
  const wrapped = `<!-- SHARED:FOOTER START -->\n\n${footer}\n\n<!-- SHARED:FOOTER END -->`;
  return html.replace(footerPattern, wrapped);
}

function main() {
  const headTemplate = readShared('head-links.html');
  const navTemplate = readShared('nav.html');
  const mobileTemplate = readShared('mobile-menu.html');
  const footerTemplate = readShared('footer.html');
  const themeToggle = readShared('theme-toggle.html');

  PAGES.forEach((page) => {
    const filePath = path.join(ROOT, page.file);
    let html = fs.readFileSync(filePath, 'utf8');

    const hrefs = links(page.depth);
    const classes = navClasses(page.active);

    const tokens = {
      ...hrefs,
      ...classes,
      THEME_TOGGLE: themeToggle,
      CONTACT_CTA_CLASS: page.contactActive ? 'nav-cta active' : 'nav-cta',
    };

    const headLinks = render(headTemplate, tokens);
    const nav = render(navTemplate, tokens);
    const mobile = render(mobileTemplate, tokens);
    const footer = render(footerTemplate, tokens);

    html = replaceHeadLinks(html, headLinks);
    html = replaceNavAndMenu(html, nav, mobile);
    html = replaceFooter(html, footer);

    writeFile(filePath, html);
    console.log(`Updated ${page.file}`);
  });

  console.log('Done. Shared head/nav/footer regenerated for all pages.');
}

main();
