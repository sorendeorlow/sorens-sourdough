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

## Deploy to Vercel (Recommended)

This site now uses Vercel for hosting + serverless functions (required for Stripe Checkout).

1. Push your changes to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import the `sorens-sourdough` repo.
3. Vercel will auto-detect it as a static site.
4. Add the following **Environment Variables** in the Vercel dashboard:
   - `STRIPE_SECRET_KEY` → your `sk_live_...` key (or `sk_test_...` for testing)
   - (Optional but recommended) `STRIPE_WEBHOOK_SECRET` for later fulfillment webhooks
5. Deploy. Your site will be live at a `vercel.app` URL (you can add a custom domain later).

The `api/create-checkout-session.js` function will be deployed automatically.

**Note:** GitHub Pages is no longer used for the main site because it cannot run serverless functions.

## Setting up the order form + Stripe

The order form now uses a two-part flow:
- Order details are still sent via **Formspree** (email notification)
- Payment is handled via **Stripe Checkout** (secure hosted page)

### Formspree (order details)
Keep your existing Formspree form ID in `order.html` (`mqejjoev` is currently set).

### Stripe
1. In your Stripe Dashboard, create **Products & Prices** for:
   - Country Levain Full ($16)
   - Country Levain Half ($9)
2. Add your **Secret Key** as the `STRIPE_SECRET_KEY` environment variable in Vercel (see deployment section above).
3. (Later) You can replace the `price_data` in `api/create-checkout-session.js` with your actual Price IDs for better reporting.

The current implementation uses `price_data` (dynamic) so you can go live quickly without creating Price IDs first.

## Setting up the newsletter popup

The homepage popup (`index.html`) collects email addresses through Formspree too. It appears after 12 seconds, when a visitor scrolls past ~35% of the page, or on desktop exit-intent — whichever comes first. Dismissed visitors won't see it again for 30 days; subscribers never see it again (state stored in `localStorage` under `cb_signup_state`).

1. Create a second Formspree form for newsletter signups (separate from the order form so they don't co-mingle).
2. Replace `YOUR_NEWSLETTER_FORM_ID` in `index.html`:
   ```html
   <form id="signup-form" action="https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID" ...>
   ```
3. Until configured, the popup runs in **demo mode** (shows the thank-you state without actually sending).

## Setting up the review form

The home page has a "Tried a loaf? Tell us how it went." form directly under the testimonials. Submissions land in a third Formspree inbox so Soren can curate which notes get promoted into the visible quote grid.

1. Create a third Formspree form (e.g. `Communion Breads — Reviews`).
2. Replace `YOUR_REVIEW_FORM_ID` in `index.html`:
   ```html
   <form id="review-form" action="https://formspree.io/f/YOUR_REVIEW_FORM_ID" ...>
   ```
3. Submissions include: `name`, `email` (private), `rating` (1–5), `review` text, and `publish_ok` (whether the reviewer consented to publishing their first name + last initial).

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
