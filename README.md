# Caferio — Luxury Restaurant & Café Website

A premium, fully responsive, **multi-page** restaurant website built with nothing but
**HTML5, CSS3 and vanilla JavaScript (ES6)**. No frameworks, no build step, no dependencies.

## Project structure

```
Restaurant/
├── index.html            Home (cinematic video hero, menu, chefs, gallery, blog…)
├── about.html            Story, mission, vision, timeline, achievements
├── menu.html             Full carte with category filtering
├── menu-details.html     Single dish: ingredients, nutrition, reviews, related
├── chefs.html            The full brigade with bios and social links
├── gallery.html          Masonry gallery, category filter, lightbox
├── reservation.html      Validated booking form + success modal
├── blog.html             Article grid with sidebar and pagination
├── blog-details.html     Article, author box, comments, comment form
├── contact.html          Map, info, hours, validated contact form
│
├── css/
│   ├── style.css         Design tokens, layout, components
│   ├── responsive.css    Breakpoints 1400 / 1200 / 992 / 768 / 576 / 400
│   └── animation.css     Keyframes, scroll-reveal states, hover effects
│
├── js/
│   ├── main.js           Preloader, sticky header, mobile nav, search popup,
│   │                     scroll progress, ripple, cursor, page transitions
│   ├── slider.js         Hero video control, testimonial slider, video popup
│   ├── menu-filter.js    Menu category filtering
│   ├── gallery.js        Gallery filtering + accessible lightbox
│   ├── reservation.js    Form validation + success modals
│   ├── counter.js        Animated statistics + offer countdown
│   └── animation.js      Scroll-reveal observer + parallax
│
├── assets/
│   ├── images/           hero-poster.jpg, experience-poster.jpg
│   ├── videos/           hero-walkthrough.mp4, customer-experience.mp4
│   ├── icons/            favicon.svg
│   └── fonts/            (drop self-hosted font files here if desired)
│
├── robots.txt
├── sitemap.xml
└── README.md
```

## Running locally

Open `index.html` directly in any browser — that's it.
For a closer-to-production experience (correct MIME types, relative URLs), serve the folder:

```bash
python3 -m http.server 8000      # then visit http://localhost:8000
```

## Replacing images and video

* **Hero video** — replace `assets/videos/hero-walkthrough.mp4` and the matching
  poster `assets/images/hero-poster.jpg`. The source is lazy-attached in `js/slider.js`
  via the `data-src` attribute, so keep that attribute if you swap the markup.
* **Experience video** — replace `assets/videos/customer-experience.mp4`.
* **Photography** — dish, chef and gallery photos are referenced by URL in the `IMG`
  map at the top of each page's markup. Drop your own files into `assets/images/`
  and change the `src` (and `data-full` for gallery images, which points at the
  large lightbox version).

## Adding content

* **Menu item** — copy any `<article class="food-card">` block in `menu.html`.
  Set `data-category` to one or more of: `breakfast lunch dinner pizza burger
  coffee dessert drinks`. The filter picks it up automatically.
* **Gallery image** — copy a `<figure class="gallery-item">` in `gallery.html`.
  Set `data-category` (`interior food coffee events`), and optionally add
  `tall` or `wide` for masonry spans.
* **Blog post** — copy a `<article class="post-card">` in `blog.html` and duplicate
  `blog-details.html` for the full article.
* **Chef** — copy a `<article class="chef-card">` in `chefs.html`.

## Theming

Every colour, shadow, radius and font is a CSS variable in the `:root` block at the
top of `css/style.css`:

| Token        | Value     | Use            |
|--------------|-----------|----------------|
| `--brown`    | `#3E2723` | Primary        |
| `--gold`     | `#D4AF37` | Secondary      |
| `--cream`    | `#FFF8E7` | Accent surface |
| `--charcoal` | `#22201F` | Body text      |

Headings use **Playfair Display**, body copy uses **Poppins** (loaded from Google Fonts;
swap for self-hosted files in `assets/fonts/` if you prefer).

## Accessibility & SEO

Semantic landmarks, one `<h1>` per page, skip link, ARIA labels, keyboard-operable
lightbox and modals, visible focus rings, `prefers-reduced-motion` support, alt text
on every image, per-page meta/Open Graph/Twitter tags, canonical URLs, JSON-LD
(Restaurant, Article, Product, BreadcrumbList), `robots.txt` and `sitemap.xml`.

## Browser compatibility

Chrome, Edge, Firefox, Safari, Opera (latest two versions) and modern mobile browsers.
Graceful fallbacks: poster image if video autoplay is blocked, class-based reveal if
`IntersectionObserver` is missing, `src` swap if native lazy-loading is unsupported.
