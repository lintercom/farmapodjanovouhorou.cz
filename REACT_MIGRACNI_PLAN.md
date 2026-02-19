# React migrační plán

Projekt: `farmapodjanovouhorou.cz`  
Repo: `C:/Users/573/Desktop/FPJH`  
Datum: 2026-02-19

---

## 1) Cíl migrace

Přepsat současnou Vanilla JS architekturu na React tak, aby:

- zůstala zachovaná funkčnost webu i CMS,
- nedošlo k rozbití navigace ani URL struktury,
- byl projekt připravený na další rozvoj (Fáze 2/3),
- byla výrazně zlepšená udržovatelnost (komponenty, stav, testování).

---

## 2) Aktuální stav (vstup do migrace)

Současná aplikace:

- multipage HTML (`index`, `sluzby`, `akce`, `o-nas`, `nasi-kone`, `kontakt`, `cms`)
- centrální logika v `js/app.js` (render přes `innerHTML`, event binding)
- data v `localStorage` přes `js/storage.js`
- výchozí obsah v `js/defaultData.js`
- design dictionary v `js/uiTokens.js`
- styling: Bootstrap + Tailwind + custom `styles.css`
- build/deploy: Vite + GitHub Pages

Klíčové omezení: CMS a formuláře jsou klientské (bez backend persistence).

---

## 3) Co migrovat do Reactu (priorita)

## 3.1 Nejvyšší priorita

1. **Render vrstva z `app.js`**  
   `renderHero`, `renderServices`, `renderHorses`, `renderActions`, `renderContact`, atd.

2. **Interaktivní UI logika**  
   - modal koní  
   - carousel koní  
   - mobilní menu + dropdown state

3. **CMS formuláře + repeatery**  
   Přepis event-driven DOM logiky na controlled React komponenty.

## 3.2 Střední priorita

4. **Layout a sdílené komponenty**  
   Header, Footer, SectionContainer, Card varianty, Button varianty, FormField.

5. **State management vrstva**  
   Persisted data + CMS draft + UI state.

## 3.3 Nižší priorita

6. **Refaktor helperů + test coverage**  
   Utility funkce, validace, modulární testy, smoke E2E flows.

---

## 4) Cílová architektura (návrh)

## 4.1 Doporučená struktura

```text
src/
  app/
    App.tsx
    routes.tsx
  layout/
    SiteLayout.tsx
    Header.tsx
    Footer.tsx
  pages/
    HomePage.tsx
    ServicesPage.tsx
    ActionsPage.tsx
    HorsesPage.tsx
    AboutPage.tsx
    ContactPage.tsx
    CmsPage.tsx
  components/
    Hero.tsx
    SectionContainer.tsx
    FloatingPanel.tsx
    FloatingServiceCard.tsx
    MinimalContentCard.tsx
    ContactForm.tsx
    HorseModal.tsx
    HorseCarousel.tsx
  state/
    AppDataContext.tsx
    CmsDraftContext.tsx
  hooks/
    useAppData.ts
    useCmsDraft.ts
    useHorseModal.ts
  data/
    defaultData.ts
  utils/
    storage.ts
    uiTokens.ts
    validators.ts
```

## 4.2 Stav

Doporučení pro stav:

- **Context API** pro data aplikace + draft CMS
- lokální `useState` pro čistě UI stavy (modal, carousel)
- persist do `localStorage` přes utilitu (kompatibilní s `farmCmsDataV2`)

Alternativa: Zustand (jednodušší než Redux).

---

## 5) Migrační pravidla (must-have)

1. **Neměnit URL a IA během migrace.**
2. **Zachovat datový model `defaultData` kompatibilní se stávajícím localStorage.**
3. **Navigaci migrovat 1:1 bez změny struktury/chování.**
4. **Migrovat po blocích, ne „big bang“.**
5. **Po každé fázi build + funkční kontrola + deploy preview.**

---

## 6) Fázový plán migrace

## Fáze 0 — Příprava (0.5–1 den)

- vytvořit migrační branch (`feature/react-migration-phase-1`)
- zafixovat baseline build
- zaznamenat kritické UX scenáře k ověření

**Výstup:** stabilní výchozí bod.

## Fáze 1 — React bootstrap (1–2 dny)

