import { loadData, saveData, exportData, importDataFromFile } from "./storage.js";

const PREFERRED_FONT_STACK = "'Avenir Next', 'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const VALID_USER = "admin";
const VALID_PASS = "admin";
const CMS_SESSION_KEY = "farmCmsAuth";
const CMS_PAGE_SCOPES = {
  home: ["settings", "hero", "about", "services", "horses", "gallery", "vouchers", "contact"],
  sluzby: ["services"],
  akce: ["gallery"],
  "nasi-kone": ["horses"],
  "o-nas": ["about"],
  kontakt: ["contact"],
};
const CMS_SCOPE_HELP = {
  home: "Domovska stranka: upravujes globalni nastaveni, hero, O nas, sluzby, kone, galerii, produkty i kontakt.",
  sluzby: "Stranka Sluzby zobrazuje vsechny sluzby vcetne sekci tabory, krouzky a vyjizdky.",
  akce: "Stranka Akce cte prispevky ze sekce Galerie.",
  "nasi-kone": "Stranka Nase kone cte data ze sekce Naši kone.",
  "o-nas": "Stranka O nas cte data ze sekce O nas.",
  kontakt: "Stranka Kontakt cte data ze sekce Kontakt.",
};
const CMS_SCOPE_LABELS = {
  home: "Domu",
  sluzby: "Sluzby",
  akce: "Akce",
  "nasi-kone": "Nase kone",
  "o-nas": "O nas",
  kontakt: "Kontakt",
};
const CMS_SCOPE_URLS = {
  home: "index.html",
  sluzby: "sluzby.html",
  akce: "akce.html",
  "nasi-kone": "nasi-kone.html",
  "o-nas": "o-nas.html",
  kontakt: "kontakt.html",
};
let persistedData = loadData();
if (persistedData?.settings) {
  persistedData.settings.fontFamily = PREFERRED_FONT_STACK;
  saveData(persistedData);
}
let draftData = clone(persistedData);
let lastFocusedElement = null;
let activeHorseIndex = 0;

const fieldMap = {
  "cms-site-name": ["settings", "siteName"],
  "cms-logo-text": ["settings", "logoText"],
  "cms-primary-color": ["settings", "primaryColor"],
  "cms-secondary-color": ["settings", "secondaryColor"],
  "cms-accent-color": ["settings", "accentColor"],
  "cms-font-family": ["settings", "fontFamily"],
  "cms-footer-text": ["settings", "footerText"],
  "cms-hero-title": ["sections", "hero", "title"],
  "cms-hero-subtitle": ["sections", "hero", "subtitle"],
  "cms-hero-cta-text": ["sections", "hero", "ctaText"],
  "cms-hero-cta-target": ["sections", "hero", "ctaTarget"],
  "cms-about-title": ["sections", "about", "title"],
  "cms-about-text": ["sections", "about", "text"],
  "cms-services-title": ["sections", "services", "title"],
  "cms-horses-title": ["sections", "horses", "title"],
  "cms-gallery-title": ["sections", "gallery", "title"],
  "cms-vouchers-title": ["sections", "vouchers", "title"],
  "cms-vouchers-text": ["sections", "vouchers", "text"],
  "cms-contact-title": ["sections", "contact", "title"],
  "cms-contact-address": ["sections", "contact", "address"],
  "cms-contact-phone": ["sections", "contact", "phone"],
  "cms-contact-email": ["sections", "contact", "email"],
  "cms-contact-success": ["sections", "contact", "successMessage"],
};

const repeaterConfig = {
  services: {
    listId: "cms-services-list",
    addId: "cms-services-add",
    path: ["sections", "services", "items"],
    itemTitle: "Služba",
    fields: [
      { key: "title", label: "Název" },
      { key: "description", label: "Popis", type: "textarea" },
      { key: "price", label: "Cena" },
    ],
    uploadKey: "image",
  },
  horses: {
    listId: "cms-horses-list",
    addId: "cms-horses-add",
    path: ["sections", "horses", "items"],
    itemTitle: "Kůň",
    fields: [
      { key: "name", label: "Jméno" },
      { key: "breed", label: "Plemeno" },
      { key: "age", label: "Věk" },
      { key: "description", label: "Popis", type: "textarea" },
    ],
    uploadKey: "image",
  },
  gallery: {
    listId: "cms-gallery-list",
    addId: "cms-gallery-add",
    path: ["sections", "gallery", "images"],
    itemTitle: "Fotka",
    fields: [
      { key: "alt", label: "Alt text" },
    ],
    uploadKey: "src",
  },
  vouchers: {
    listId: "cms-vouchers-list",
    addId: "cms-vouchers-add",
    path: ["sections", "vouchers", "items"],
    itemTitle: "Poukaz",
    fields: [
      { key: "name", label: "Název" },
      { key: "description", label: "Popis", type: "textarea" },
      { key: "price", label: "Cena" },
    ],
    uploadKey: null,
  },
};

