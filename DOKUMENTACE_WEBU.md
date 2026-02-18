# Dokumentace webu `farmapodjanovouhorou.cz`

Aktualizováno: 2026-02-18  
Projektová složka: `C:/Users/573/Desktop/FPJH`

---

## 1. Účel projektu

Projekt je multipage frontend web farmy s klientským CMS (bez backendu), postavený na:

- statických HTML stránkách,
- centrálním JavaScript renderu obsahu,
- kombinaci Bootstrap + Tailwind + vlastních CSS tokenů,
- build/deploy pipeline přes Vite a GitHub Pages.

Primárně řeší prezentaci služeb, koní, akcí a kontaktu. Obsah je upravitelný přes `cms.html` a ukládá se do `localStorage`.

---

## 2. Technologie a závislosti

## 2.1 Runtime

- HTML5 + CSS3 + Vanilla JS (ES modules)
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

## 3.1 Stránky (root)

- `index.html` – domovská stránka (`data-page="home"`)
- `sluzby.html` – přehled služeb (`data-page="sluzby"`)
- `akce.html` – akce (`data-page="akce"`)
- `o-nas.html` – o nás (`data-page="o-nas"`)
- `nasi-kone.html` – naši koně (`data-page="nasi-kone"`)
- `kontakt.html` – kontakt (`data-page="kontakt"`)
- `cms.html` – administrační CMS rozhraní (`data-page="cms"`)

Všechny stránky používají stejný vstupní JS modul: `./js/app.js`.

## 3.2 JavaScript moduly (`js/`)

- `app.js` – hlavní aplikační logika (render, navigace, CMS, formulářové chování, modály)
- `storage.js` – načítání/ukládání dat do `localStorage`, import/export JSON
- `defaultData.js` – výchozí obsah webu a struktura dat
- `uiTokens.js` – design dictionary (tokeny + patterny class stringů)

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

Zdroj výchozích dat: `js/defaultData.js`.

---

## 5. Jak funguje aplikace (`js/app.js`)

## 5.1 Inicializace

`init()` provádí:

1. navázání navigace a sticky headeru,
2. navázání login/CMS akcí,
3. navázání CMS live editace a repeaterů,
4. render všech sekcí podle aktivní stránky,
5. aplikaci UI patternů (`applyBootstrapUi()`).

## 5.2 Render vrstva

Klíčové render funkce:

- `renderHero`
- `renderAbout`
- `renderServices`
- `renderHorses`
- `renderHomeActions`
- `renderActions`
- `renderGallery`
- `renderVouchers`
- `renderContact`

Stránky využívají `data-page` a podle něj se renderuje odpovídající obsah i varianta komponent.

## 5.3 Navigace a hlavička

- hamburger menu + otevření/zavření menu
- dropdown logika přes `.nav-dropdown-toggle`
- sticky header stav přes scroll (`.site-header.is-scrolled`)

## 5.4 CMS

- přihlášení (aktuálně klientské, jednoduché credentials)
- práce s draftem vs. persistovanými daty
- repeater editace pro služby/koně/galerii/poukazy
- import/export JSON
- scope filtrování sekcí podle cílové stránky

## 5.5 Modály

- login modal
- horse modal (detail koně + navigace)

---

## 6. Design systém

## 6.1 Tokeny (`js/uiTokens.js`)

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

`vite.config.js` obsahuje vstupy:

- `index.html`
- `sluzby.html`
- `nasi-kone.html`
- `akce.html`
- `o-nas.html`
- `kontakt.html`

Pozn.: `cms.html` není součástí Rollup input mapy, ale je v repozitáři jako samostatná stránka.

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

- Kde měnit obsah: `cms.html` + `js/defaultData.js`
- Kde měnit logiku: `js/app.js`
- Kde měnit design: `styles.css` + `js/uiTokens.js`
- Kde měnit build: `vite.config.js`, `postcss.config.cjs`, `scripts/copy-static-assets.cjs`
- Kde měnit deploy: `.github/workflows/deploy-pages.yml`

