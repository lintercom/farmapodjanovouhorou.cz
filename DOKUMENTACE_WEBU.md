# Dokumentace webu `farmapodjanovouhorou.cz`

Aktualizováno: 2026-02-19  
Projektová složka: `farmapodjanovouhorou`

---

## 1. Účel projektu

Projekt je SPA (Single Page Application) frontend web farmy s klientským CMS (bez backendu), postavený na:

- React + React Router,
- TypeScript,
- kombinaci Bootstrap + Tailwind + vlastních CSS tokenů,
- build/deploy pipeline přes Vite a GitHub Pages.

Primárně řeší prezentaci služeb, koní, akcí a kontaktu. Obsah je upravitelný přes `/cms` a ukládá se do `localStorage`.

---

## 2. Technologie a závislosti

## 2.1 Runtime

- React `19` + React Router `7`
- TypeScript
- Bootstrap `5.3.8`
- Tailwind CSS `4.1.18` (přes PostCSS plugin)
- Vite `7.3.1` (build/dev/preview)

## 2.2 Nástroje

- ESLint (`eslint.config.js`)
- GitHub Actions (deploy na GitHub Pages)

## 2.3 NPM skripty (`package.json`)

- `npm run dev` – lokální dev server (Vite)
- `npm run build` – produkční build
- `npm run postbuild` – kopírování statických assetů do `dist`
- `npm run preview` – preview buildu
- `npm run lint` – lint JS souborů

---

## 3. Struktura projektu a role souborů

## 3.1 Stránky (SPA)

- `index.html` – jediný vstupní HTML soubor, React mount point
- React Router trasy: `/`, `/sluzby`, `/akce`, `/o-nas`, `/nasi-kone`, `/kontakt`, `/cms`

## 3.2 Zdrojový kód (`src/`)

- `main.tsx` – vstupní bod aplikace
- `App.tsx` – routing a layout
- `layout/` – SiteLayout, Header, Footer
- `pages/` – HomePage, ServicesPage, ActionsPage, HorsesPage, AboutPage, ContactPage, CmsPage
- `components/` – Hero, ServicesSection, HorsesSection, HorseCarousel, HorseModal, ContactSection, atd.
- `state/AppDataContext.tsx` – Context API pro data + persist do localStorage
- `data/defaultData.ts` – výchozí obsah webu a struktura dat
- `utils/` – storage.ts, uiTokens.ts, validators.ts, helpers.ts

## 3.3 Styling

- `styles.css` – hlavní stylesheet:
  - import Bootstrap
  - import Tailwind
  - CSS tokeny (`:root`)
  - layout, komponenty, responsive pravidla

## 3.4 Konfigurace

- `vite.config.js` – multipage vstupy pro build
- `postcss.config.cjs` – Tailwind + Autoprefixer
- `eslint.config.js` – lint pravidla a prostředí
- `scripts/copy-static-assets.cjs` – post-build kopie složek `migration_export/` a `img/`

## 3.5 CI/CD

- `.github/workflows/deploy-pages.yml` – build a deploy na GitHub Pages při pushi do `main`

---

## 4. Datový model CMS

Data jsou uložená pod klíčem `farmCmsDataV2` v `localStorage`.

Kořenová struktura:

- `settings`
  - `siteName`, `logoText`, `primaryColor`, `secondaryColor`, `accentColor`, `fontFamily`, `favicon`, `footerText`
- `sections`
  - `hero`
  - `about`
  - `services` (seznam položek)
  - `horses` (seznam položek + foto galerie koně)
  - `gallery` (seznam obrázků)
  - `vouchers`
  - `contact`

Zdroj výchozích dat: `src/data/defaultData.ts`.

---

## 5. Jak funguje aplikace (React)

## 5.1 Inicializace

`main.tsx` mountuje React aplikaci do `#root`. `App.tsx` obaluje routy v `AppDataProvider` a `SiteLayout`.

## 5.2 Komponenty a stránky

