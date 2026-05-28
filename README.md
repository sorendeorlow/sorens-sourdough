# Soren's Sourdough

> Swedish Craft in Every Crumb.

A small static website for a home-based sourdough bakery. Hand-crafted levain loaves baked in a 6-quart cast iron Dutch oven, presented through a warm, Scandinavian-minimalist design.

## Stack

- Plain HTML5 / CSS3 / vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com) via CDN (no build step)
- Google Fonts (Fraunces + Inter)
- Designed for **GitHub Pages** hosting

## Structure

```
soren-sourdough/
├── index.html          Home
├── about.html          Story + philosophy
├── loaves.html         Bread catalog (full/half pricing)
├── process.html        6-step baking process
├── order.html          Pre-order form (Formspree-ready)
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/style.css   Custom styles beyond Tailwind
│   ├── images/         Photos (hero, loaves, process, ingredients)
│   └── icons/
└── js/
    └── main.js         Mobile menu, lightbox, order form, etc.
```

## Local preview

Open `index.html` in a browser, or for a tiny local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo (e.g. `soren-sourdough`).
2. In **Settings → Pages**, set the source to the `main` branch, root folder.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

For a custom domain, add a `CNAME` file with your domain name and configure DNS.

## Setting up the order form

The order form on `order.html` is wired for [Formspree](https://formspree.io).

1. Create a free Formspree account and a new form.
2. Replace `YOUR_FORM_ID` in `order.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" ...>
   ```
3. Test by submitting a fake order — it should arrive in your email.

Until that's configured, the form runs in **demo mode** (it validates and shows a confirmation but doesn't actually send anything).

## Updating photos

All photos live in `assets/images/`. To swap:

1. Drop new JPGs into the relevant folder (`loaves/`, `process/`, etc.).
2. Update the matching `src="..."` and `alt="..."` attributes in the HTML.
3. Keep file sizes reasonable — target ~150-300 KB per image for fast load.

Recommended sizes:
- Hero: ~1600×2000 (4:5)
- Loaf cards: ~1000×1000 (square) or ~1000×750 (4:3)
- Process steps: ~900×1125 (4:5)

## Brand colors

| Name        | Hex       | Usage                  |
|-------------|-----------|------------------------|
| Beige       | `#F5F0E8` | Section backgrounds    |
| Cream       | `#FAF7F2` | Page background        |
| Brown       | `#4A3728` | Headings, primary text |
| Brown-soft  | `#6B5340` | Body text              |
| Swedish     | `#2A5C8A` | Accent, links          |
| Crust       | `#B98655` | Highlight, hover       |

## License

© Soren's Sourdough. All rights reserved.

— Tack så mycket.