const blankTemplates = {
  services: { title: "", description: "", price: "", image: "" },
  horses: { name: "", breed: "", age: "", description: "", image: "" },
  gallery: { src: "", alt: "" },
  vouchers: { name: "", description: "", price: "" },
};

function init() {
  bindNavigation();
  bindHeaderState();
  bindLoginAndCms();
  bindCmsLiveEditing();
  bindCmsRepeaters();
  bindCmsActions();
  initCmsEnvironment();
  bindGlobalClicks();
  renderSite(persistedData);
  applyBootstrapUi();
}

function renderSite(data) {
  applyTheme(data.settings);
  renderHighlights();
  renderHero(data.sections.hero);
  renderAbout(data.sections.about);
  renderServices(data.sections.services);
  renderHorses(data.sections.horses);
  renderHomeActions(data.sections.gallery);
  renderActions(data.sections.gallery);
  renderGallery(data.sections.gallery);
  renderVouchers(data.sections.vouchers);
  renderContact(data.sections.contact);

  const brandLogo = document.getElementById("brand-logo");
  if (brandLogo) {
    const logoSrc = data.settings.favicon?.trim() || "migration_export/images/krouzky/krouzky__02__40942955f2cf.png";
    brandLogo.src = logoSrc;
  } else {
    const brand = document.getElementById("brand-link");
    if (brand) brand.textContent = data.settings.logoText || data.settings.siteName;
  }

  const footerText = document.getElementById("footer-text");
  if (footerText) {
    footerText.textContent = `© ${new Date().getFullYear()} ${data.settings.footerText || data.settings.siteName}`;
  }

  applyBootstrapUi();
}

function applyTheme(settings) {
  const root = document.documentElement;
  root.style.setProperty("--primary", settings.primaryColor);
  root.style.setProperty("--secondary", settings.secondaryColor);
  root.style.setProperty("--accent", settings.accentColor);
  root.style.setProperty("--app-font", settings.fontFamily);
  root.dataset.theme = "light";
  root.lang = "cs";
  document.title = settings.siteName || "Stáj";

  const favicon = document.getElementById("dynamic-favicon");
  if (settings.favicon?.trim()) {
    favicon.href = settings.favicon;
  }
}

function renderHero(hero) {
  const el = document.getElementById("hero");
  if (!el) return;
  const page = document.body.dataset.page || "home";
  const pageHeroTitles = {
    sluzby: "Služby",
    akce: "Akce",
    "nasi-kone": "Naši koně",
    "o-nas": "O nás",
    kontakt: "Kontakt",
  };

  if (page !== "home") {
    if (!pageHeroTitles[page]) return;
    el.innerHTML = `
      <div class="hero-overlay">
        <div class="container hero-content page-hero-content d-flex align-items-end"></div>
      </div>
    `;
    el.style.backgroundImage = `linear-gradient(120deg, var(--hero-veil), rgba(0,0,0,.34)), url('${escapeAttr(hero.image)}')`;
    return;
  }

  el.innerHTML = `
    <div class="hero-overlay">
      <div class="container hero-content">
        <h2 id="hero-title">${escapeHtml(formatHeroTitle(hero.title))}</h2>
        <p>${escapeHtml(hero.subtitle)}</p>
        <a class="btn btn-primary" href="${escapeAttr(hero.ctaTarget || "#contact")}">${escapeHtml(hero.ctaText)}</a>
      </div>
    </div>
  `;
  el.style.backgroundImage = `linear-gradient(120deg, var(--hero-veil), rgba(0,0,0,.34)), url('${escapeAttr(hero.image)}')`;
}

function renderAbout(about) {
  const el = document.getElementById("about");
  if (!el) return;
  el.innerHTML = `
    <article class="text-card card border-0 shadow-sm">
      <h2 class="section-title">${escapeHtml(formatSectionTitle(about.title))}</h2>
      <p class="section-lead">${escapeHtml(about.text)}</p>
    </article>
  `;
}