- `Hero`, `AboutSection`, `ServicesSection`, `HorsesSection`, `HomeActionsSection`
- `ActionsSection`, `ContactSection`, `HorseCarousel`, `HorseModal`
- Stránky: `HomePage`, `ServicesPage`, `ActionsPage`, `HorsesPage`, `AboutPage`, `ContactPage`, `CmsPage`

## 5.3 Navigace a hlavička

- hamburger menu + otevření/zavření menu (mobilní)
- dropdown logika pro Služby (desktop)
- sticky header stav přes scroll (`.site-header.is-scrolled`)

## 5.4 CMS

- přihlášení (klientské, admin/admin)
- repeater editace pro služby/koně/galerii/poukazy
- import/export JSON
- scope filtrování sekcí podle cílové stránky

## 5.5 Modály

- login modal (CmsPage)
- horse modal (detail koně + navigace fotografií)

---

## 6. Design systém

## 6.1 Tokeny (`src/utils/uiTokens.ts`)

- barvy: page bg, section bg, texty, accent green/brown
- radius: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- spacing: sekce, container, card padding

## 6.2 Reusable patterny

- `SectionContainer`
- `FloatingPanel`
- `FloatingServiceCard`
- `MinimalContentCard`
- `PrimaryButton`
- `SecondaryButton`
- `FormField`

Patterny se přidávají přes helper `addPatternClasses()`.

## 6.3 CSS tokeny (`styles.css`)

V `:root` jsou centrální proměnné pro:

- pozadí, textové barvy, accent barvy
- stíny (`--shadow-*`)
- radius (`--radius-*`)
- spacing (`--space-*`)
- font stack

---

## 7. Build a nasazení

## 7.1 Build

`vite.config.js` používá jeden vstup `index.html`. React Router zajišťuje SPA navigaci. Pro GitHub Pages se kopíruje `index.html` jako `404.html` pro SPA fallback.

## 7.2 Post-build

`scripts/copy-static-assets.cjs` kopíruje:

- `migration_export/`
- `img/`

do složky `dist/`, aby byly assety dostupné i po deployi.

## 7.3 GitHub Pages

Workflow `deploy-pages.yml`:

1. checkout
2. setup Node 20
3. `npm ci`
4. `npm run build`
5. copy static media
6. upload artifact
7. deploy na GitHub Pages

---

## 8. Stav funkcionalit

## 8.1 Implementováno

- multipage frontend
- moderní UI a responsivita
- klientské CMS (editace + JSON import/export)
- build/deploy pipeline
- základní a11y prvky (skip link, focus, labely)

## 8.2 Důležitá omezení

- CMS je pouze klientský (`localStorage`), bez serverové persistence.
- Přihlašovací údaje CMS jsou v klientském kódu (demo přístup, ne produkční zabezpečení).
- Kontaktní/rezervační formuláře nemají serverové zpracování (DB/SMTP/antispam).
- Chybí kompletní SEO vrstva (canonical/meta description/OG/JSON-LD/sitemap/robots).
- Chybí produkční bezpečnostní hlavičky řešené na úrovni hostingu/serveru.

---

## 9. Doporučené produkční kroky

1. Nasadit backend formulářů (DB + SMTP + antispam + GDPR logika).
2. Doplnit SEO migraci (301 mapa, canonical, sitemap.xml, robots.txt, OG/Twitter, JSON-LD).
3. Nastavit bezpečnostní hlavičky na hostingu.
4. Zavést monitoring (GSC/GA4, logy doručování formulářů, 404/redirect monitoring).
5. Přesunout CMS autentizaci a data na serverovou vrstvu.

---

## 10. Rychlá orientace pro vývojáře

- Kde měnit obsah: stránka `/cms` (CmsPage) + `src/data/defaultData.ts`
- Kde měnit logiku: `src/` komponenty a stránky
- Kde měnit design: `styles.css` + `src/utils/uiTokens.ts`
- Kde měnit build: `vite.config.js`, `postcss.config.cjs`, `scripts/copy-static-assets.cjs`
- Kde měnit deploy: `.github/workflows/deploy-pages.yml`