- přidat `react`, `react-dom`, `react-router-dom`
- připravit `src/` skeleton
- přesunout beze změny:
  - `js/defaultData.js` -> `src/data/defaultData.ts`
  - `js/storage.js` -> `src/utils/storage.ts`
  - `js/uiTokens.js` -> `src/utils/uiTokens.ts`

**Výstup:** React build běží vedle stávajícího projektu.

## Fáze 2 — Layout + routing (2–3 dny)

- `SiteLayout`, `Header`, `Footer`
- nastavit route mapu stránek
- ověřit desktop + mobile nav chování

**Výstup:** základní shell všech stránek v Reactu.

## Fáze 3 — Homepage sekce (3–4 dny)

- Hero, Services preview, Horses preview, HomeActions
- použít reusable UI pattern komponenty
- převést render logiku z `app.js` do JSX

**Výstup:** homepage plně v Reactu.

## Fáze 4 — Veřejné podstránky (3–4 dny)

- `sluzby`, `akce`, `o-nas`, `nasi-kone`, `kontakt`
- převést stránky postupně s paralelním testem

**Výstup:** všechny veřejné stránky v Reactu.

## Fáze 5 — CMS přepis (5–7 dní)

- login view, workspace, scopes
- repeatery, live editing, import/export
- save/persist flow

**Výstup:** CMS plně v Reactu.

## Fáze 6 — Úklid + hardening (2–3 dny)

- odstranit starý nepoužívaný DOM render kód
- lint + testy + smoke E2E
- finální dokumentace a handover

**Výstup:** čistý React codebase.

---

## 7) Mapování starý -> nový kód

- `renderHero` -> `<Hero />`
- `renderAbout` -> `<AboutSection />`
- `renderServices` -> `<ServicesSection />` + `<ServicesPageSection />`
- `renderHorses` -> `<HorsesSection />` + `<HorseModal />`
- `renderGallery` / `renderActions` / `renderHomeActions` -> samostatné sekce
- `renderContact` -> `<ContactSection />` + `<ContactForm />`
- `bindNavigation` -> `Header` component state handlers
- `bindHeaderState` -> `useEffect` scroll listener
- `bindCms*` -> `CmsPage` + children komponenty

---

## 8) Rizika a mitigace

## 8.1 Rizika

- rozbití CMS flow při přepisu repeaterů
- rozbití sticky nav na mobilu
- regresní změny v layoutu kvůli CSS/Tailwind kolizím
- nekompatibilita localStorage dat

## 8.2 Mitigace

- migrovat komponentově po menších blocích
- ponechat CSS tokeny a class patterny beze změny v prvních fázích
- povinná kontrola každé fáze:
  - desktop/mobile nav
  - CMS edit/save/import/export
  - build + preview

---

## 9) Testovací checklist po každé fázi

- [ ] `npm run build` bez chyby
- [ ] desktop nav funkční
- [ ] mobile nav + sticky header funkční
- [ ] CTA odkazy fungují
- [ ] kontakt formulář UI validation funguje
- [ ] CMS:
  - [ ] login
  - [ ] edit textu
  - [ ] repeater add/remove
  - [ ] save do localStorage
  - [ ] export/import JSON
- [ ] GitHub Pages deploy success

---

## 10) Odhad pracnosti

- základní migrace bez hlubšího refaktoru: **3–5 týdnů**
- migrace + testy + hardening: **4–6 týdnů**

Při 1 vývojáři na full-time.

---

## 11) Co neřešit v 1. kroku migrace

- backend formulářů (DB/SMTP/antispam) — samostatný projektový blok
- SEO migraci (redirect mapa, canonical, JSON-LD) — samostatný blok
- změnu IA / URL / copy textů — mimo React přepis

---

## 12) Doporučené první implementační kroky (konkrétně)

1. Vytvořit branch: `feature/react-phase-1`.
2. Přidat React závislosti.
3. Vytvořit `src/main.tsx` + `src/app/App.tsx`.
4. Převést `uiTokens`, `defaultData`, `storage` do `src`.
5. Vytvořit `SiteLayout` + `Header` + `Footer`.
6. Převést pouze homepage (`Hero`, `Services`, `Horses`, `HomeActions`).
7. Ověřit build/deploy.

Po úspěchu pokračovat Fází 4+.