function renderServices(services) {
  const page = document.body.dataset.page || "home";
  const isCamp = (item) => /tábor/i.test(item.title) || /tábor/i.test(item.description);
  const isClub = (item) => /krouž|krouzek/i.test(item.title) || /krouž|krouzek/i.test(item.description);
  const isRide = (item) => /vyjížďka|jízda|poník|kůň/i.test(`${item.title} ${item.description}`);

  let sectionTitle = services.title;
  let filteredItems = services.items;

  const cards = filteredItems
    .map(
      (item) => `
    <article class="card h-100 border-0 shadow-sm">
      <div class="card-body d-flex flex-column">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <strong>${escapeHtml(item.price)}</strong>
        <a class="link-inline" href="${getServiceLink(item)}">více <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `
    )
    .join("");

  const el = document.getElementById("services");
  if (!el) return;

  if (page === "sluzby") {
    const groups = [
      {
        id: "tabory",
        title: "Tábory",
        summary: "Pobytové i příměstské programy pro děti se zaměřením na péči o koně.",
        items: services.items.filter(isCamp),
      },
      {
        id: "krouzky",
        title: "Kroužky",
        summary: "Pravidelné lekce pro děti, které chtějí jezdit a starat se o koně dlouhodobě.",
        items: services.items.filter(isClub),
      },
      {
        id: "vyjizdky",
        title: "Vyjížďky",
        summary: "Vyjížďky do přírody a individuální jízdy pro začátečníky i pokročilé.",
        items: services.items.filter(isRide),
      },
    ];

    const quickNav = groups
      .map(
        (group) => `
          <a class="service-quick-card" href="#${group.id}">
            <strong>${escapeHtml(group.title)}</strong>
            <span>${group.items.length} položek</span>
          </a>
        `
      )
      .join("");

    const blocks = groups
      .map((group) => {
        const groupCards = (group.items.length > 0 ? group.items : services.items)
          .map(
            (item) => `
              <article class="card">
                <div class="card-body">
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.description)}</p>
                  <strong>${escapeHtml(item.price)}</strong>
                </div>
              </article>
            `
          )
          .join("");
        return `
          <section class="service-group" id="${group.id}">
            <div class="service-group-head">
              <h3 class="section-subtitle">${escapeHtml(group.title)}</h3>
              <span class="service-group-count">${group.items.length} položek</span>
            </div>
            <p class="service-group-summary">${escapeHtml(group.summary)}</p>
            <div class="card-grid">${groupCards}</div>
          </section>
        `;
      })
      .join("");

    el.innerHTML = `
      <header class="service-page-head">
        <h2 class="section-title">Služby</h2>
        <p class="section-lead">Rychlý přehled všeho, co na farmě nabízíme. Vyber typ služby a hned uvidíš relevantní nabídku.</p>
      </header>
      <nav class="service-quick-nav" aria-label="Rychlá navigace služeb">
        ${quickNav}
      </nav>
      ${blocks}
    `;
    return;
  }

  if (page === "home") {
    const groups = [
      { id: "tabory", title: "Tábory", summary: "Pobytové i příměstské programy pro děti se zaměřením na práci s koňmi.", items: services.items.filter(isCamp) },
      { id: "krouzky", title: "Kroužky", summary: "Pravidelné jezdecké lekce a dlouhodobá péče o koně pro děti.", items: services.items.filter(isClub) },
      { id: "vyjizdky", title: "Vyjížďky", summary: "Vyjížďky do přírody a individuální jízdy pro začátečníky i pokročilé.", items: services.items.filter(isRide) },
    ];

    const features = groups
      .map((group, index) => {
        const reverseClass = index % 2 === 1 ? "service-feature-reverse" : "";
        return `
          <article class="service-feature ${reverseClass} card border-0 shadow-sm">
            <div class="service-feature-body">
              <h3>${escapeHtml(group.title)}</h3>
              <p>${escapeHtml(group.summary)}</p>
              <a class="btn btn-outline" href="sluzby.html#${group.id}">Prohlédnout ${escapeHtml(group.title.toLowerCase())}</a>
            </div>
          </article>
        `;
      })
      .join("");

    el.innerHTML = `
      <div class="home-service-stack">${features}</div>
    `;
    return;
  }

  el.innerHTML = `
    <h2 class="section-title">${escapeHtml(formatSectionTitle(sectionTitle))}</h2>
    <div class="card-grid">${cards}</div>
  `;
}

