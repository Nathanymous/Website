# &gt;/NathanVerkerk

Personal portfolio site with a dual-mode interface: a light **personal** side and a dark **developer** side, switched with a sliding pill toggle.

---

## Project structure

```
.
├── index.html          Markup and page structure
├── css/
│   └── styles.css      All styling, organised in 10 numbered sections
├── js/
│   └── script.js       Theme switching, expand/collapse, copyright year
├── images/
│   ├── linkedin.png    Footer social icon
│   ├── github.webp     Footer social icon
│   ├── credly.png      Footer social icon
│   ├── circle-user.png Source reference for the person icon
│   ├── cpu.png         Source reference for the chip icon
│   ├── chevron-right.png
│   └── chevron-down.png
└── README.md
```

**Note on images** — the toggle and chevron icons are rendered as inline SVG in
`index.html` rather than loaded from `images/`. Inline SVG inherits `currentColor`,
which lets a single icon recolour cleanly across both themes without CSS filter
tricks. The PNGs are kept as source references. The three footer logos *are*
loaded from `images/`.

---

## How it works

### Theme switching

Clicking the pill toggles a single class on `<body>`:

| State | Body class | Theme | Visible section |
|---|---|---|---|
| Personal | *(none)* | Light — white background | `#section-personal` |
| Developer | `.dev-mode` | Dark — near-black background | `#section-dev` |

Every colour is a CSS custom property defined twice — once under `:root`, once
under `body.dev-mode`. Flipping the class cascades the entire palette, so JS
never touches individual styles.

The accent green `#3ecf8e` is intentionally identical in both themes.

### Expandable items

Items prefixed with a chevron open into a numbered, code-editor-style block.
Only the label row is clickable; the expanded text below it is not. Toggling
swaps the chevron's SVG `path` data between right and down.

Currently expandable: **Theater** (personal) and **Acronis** (developer).

### Copyright year

The footer year is injected by JS from `new Date().getFullYear()`, so it
updates automatically each January.

---

## Editing content

### Add a plain list item

```html
<div class="item">
  <div class="item-label"><span class="prefix-slash">/</span>Your Label</div>
</div>
```

### Add an expandable item

```html
<div class="item expandable">
  <div class="item-label" data-expand>
    <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6"/>
    </svg>Your Label
  </div>
  <div class="expand-body">
    <div class="line"><span class="ln">0</span><span class="lc">First line</span></div>
    <div class="line"><span class="ln">1</span><span class="lc">Second line</span></div>
  </div>
</div>
```

The `data-expand` attribute is what wires the click handler — don't omit it.
Line numbers in `.ln` are written manually and start at `0`.

### Change the accent colour

Edit `--green` in **both** blocks at the top of `css/styles.css`:

```css
:root          { --green: #3ecf8e; }
body.dev-mode  { --green: #3ecf8e; }
```

### Update social links

Edit the three `<a href="...">` values in the footer of `index.html`.

---

## Placeholder content

Replace before going live:

- **Theater** — currently lorem ipsum
- **Acronis** — "Naam certificaat 1–4"

---

## Typography

[Zodiak](https://www.fontshare.com/fonts/zodiak) (Indian Type Foundry), loaded
from the Fontshare CDN in weights 400 and 700. Falls back to Georgia, then a
generic serif. Code blocks use Courier New.

---

## Running locally

No build step. Open `index.html` in a browser.

To serve over HTTP instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Browser support

Uses CSS custom properties, flexbox, and `Element.closest()` — supported in all
current browsers. Internet Explorer is not supported.

---

© Nathan Verkerk
