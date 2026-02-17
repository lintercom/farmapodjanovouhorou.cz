# Analýza stavu vs. zadání 1.3 (farmapodjanovouhorou.cz)

Datum vyhodnocení: 2026-02-17  
Rozsah kontroly: aktuální stav repozitáře `FPJH` (frontend + build + GH Pages workflow)

---

## 1) Souhrnný stav

- **Hotovo (frontend/UX/UI):** velká část vizuálního redesignu, multipage struktura, klientské CMS přes `localStorage`, build/deploy pipeline na GitHub Pages.
- **Částečně hotovo:** SEO a přístupnost (základ je přítomen, ale chybí klíčové SEO artefakty a formální validace WCAG 2.1 AA).
- **Nehotovo (kritické pro zadání 1.3):** produkční backend formulářů (DB + SMTP + antispam + GDPR workflow), 301 migrace URL, sitemap/robots/canonical, bezpečnostní hlavičky na serveru, měření/analytics governance.

---

## 2) Co je z požadavků už hotové

## 2.1 Architektura, UI a obsah (Fáze 1)

- [x] Nový frontend mimo Webnode (statický web + JS aplikace).
- [x] Multipage web pro Fázi 1 (`index`, `sluzby`, `akce`, `o-nas`, `nasi-kone`, `kontakt`, `cms`).
- [x] Modernizovaný design systém (Bootstrap + Tailwind, tokeny + reusable UI patterns).
- [x] Responzivní layout a mobilní navigace.
- [x] Zachovaná a funkční sticky top navigace + dropdown logika.
- [x] Klientské CMS rozhraní (`cms.html`) + editace obsahu bez zásahu do kódu (pro data uložená v browseru).
- [x] Import/Export JSON pro CMS obsah.
- [x] Migrovaná hlavní obsahová kostra webu (sekce služby/koně/akce/kontakt/vouchery).

## 2.2 Build, nasazení, provoz

- [x] `vite build` pipeline.
- [x] GitHub Actions workflow pro GitHub Pages (`.github/workflows/deploy-pages.yml`).
- [x] Automatický deploy při push do `main`.
- [x] Kopírování statických assetů (`migration_export`, `img`) do `dist`.

## 2.3 A11y základ

- [x] `lang="cs"` v HTML.
- [x] Skip link.
- [x] Základní labely u formulářových polí.
- [x] Viditelný focus styl.

---

## 3) Co je částečně hotové (vyžaduje dopracování)

## 3.1 SEO on-page

- [~] Titulky stránek existují, ale nejsou ověřeny vůči cílové délce/unikátnosti dle zadání pro všechny URL.
- [ ] **Chybí** `meta description` na stránkách.
- [ ] **Chybí** `canonical` tagy.
- [ ] **Chybí** OG/Twitter metadata.
- [ ] **Chybí** JSON-LD (`LocalBusiness/Organization`, případně `Event`).

## 3.2 Obsahové požadavky 1.3

- [~] O nás je obsahově posunuto k rodinnému charakteru/bio/chovu koní, ale je potřeba finální textová validace proti zadavateli.
- [~] „Dárkové poukazy“ jsou přítomné obsahově v sekci/products, ale není potvrzeno, že je to finální samostatná konverzní podoba dle zadání.

## 3.3 Přístupnost

- [~] Základ je implementován.
- [ ] Chybí systematický WCAG 2.1 AA audit (kontrasty, klávesové scénáře, error handling, ARIA mapování napříč všemi stránkami).

---

## 4) Co je nehotové (kritické body zadání 1.3)

## 4.1 Formuláře (KRITICKÉ)

Aktuální stav: web používá klientské formuláře bez produkčního backend workflow.

- [ ] 3 produkční formuláře dle zadání (`kroužky`, `tábory`, `kontakt`) se serverovým zpracováním.
- [ ] Ukládání do DB (včetně schémat polí a metadat).
- [ ] Spolehlivé doručování e-mailů přes SMTP/transakční službu (ne `php mail()`).
- [ ] Antispam: reCAPTCHA/honeypot/rate-limit.
- [ ] GDPR logika u formulářů:
  - [ ] povinný checkbox zásad OÚ,
  - [ ] volitelný marketing opt-in.
- [ ] Thank-you flow + robustní server-side validace.
- [ ] Log odeslání (success/fail + chyba + čas + ID).
- [ ] Admin přehled notifikací.

## 4.2 SEO migrace a indexace

- [ ] 301 redirect mapa starých URL -> nové URL (včetně `/home`, `/o-nas2`, `/l/*`, apod.).
- [ ] Ověření bez redirect chainingu (max 1x 301).
- [ ] `sitemap.xml`.
- [ ] `robots.txt`.
- [ ] Post-launch monitoring 7–14 dní (GSC coverage, 404, doplnění redirectů).

## 4.3 Bezpečnost a produkční hlavičky

- [ ] Konfigurace bezpečnostních hlaviček na hostingu/serveru:
  - [ ] `Strict-Transport-Security`
  - [ ] `Content-Security-Policy`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options`
  - [ ] `Referrer-Policy`
  - [ ] `Permissions-Policy`
- [ ] Cookies governance (Secure/HttpOnly/SameSite + consent režim pro neesenciální cookies).

## 4.4 Výkon a kvalita

- [ ] Formální CWV/Lighthouse baseline a akceptační měření (staging + produkce).
- [ ] Finální image optimalizace pipeline (WebP/AVIF + srcset ověření napříč obsahem).

## 4.5 Provozní a projektové body

- [ ] Staging prostředí + přejímka podle DoD 11.B.
- [ ] Zálohy DB/souborů + retence.
- [ ] GA4/GSC napojení + consent mode.
- [ ] Dovyjasnění URL strategie (`/kontakt` vs `/kontaktujte-nas`, `/akce` vs `/akce-na-farme`, `/clanky/*`).

---

## 5) Gap vůči „CMS bez kódu“ z kapitoly 11.E

Aktuálně je CMS **klientské** (localStorage), což je vhodné pro demo/prototyp, ale ne pro produkční víceuživatelský provoz.

- [ ] Chybí role-based přístup (redaktor/admin) na serveru.
- [ ] Chybí persistovaná databáze obsahu.
- [ ] Chybí audit/edit history.
- [ ] Chybí produkční správa menu/slugs/SEO polí na úrovni CMS modelů.

---

## 6) Doporučené další kroky (priorita)

1. **Backend formulářů + DB + SMTP + antispam + GDPR** (nejvyšší priorita před ostrým spuštěním).  
2. **SEO migrace**: redirect mapa + canonical + sitemap + robots + meta stack (OG/Twitter/JSON-LD).  
3. **Security hardening na hostingu**: hlavičky, cookie politika, consent.  
4. **Staging + DoD testy** (funkční, SEO, A11y, výkon, doručování formulářů).  
5. **Go-live + 7–14 dní monitoring** (GSC/404/konverze/form delivery).

---

## 7) Poznámka k Fázi 2 a Fázi 3

Struktura webu je už dnes připravena na další sekce, ale pro plnohodnotné rozšíření (agroslužby/e-shop) je potřeba dokončit produkční backend a SEO/ops základ z bodů výše.