function renderHorses(horses) {
  const el = document.getElementById("horses");
  if (!el) return;
  const page = document.body.dataset.page || "home";

  const cards = horses.items
    .map(
      (horse, index) => `
    <article class="card horse-card h-100 border-0 shadow-sm ${page === "nasi-kone" ? "horse-card-clickable" : ""}" ${page === "nasi-kone" ? `data-horse-card="${index}"` : ""}>
      <div class="card-body">
        <h3>${escapeHtml(horse.name)}</h3>
        <p><strong>Plemeno:</strong> ${escapeHtml(horse.breed)} | <strong>Věk:</strong> ${escapeHtml(horse.age)}</p>
        <p>${escapeHtml(horse.description)}</p>        
        ${page === "nasi-kone" ? `<button class="btn btn-outline horse-open-btn" type="button">Detail koně</button>` : ""}
      </div>
    </article>
  `
    )
    .join("");

  if (page === "nasi-kone") {
    el.innerHTML = `
      <h2 class="section-title">${escapeHtml(formatSectionTitle(horses.title || "Naši koně"))}</h2>
      <p class="section-lead">Klikni na koně, otevře se detail s informacemi a galerií fotek.</p>
      <div class="card-grid">${cards}</div>
    `;
    ensureHorseModal();
    return;
  }

  if (page === "home") {
    const homeCards = horses.items
      .slice(0, 3)
      .map(
        (horse) => `
          <article class="card horse-card h-100 border-0 shadow-sm">
            <div class="card-body">
              <h3>${escapeHtml(horse.name)}</h3>
              <p><strong>Plemeno:</strong> ${escapeHtml(horse.breed)}</p>
            </div>
          </article>
        `
      )
      .join("");

    el.innerHTML = `
      <div class="home-strip-head">
        <a class="link-inline" href="nasi-kone.html">zobrazit všechny koně <span aria-hidden="true">→</span></a>
      </div>
      <div class="home-horse-strip">${homeCards}</div>
    `;
    return;
  }

  el.innerHTML = `
    <h2 class="section-title">${escapeHtml(formatSectionTitle(horses.title))}</h2>
    <div class="card-grid">${cards}</div>
    <a class="link-inline" href="nasi-kone.html">samostatná stránka koně <span aria-hidden="true">→</span></a>
  `;
}

