# EldarWebpage

Personal portfolio website built with static HTML, CSS, and JavaScript.

## Features

- Responsive layout across desktop and mobile
- Theme toggle with persisted preference
- Motion-aware animations (respects reduced-motion)
- Contact form integration through Formspree
- Page-level SEO metadata (description, Open Graph, Twitter)
- Accessibility improvements (skip link, main landmark, mobile menu ARIA states)

## Project Structure

```text
.
|-- index.html
|-- 404.html
|-- pages/
|   |-- about.html
|   |-- experience.html
|   |-- projects.html
|   |-- stack.html
|   `-- contact.html
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- images/
|   `-- Eldar.jpeg
`-- assets/
		`-- Eldar Resume.pdf
```

## Run Locally

Any static file server works.

```bash
git clone https://github.com/eldardje/EldarWebpage.git
cd EldarWebpage
python -m http.server 8080
```

Open http://localhost:8080.

## Content and Config Notes

- Contact form action is configured in [pages/contact.html](pages/contact.html).
- Canonical and OG URLs currently use placeholders (`https://your-domain.example/...`).
	Replace them with your production domain before publishing.
- Resume download points to [assets/Eldar Resume.pdf](assets/Eldar%20Resume.pdf).

## Shared Template Workflow

Shared page blocks are deduplicated in [templates/shared/head-links.html](templates/shared/head-links.html), [templates/shared/nav.html](templates/shared/nav.html), [templates/shared/mobile-menu.html](templates/shared/mobile-menu.html), [templates/shared/footer.html](templates/shared/footer.html), and [templates/shared/theme-toggle.html](templates/shared/theme-toggle.html).

Regenerate all HTML pages after editing shared blocks:

```bash
node tools/build-pages.js
```

The build script updates:

- `index.html`
- `404.html`
- `pages/about.html`
- `pages/experience.html`
- `pages/projects.html`
- `pages/stack.html`
- `pages/contact.html`

Generated regions are marked with comment guards in each page:

- `<!-- SHARED:HEAD START --> ... <!-- SHARED:HEAD END -->`
- `<!-- SHARED:NAV START --> ... <!-- SHARED:NAV END -->`
- `<!-- SHARED:FOOTER START --> ... <!-- SHARED:FOOTER END -->`

## QA Checklist

- Verify internal page links still animate on normal left click.
- Verify Ctrl/Cmd-click and middle click open links normally.
- Verify mobile menu updates `aria-expanded` and closes on Escape.
- Verify skip link appears on keyboard focus and jumps to main content.
- Verify all `target="_blank"` links include `rel="noopener noreferrer"`.
- Verify reduced motion disables animations and transition effects.

## Deploy

Deploy as a static site (GitHub Pages, Netlify, Vercel, or any static host).

Before deploy:

1. Replace canonical/OG placeholder URLs with your real domain.
2. Validate social preview tags with LinkedIn/Twitter validators.
3. Smoke test all pages and contact submission flow.