function renderGallery(gallery) {
  const el = document.getElementById("gallery");
  if (!el) return;
  const items = gallery.images
    .map(
      (item, index) => `
    <article class="action-card card border-0 shadow-sm h-100">
      <div class="action-card-body">
        <h3>${escapeHtml(`Akce #${index + 1}`)}</h3>
        <p>${escapeHtml(item.alt || "Momentka z farmy.")}</p>
      </div>
    </article>
  `
    )
    .join("");

  el.innerHTML = `
    <h2 class="section-title">${escapeHtml(formatSectionTitle(gallery.title))}</h2>
    <div class="gallery-grid">${items}</div>
    <a class="link-inline" href="akce.html">otevřít stránku akcí <span aria-hidden="true">→</span></a>
  `;
}

function renderActions(gallery) {
  const el = document.getElementById("actions");
  if (!el) return;
  const cards = gallery.images
    .map(
      (item, index) => `
        <article class="action-card card border-0 shadow-sm h-100">
          <div class="action-card-body">
            <h3>${escapeHtml(`Příběh z farmy #${index + 1}`)}</h3>
            <p>${escapeHtml(item.alt || "Momentka z každodenního života na farmě.")}</p>
            <a class="link-inline" href="kontakt.html">zjistit více <span aria-hidden="true">→</span></a>
          </div>
        </article>
      `
    )
    .join("");

  el.innerHTML = `
    <h2 class="section-title">Akce</h2>
    <p class="section-lead">Krátké příběhy a fotky z akcí, táborů i běžného života na farmě.</p>
    <div class="action-grid">${cards}</div>
  `;
}

function renderHomeActions(gallery) {
  const el = document.getElementById("home-actions");
  if (!el) return;
  const latest = gallery.images.slice(-3).reverse();
  const items = latest
    .map(
      (item, index) => `
        <article class="home-action-item card border-0 shadow-sm h-100">
          <div class="home-action-body">
            <h3>${escapeHtml(`Akce #${latest.length - index}`)}</h3>
            <p>${escapeHtml(item.alt || "Momentka z dění na farmě.")}</p>
            <a class="link-inline" href="akce.html">zobrazit všechny akce <span aria-hidden="true">→</span></a>
          </div>
        </article>
      `
    )
    .join("");

  el.innerHTML = `
    <div class="home-actions-list">${items}</div>
  `;
}

function renderVouchers(vouchers) {
  const el = document.getElementById("vouchers");
  if (!el) return;
  const items = vouchers.items
    .map(
      (voucher) => `
    <article class="voucher-card card border-0 shadow-sm h-100">
      <h3>${escapeHtml(voucher.name)}</h3>
      <p>${escapeHtml(voucher.description)}</p>
      <strong>${escapeHtml(voucher.price)}</strong>
    </article>
  `
    )
    .join("");

  el.innerHTML = `
    <h2 class="section-title">${escapeHtml(formatSectionTitle(vouchers.title))}</h2>
    <p class="section-lead">${escapeHtml(vouchers.text)}</p>
    <div class="voucher-grid">${items}</div>
  `;
}

function renderContact(contact) {
  const section = document.getElementById("contact");
  if (!section) return;
  section.innerHTML = `
    <h2 class="section-title">${escapeHtml(formatSectionTitle(contact.title))}</h2>
    <div class="split contact-split">
      <address>
        <p><strong>Adresa:</strong> ${escapeHtml(contact.address)}</p>
        <p><strong>Telefon:</strong> <a href="tel:${escapeAttr(contact.phone)}">${escapeHtml(contact.phone)}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${escapeAttr(contact.email)}">${escapeHtml(contact.email)}</a></p>
        <a class="link-inline" href="https://mapy.cz" target="_blank" rel="noreferrer">zobrazit na mapě <span aria-hidden="true">→</span></a>
      </address>
      <form id="contact-form" class="contact-form vstack gap-2" novalidate aria-describedby="contact-success">
        <label for="contact-name">Jméno</label>
        <input id="contact-name" class="form-control" type="text" name="name" required />
        <label for="contact-email">Email</label>
        <input id="contact-email" class="form-control" type="email" name="email" required />
        <label for="contact-message">Zpráva</label>
        <textarea id="contact-message" class="form-control" name="message" rows="4" required></textarea>
        <button class="btn btn-primary" type="submit">Odeslat</button>
        <p class="success-msg" id="contact-success" aria-live="polite"></p>
      </form>
    </div>
  `;

  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const success = document.getElementById("contact-success");
    const emailInput = document.getElementById("contact-email");

    if (!name || !email || !message || !isValidEmail(email)) {
      success.textContent = "Zkontrolujte prosím vyplněné údaje.";
      success.classList.add("is-error");
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }

    emailInput.setAttribute("aria-invalid", "false");
    success.textContent = draftData.sections.contact.successMessage;
    success.classList.remove("is-error");
    form.reset();
  });
}

function bindNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  const toggles = document.querySelectorAll(".nav-dropdown-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.parentElement?.classList.toggle("open", !expanded);
    });
  });
}

function bindHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggleScrolled = () => {
    if (window.scrollY > 20) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };

  window.addEventListener("scroll", toggleScrolled, { passive: true });
  toggleScrolled();
}

function renderHighlights() {
  const el = document.getElementById("highlights");
  if (!el) return;
  const items = [
    { title: "tábory", target: "sluzby.html#tabory", text: "Pobytové i příměstské programy v přírodě." },
    { title: "vyjížďky", target: "sluzby.html#vyjizdky", text: "Vyjížďky, výuka i každodenní péče o koně." },
    { title: "naše koně", target: "nasi-kone.html", text: "Poznejte náš koňský tým a jeho příběhy." },
    { title: "akce", target: "akce.html", text: "Články a fotky z farmy, táborů i každodenního života." },
  ];

  el.innerHTML = `
    <div class="highlight-grid">
      ${items
        .map(
          (item) => `
            <a class="highlight-item card border-0 shadow-sm h-100" href="${item.target}">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function bindLoginAndCms() {
  const lockBtn = document.getElementById("lock-btn");
  const loginModal = document.getElementById("login-modal");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  if (!lockBtn || !loginModal || !loginForm || !loginError) return;
  const loginCard = loginModal.querySelector(".modal-card");

  lockBtn.addEventListener("click", () => {
    lastFocusedElement = document.activeElement;
    loginModal.classList.add("open");
    loginModal.setAttribute("aria-hidden", "false");
    loginCard?.focus();
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const username = String(data.get("username") || "");
    const password = String(data.get("password") || "");

    if (username === VALID_USER && password === VALID_PASS) {
      loginError.textContent = "";
      loginModal.classList.remove("open");
      loginModal.setAttribute("aria-hidden", "true");
      loginForm.reset();
      setCmsAuthenticated(true);
      window.location.href = "cms.html";
      return;
    }

    loginError.textContent = "Neplatné přihlašovací údaje.";
  });
}

function bindCmsLiveEditing() {
  const form = document.getElementById("cms-form");
  if (!form) return;
  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.id) return;

    const path = fieldMap[target.id];
    if (!path) return;

    setByPath(draftData, path, target.value);
    renderSite(draftData);
  });

  form.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== "file" || !target.files?.[0]) return;

    if (target.id === "cms-favicon-upload") {
      draftData.settings.favicon = await fileToBase64(target.files[0]);
      renderSite(draftData);
      return;
    }

    if (target.id === "cms-hero-image-upload") {
      draftData.sections.hero.image = await fileToBase64(target.files[0]);
      renderSite(draftData);
      return;
    }

    if (target.id === "cms-about-image-upload") {
      draftData.sections.about.image = await fileToBase64(target.files[0]);
      renderSite(draftData);
    }
  });
}

function bindCmsRepeaters() {
  const cmsForm = document.getElementById("cms-form");
  if (!cmsForm) return;
  Object.keys(repeaterConfig).forEach((key) => {
    const config = repeaterConfig[key];
    const addBtn = document.getElementById(config.addId);
    if (!addBtn) return;
    addBtn.addEventListener("click", () => {
      getByPath(draftData, config.path).push(clone(blankTemplates[key]));
      renderRepeater(key);
      renderSite(draftData);
    });
  });

  cmsForm.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const deleteButton = target.closest("[data-delete-item]");
    if (!deleteButton) return;

    const key = deleteButton.getAttribute("data-repeater-key");
    const index = Number(deleteButton.getAttribute("data-index"));
    if (!key || Number.isNaN(index)) return;

    const array = getByPath(draftData, repeaterConfig[key].path);
    array.splice(index, 1);
    renderRepeater(key);
    renderSite(draftData);
  });

  cmsForm.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    const key = target.getAttribute("data-repeater-key");
    const field = target.getAttribute("data-field");
    const index = Number(target.getAttribute("data-index"));
    if (!key || !field || Number.isNaN(index)) return;

    const array = getByPath(draftData, repeaterConfig[key].path);
    if (!array[index]) return;
    array[index][field] = target.value;
    renderSite(draftData);
  });

  cmsForm.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== "file" || !target.files?.[0]) return;

    const key = target.getAttribute("data-repeater-upload");
    const index = Number(target.getAttribute("data-index"));
    if (!key || Number.isNaN(index)) return;

    const config = repeaterConfig[key];
    const array = getByPath(draftData, config.path);
    const field = config.uploadKey;
    if (!field || !array[index]) return;

    array[index][field] = await fileToBase64(target.files[0]);
    renderRepeater(key);
    renderSite(draftData);
  });
}

function bindCmsActions() {
  const saveBtn = document.getElementById("cms-save");
  const exportBtn = document.getElementById("cms-export");
  const importInput = document.getElementById("cms-import");
  if (!saveBtn || !exportBtn || !importInput) return;

  saveBtn.addEventListener("click", () => {
    persistedData = clone(draftData);
    saveData(persistedData);
    renderSite(persistedData);
    window.alert("Změny byly uloženy do localStorage.");
  });

  exportBtn.addEventListener("click", () => exportData(draftData));

  importInput.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.files?.[0]) return;

    try {
      const imported = await importDataFromFile(target.files[0]);
      draftData = imported;
      persistedData = clone(imported);
      saveData(persistedData);
      populateCmsFields();
      renderSite(imported);
      window.alert("Import proběhl úspěšně.");
    } catch (error) {
      window.alert(error.message || "Import se nepodařil.");
    } finally {
      target.value = "";
    }
  });
}

function initCmsEnvironment() {
  if (document.body.dataset.page !== "cms") return;

  const loginView = document.getElementById("cms-login-view");
  const workspace = document.getElementById("cms-workspace");
  const loginForm = document.getElementById("cms-login-form");
  const loginError = document.getElementById("cms-login-error");
  const logoutBtn = document.getElementById("cms-logout");
  const scopeButtons = Array.from(document.querySelectorAll("[data-cms-scope]"));
  const activePageLabel = document.getElementById("cms-active-page-label");
  const openPageLink = document.getElementById("cms-open-page");
  if (!loginView || !workspace || !loginForm || !loginError || !logoutBtn || scopeButtons.length === 0) return;

  const setActiveScope = (scopeKey) => {
    const safeScope = CMS_PAGE_SCOPES[scopeKey] ? scopeKey : "home";
    workspace.dataset.cmsActiveScope = safeScope;
    applyCmsScope(safeScope);

    scopeButtons.forEach((button) => {
      const buttonScope = button.getAttribute("data-cms-scope");
      button.classList.toggle("is-active", buttonScope === safeScope);
    });

    if (activePageLabel) activePageLabel.textContent = CMS_SCOPE_LABELS[safeScope] ?? CMS_SCOPE_LABELS.home;
    if (openPageLink) openPageLink.href = CMS_SCOPE_URLS[safeScope] ?? CMS_SCOPE_URLS.home;
  };

  const syncVisibility = () => {
    const authenticated = isCmsAuthenticated();
    loginView.hidden = authenticated;
    workspace.hidden = !authenticated;

    if (authenticated) {
      persistedData = loadData();
      draftData = clone(persistedData);
      populateCmsFields();
      setActiveScope(workspace.dataset.cmsActiveScope || "home");
      renderSite(draftData);
    }
  };

  syncVisibility();

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const username = String(data.get("username") || "");
    const password = String(data.get("password") || "");

    if (username === VALID_USER && password === VALID_PASS) {
      loginError.textContent = "";
      setCmsAuthenticated(true);
      loginForm.reset();
      syncVisibility();
      return;
    }

    loginError.textContent = "Neplatne prihlasovaci udaje.";
  });

  logoutBtn.addEventListener("click", () => {
    setCmsAuthenticated(false);
    window.location.href = "index.html";
  });

  scopeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetScope = button.getAttribute("data-cms-scope") || "home";
      setActiveScope(targetScope);
    });
  });
}

function bindGlobalClicks() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const modalCloseBtn = target.closest("[data-close-modal]");
    if (modalCloseBtn) {
      const modalId = modalCloseBtn.getAttribute("data-close-modal");
      if (!modalId) return;
      closeModalById(modalId);
      return;
    }

    const horseBtn = target.closest("[data-horse-card]");
    if (horseBtn) {
      const index = Number(horseBtn.getAttribute("data-horse-card"));
      openHorseModal(index);
      return;
    }

    const closeHorseBtn = target.closest("[data-close-horse-modal]");
    if (closeHorseBtn) {
      closeHorseModal();
      return;
    }

    if (target.id === "horse-modal") {
      closeHorseModal();
      return;
    }

    const horsePrev = target.closest("[data-horse-prev]");
    if (horsePrev) {
      moveHorse(-1);
      return;
    }

    const horseNext = target.closest("[data-horse-next]");
    if (horseNext) {
      moveHorse(1);
      return;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHorseModal();
      closeModalById("login-modal");
    } else if (event.key === "ArrowLeft" && isHorseModalOpen()) {
      moveHorse(-1);
    } else if (event.key === "ArrowRight" && isHorseModalOpen()) {
      moveHorse(1);
    }
  });
}

function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function populateCmsFields() {
  Object.entries(fieldMap).forEach(([id, path]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = getByPath(draftData, path) ?? "";
  });

  Object.keys(repeaterConfig).forEach((key) => renderRepeater(key));
}

function applyCmsScope(scopeKey) {
  const sections = document.querySelectorAll("[data-cms-section]");
  if (sections.length === 0) return;

  const visibleSections = CMS_PAGE_SCOPES[scopeKey] ?? CMS_PAGE_SCOPES.home;
  sections.forEach((section) => {
    const sectionKey = section.getAttribute("data-cms-section");
    section.hidden = !visibleSections.includes(sectionKey);
    if (!section.hidden) section.open = true;
  });

  const hint = document.getElementById("cms-scope-help");
  if (hint) hint.textContent = CMS_SCOPE_HELP[scopeKey] ?? CMS_SCOPE_HELP.home;
}

function isCmsAuthenticated() {
  return sessionStorage.getItem(CMS_SESSION_KEY) === "1";
}

function setCmsAuthenticated(value) {
  if (value) sessionStorage.setItem(CMS_SESSION_KEY, "1");
  else sessionStorage.removeItem(CMS_SESSION_KEY);
}

function renderRepeater(key) {
  const config = repeaterConfig[key];
  const list = document.getElementById(config.listId);
  if (!list) return;
  const items = getByPath(draftData, config.path);

  list.innerHTML = items
    .map((item, index) => {
      const fieldsHtml = config.fields
        .map((field) => {
          const value = item[field.key] ?? "";
          if (field.type === "textarea") {
            return `
              <label>${field.label}
                <textarea class="form-control" data-repeater-key="${key}" data-field="${field.key}" data-index="${index}" rows="3">${escapeHtml(
              value
            )}</textarea>
              </label>
            `;
          }
          return `
            <label>${field.label}
              <input class="form-control" type="text" value="${escapeAttr(value)}" data-repeater-key="${key}" data-field="${field.key}" data-index="${index}" />
            </label>
          `;
        })
        .join("");

      const uploadHtml = config.uploadKey
        ? `
          <label>Nahrát obrázek (soubor)
            <input class="form-control" type="file" accept="image/*" data-repeater-upload="${key}" data-index="${index}" />
          </label>
        `
        : "";

      return `
        <div class="repeater-item card border-0 shadow-sm">
          <div class="repeater-item-head">
            <strong>${config.itemTitle} #${index + 1}</strong>
            <button type="button" class="btn btn-ghost" data-delete-item="true" data-repeater-key="${key}" data-index="${index}">Smazat</button>
          </div>
          <div class="grid-1">${fieldsHtml}${uploadHtml}</div>
        </div>
      `;
    })
    .join("");

  applyBootstrapUi();
}

function applyBootstrapUi() {
  document.querySelectorAll("input, textarea, select").forEach((field) => {
    if (!(field instanceof HTMLElement)) return;
    if (field.closest(".nav")) return;

    if (field instanceof HTMLInputElement) {
      if (field.type === "hidden") return;
      if (field.type === "color") {
        field.classList.add("form-control", "form-control-color");
        return;
      }
      if (field.type === "checkbox" || field.type === "radio") {
        field.classList.add("form-check-input");
        return;
      }
      field.classList.add("form-control");
      return;
    }

    field.classList.add("form-control");
  });

  document.querySelectorAll(".btn.btn-outline").forEach((button) => {
    button.classList.add("btn-outline-secondary");
  });
  document.querySelectorAll(".btn.btn-ghost").forEach((button) => {
    button.classList.add("btn-light");
  });

  document.querySelectorAll(".text-card, .service-feature, .action-card, .home-action-item, .voucher-card, .repeater-item, .modal-card").forEach((card) => {
    card.classList.add("card", "border-0", "shadow-sm");
  });
}

function ensureHorseModal() {
  if (document.getElementById("horse-modal")) return;
  const modal = document.createElement("div");
  modal.className = "horse-modal";
  modal.id = "horse-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="horse-modal-card">
      <button class="close-btn horse-modal-close" aria-label="Zavřít detail koně" data-close-horse-modal="true">×</button>
      <div class="horse-modal-content">
        <h3 id="horse-modal-name"></h3>
        <p id="horse-modal-meta"></p>
        <p id="horse-modal-description"></p>
        <div class="horse-modal-actions">
          <button class="btn btn-outline" type="button" data-horse-prev="true">Předchozí kůň</button>
          <button class="btn btn-outline" type="button" data-horse-next="true">Další kůň</button>
        </div>
      </div>
    </div>
  `;
  document.body.append(modal);
}

function openHorseModal(index) {
  const horses = draftData.sections.horses.items;
  if (!horses[index]) return;
  activeHorseIndex = index;
  syncHorseModal();
  const modal = document.getElementById("horse-modal");
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeHorseModal() {
  const modal = document.getElementById("horse-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function isHorseModalOpen() {
  const modal = document.getElementById("horse-modal");
  return Boolean(modal && modal.classList.contains("open"));
}

function moveHorse(step) {
  const horses = draftData.sections.horses.items;
  if (horses.length === 0) return;
  activeHorseIndex = (activeHorseIndex + step + horses.length) % horses.length;
  syncHorseModal();
}

function syncHorseModal() {
  const horse = draftData.sections.horses.items[activeHorseIndex];
  if (!horse) return;
  const name = document.getElementById("horse-modal-name");
  const meta = document.getElementById("horse-modal-meta");
  const description = document.getElementById("horse-modal-description");
  if (!name || !meta || !description) return;
  name.textContent = horse.name;
  meta.textContent = `Plemeno: ${horse.breed} | Věk: ${horse.age}`;
  description.textContent = horse.description;
}

function getServiceLink(item) {
  const content = `${item.title} ${item.description}`.toLowerCase();
  if (content.includes("tábor")) return "sluzby.html#tabory";
  if (content.includes("krouž") || content.includes("krouzek")) return "sluzby.html#krouzky";
  if (content.includes("vyjížď") || content.includes("poník") || content.includes("jízda")) return "sluzby.html#vyjizdky";
  if (content.includes("kůň")) return "nasi-kone.html";
  return "sluzby.html";
}

function setByPath(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i += 1) current = current[path[i]];
  current[path[path.length - 1]] = value;
}

function getByPath(obj, path) {
  return path.reduce((acc, part) => acc[part], obj);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Nepodařilo se nahrát obrázek."));
    reader.readAsDataURL(file);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function formatSectionTitle(title) {
  const normalized = String(title ?? "").trim().replace(/[.]$/, "");
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatHeroTitle(title) {
  const normalized = String(title ?? "").trim().replace(/[.]$/, "");
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

init();
