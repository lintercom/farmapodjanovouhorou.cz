import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../state/AppDataContext";
import { exportData, importDataFromFile } from "../utils/storage";
import { fileToBase64 } from "../utils/helpers";
import type { AppData } from "../data/defaultData";

const CMS_SESSION_KEY = "farmCmsAuth";
const VALID_USER = "admin";
const VALID_PASS = "admin";

const CMS_PAGE_SCOPES: Record<string, string[]> = {
  home: ["settings", "hero", "about", "services", "horses", "gallery", "vouchers", "contact"],
  sluzby: ["services"],
  akce: ["gallery"],
  "nasi-kone": ["horses"],
  "o-nas": ["about"],
  kontakt: ["contact"],
};

const CMS_SCOPE_LABELS: Record<string, string> = {
  home: "Domů",
  sluzby: "Služby",
  akce: "Akce",
  "nasi-kone": "Naše koně",
  "o-nas": "O nás",
  kontakt: "Kontakt",
};

const CMS_SCOPE_URLS: Record<string, string> = {
  home: "/",
  sluzby: "/sluzby",
  akce: "/akce",
  "nasi-kone": "/nasi-kone",
  "o-nas": "/o-nas",
  kontakt: "/kontakt",
};

function setByPath(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]] as Record<string, unknown>;
  }
  cur[path[path.length - 1]] = value;
}

function getByPath<T>(obj: Record<string, unknown>, path: string[]): T {
  return path.reduce((acc: unknown, key) => (acc as Record<string, unknown>)[key], obj) as T;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function CmsPage() {
  const navigate = useNavigate();
  const { data, setData, persist } = useAppData();

  React.useEffect(() => {
    document.body.classList.add("cms-page");
    return () => document.body.classList.remove("cms-page");
  }, []);
  const [draft, setDraft] = useState<AppData>(() => clone(data));
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(CMS_SESSION_KEY) === "1");
  const [scope, setScope] = useState<keyof typeof CMS_PAGE_SCOPES>("home");
  const [loginError, setLoginError] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  const visibleSections = CMS_PAGE_SCOPES[scope] || CMS_PAGE_SCOPES.home;

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const user = String(fd.get("username") || "").trim();
    const pass = String(fd.get("password") || "").trim();
    if (user === VALID_USER && pass === VALID_PASS) {
      setLoginError("");
      sessionStorage.setItem(CMS_SESSION_KEY, "1");
      setAuthenticated(true);
      setDraft(clone(data));
    } else {
      setLoginError("Neplatné přihlašovací údaje.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(CMS_SESSION_KEY);
    setAuthenticated(false);
    navigate("/");
  };

  const updateField = (path: string[], value: unknown) => {
    setDraft((prev) => {
      const next = clone(prev);
      setByPath(next as unknown as Record<string, unknown>, path, value);
      return next;
    });
  };

  const handleSave = () => {
    setData(draft);
    persist();
    alert("Změny byly uloženy do localStorage.");
  };

  const handleExport = () => exportData(draft);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importDataFromFile(file);
      setData(imported);
      setDraft(clone(imported));
      persist();
      alert("Import proběhl úspěšně.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import se nepodařil.");
    }
    e.target.value = "";
  };

  const addRepeaterItem = (path: string[], template: Record<string, string>) => {
    setDraft((prev) => {
      const next = clone(prev);
      const arr = getByPath<unknown[]>(next as unknown as Record<string, unknown>, path);
      arr.push(clone(template));
      return next;
    });
  };

  const removeRepeaterItem = (path: string[], index: number) => {
    setDraft((prev) => {
      const next = clone(prev);
      const arr = getByPath<unknown[]>(next as unknown as Record<string, unknown>, path);
      arr.splice(index, 1);
      return next;
    });
  };

  const handleImageUpload = async (path: string[], file: File) => {
    const b64 = await fileToBase64(file);
    setDraft((prev) => {
      const next = clone(prev);
      setByPath(next as unknown as Record<string, unknown>, path, b64);
      return next;
    });
  };

  if (!authenticated) {
    return (
      <main className="cms-shell container py-4 py-lg-5 flex-grow-1">
        <section className="cms-login-card card shadow-sm border-0">
          <h1>Přihlášení do CMS</h1>
          <p>Po přihlášení upravíš obsah webu v přehledném administračním prostředí.</p>
          <form className="cms-login-form vstack gap-2" onSubmit={handleLogin}>
            <label htmlFor="cms-username">Uživatelské jméno</label>
            <input id="cms-username" className="form-control" type="text" name="username" autoComplete="username" required />
            <label htmlFor="cms-password">Heslo</label>
            <input id="cms-password" className="form-control" type="password" name="password" autoComplete="current-password" required />
            <p className="error-msg" aria-live="polite">{loginError}</p>
            <button className="btn btn-primary" type="submit">Přihlásit</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="cms-shell container py-4 py-lg-5 flex-grow-1">
      <section className="cms-layout" data-cms-active-scope={scope}>
        <header className="cms-topbar card border-0 shadow-sm">
          <div className="cms-topbar-brand">
            <strong>Farma CMS</strong>
            <span className="cms-active-page-label">{CMS_SCOPE_LABELS[scope]}</span>
          </div>
          <div className="cms-topbar-actions">
            <a className="btn btn-outline" href={CMS_SCOPE_URLS[scope]} target="_blank" rel="noreferrer">
              Otevřít stránku
            </a>
            <label className="btn btn-outline import-btn">
              Import JSON
              <input ref={importRef} type="file" accept="application/json" hidden onChange={handleImport} />
            </label>
            <button className="btn btn-outline" type="button" onClick={handleExport}>
              Export JSON
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSave}>
              Uložit změny
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleLogout}>
              Odhlásit
            </button>
          </div>
        </header>

        <div className="cms-main row g-4">
          <aside className="cms-sidebar col-12 col-lg-3" aria-label="Navigace CMS">
            <nav className="cms-sidebar-nav">
              {(Object.keys(CMS_PAGE_SCOPES) as Array<keyof typeof CMS_PAGE_SCOPES>).map((s) => (
                <button
                  key={s}
                  className={`cms-nav-btn ${s === scope ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setScope(s)}
                >
                  {CMS_SCOPE_LABELS[s]}
                </button>
              ))}
            </nav>
          </aside>

          <section className="cms-editor col-12 col-lg-9">
            <header className="cms-editor-head">
              <h1>Editor obsahu</h1>
            </header>

            <form className="cms-form cms-form-page">
              {visibleSections.includes("settings") && (
                <details open data-cms-section="settings">
                  <summary>Globální nastavení</summary>
                  <div className="grid-2">
                    <label>Název značky <input type="text" value={draft.settings.siteName} onChange={(e) => updateField(["settings", "siteName"], e.target.value)} /></label>
                    <label>Text loga <input type="text" value={draft.settings.logoText} onChange={(e) => updateField(["settings", "logoText"], e.target.value)} /></label>
                    <label>Primární barva <input type="color" value={draft.settings.primaryColor} onChange={(e) => updateField(["settings", "primaryColor"], e.target.value)} /></label>
                    <label>Sekundární barva <input type="color" value={draft.settings.secondaryColor} onChange={(e) => updateField(["settings", "secondaryColor"], e.target.value)} /></label>
                    <label>Akcent barva <input type="color" value={draft.settings.accentColor} onChange={(e) => updateField(["settings", "accentColor"], e.target.value)} /></label>
                    <label>
                      Font
                      <select value={draft.settings.fontFamily} onChange={(e) => updateField(["settings", "fontFamily"], e.target.value)}>
                        <option value="'Avenir Next', 'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif">Avenir Next</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                      </select>
                    </label>
                    <label>Nahrát favicon <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(["settings", "favicon"], e.target.files[0])} /></label>
                    <label className="full">Text v patičce <input type="text" value={draft.settings.footerText} onChange={(e) => updateField(["settings", "footerText"], e.target.value)} /></label>
                  </div>
                </details>
              )}

              {visibleSections.includes("hero") && (
                <details data-cms-section="hero">
                  <summary>Hero sekce (Domů)</summary>
                  <div className="grid-1">
                    <label>Nahrát Hero obrázek <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(["sections", "hero", "image"], e.target.files[0])} /></label>
                    <label>Nadpis <input type="text" value={draft.sections.hero.title} onChange={(e) => updateField(["sections", "hero", "title"], e.target.value)} /></label>
                    <label>Podnadpis <textarea rows={3} value={draft.sections.hero.subtitle} onChange={(e) => updateField(["sections", "hero", "subtitle"], e.target.value)} /></label>
                    <label>CTA text <input type="text" value={draft.sections.hero.ctaText} onChange={(e) => updateField(["sections", "hero", "ctaText"], e.target.value)} /></label>
                    <label>CTA odkaz <input type="text" value={draft.sections.hero.ctaTarget} onChange={(e) => updateField(["sections", "hero", "ctaTarget"], e.target.value)} /></label>
                  </div>
                </details>
              )}

              {visibleSections.includes("about") && (
                <details data-cms-section="about">
                  <summary>O nás</summary>
                  <div className="grid-1">
                    <label>Nadpis <input type="text" value={draft.sections.about.title} onChange={(e) => updateField(["sections", "about", "title"], e.target.value)} /></label>
                    <label>Text <textarea rows={4} value={draft.sections.about.text} onChange={(e) => updateField(["sections", "about", "text"], e.target.value)} /></label>
                    <label>Nahrát obrázek <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(["sections", "about", "image"], e.target.files[0])} /></label>
                  </div>
                </details>
              )}

              {visibleSections.includes("services") && (
                <details data-cms-section="services">
                  <summary>Služby</summary>
                  <div className="grid-1">
                    <label>Nadpis <input type="text" value={draft.sections.services.title} onChange={(e) => updateField(["sections", "services", "title"], e.target.value)} /></label>
                    <div className="repeater-list">
                      {draft.sections.services.items.map((item, i) => (
                        <div key={i} className="repeater-item bg-white rounded-xl border border-neutral-200 p-6">
                          <div className="repeater-item-head">
                            <strong>Služba #{i + 1}</strong>
                            <button type="button" className="btn btn-ghost" onClick={() => removeRepeaterItem(["sections", "services", "items"], i)}>Smazat</button>
                          </div>
                          <div className="grid-1">
                            <label>Název <input className="form-control" value={item.title} onChange={(e) => { const n = clone(draft); n.sections.services.items[i].title = e.target.value; setDraft(n); }} /></label>
                            <label>Popis <textarea className="form-control" rows={3} value={item.description} onChange={(e) => { const n = clone(draft); n.sections.services.items[i].description = e.target.value; setDraft(n); }} /></label>
                            <label>Cena <input className="form-control" value={item.price} onChange={(e) => { const n = clone(draft); n.sections.services.items[i].price = e.target.value; setDraft(n); }} /></label>
                            <label>Nahrát obrázek <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(["sections", "services", "items", String(i), "image"], f); }} /></label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => addRepeaterItem(["sections", "services", "items"], { title: "", description: "", price: "", image: "" })}>+ Přidat službu</button>
                  </div>
                </details>
              )}

              {visibleSections.includes("horses") && (
                <details data-cms-section="horses">
                  <summary>Naši koně</summary>
                  <div className="grid-1">
                    <label>Nadpis <input type="text" value={draft.sections.horses.title} onChange={(e) => updateField(["sections", "horses", "title"], e.target.value)} /></label>
                    <div className="repeater-list">
                      {draft.sections.horses.items.map((item, i) => (
                        <div key={i} className="repeater-item bg-white rounded-xl border border-neutral-200 p-6">
                          <div className="repeater-item-head">
                            <strong>Kůň #{i + 1}</strong>
                            <button type="button" className="btn btn-ghost" onClick={() => removeRepeaterItem(["sections", "horses", "items"], i)}>Smazat</button>
                          </div>
                          <div className="grid-1">
                            <label>Jméno <input className="form-control" value={item.name} onChange={(e) => { const n = clone(draft); n.sections.horses.items[i].name = e.target.value; setDraft(n); }} /></label>
                            <label>Plemeno <input className="form-control" value={item.breed} onChange={(e) => { const n = clone(draft); n.sections.horses.items[i].breed = e.target.value; setDraft(n); }} /></label>
                            <label>Věk <input className="form-control" value={item.age} onChange={(e) => { const n = clone(draft); n.sections.horses.items[i].age = e.target.value; setDraft(n); }} /></label>
                            <label>Popis <textarea className="form-control" rows={3} value={item.description} onChange={(e) => { const n = clone(draft); n.sections.horses.items[i].description = e.target.value; setDraft(n); }} /></label>
                            <label>Nahrát obrázek <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(["sections", "horses", "items", String(i), "image"], f); }} /></label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => addRepeaterItem(["sections", "horses", "items"], { name: "", breed: "", age: "", description: "", image: "" })}>+ Přidat koně</button>
                  </div>
                </details>
              )}

              {visibleSections.includes("gallery") && (
                <details data-cms-section="gallery">
                  <summary>Galerie</summary>
                  <div className="grid-1">
                    <label>Nadpis <input type="text" value={draft.sections.gallery.title} onChange={(e) => updateField(["sections", "gallery", "title"], e.target.value)} /></label>
                    <div className="repeater-list">
                      {draft.sections.gallery.images.map((item, i) => (
                        <div key={i} className="repeater-item bg-white rounded-xl border border-neutral-200 p-6">
                          <div className="repeater-item-head">
                            <strong>Fotka #{i + 1}</strong>
                            <button type="button" className="btn btn-ghost" onClick={() => removeRepeaterItem(["sections", "gallery", "images"], i)}>Smazat</button>
                          </div>
                          <div className="grid-1">
                            <label>Alt text <input className="form-control" value={item.alt} onChange={(e) => { const n = clone(draft); n.sections.gallery.images[i].alt = e.target.value; setDraft(n); }} /></label>
                            <label>Nahrát obrázek <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(["sections", "gallery", "images", String(i), "src"], f); }} /></label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => addRepeaterItem(["sections", "gallery", "images"], { src: "", alt: "" })}>+ Přidat fotku</button>
                  </div>
                </details>
              )}

              {visibleSections.includes("vouchers") && (
                <details data-cms-section="vouchers">
                  <summary>Produkty</summary>
                  <div className="grid-1">
                    <label>Nadpis <input type="text" value={draft.sections.vouchers.title} onChange={(e) => updateField(["sections", "vouchers", "title"], e.target.value)} /></label>
                    <label>Text <textarea rows={3} value={draft.sections.vouchers.text} onChange={(e) => updateField(["sections", "vouchers", "text"], e.target.value)} /></label>
                    <div className="repeater-list">
                      {draft.sections.vouchers.items.map((item, i) => (
                        <div key={i} className="repeater-item bg-white rounded-xl border border-neutral-200 p-6">
                          <div className="repeater-item-head">
                            <strong>Poukaz #{i + 1}</strong>
                            <button type="button" className="btn btn-ghost" onClick={() => removeRepeaterItem(["sections", "vouchers", "items"], i)}>Smazat</button>
                          </div>
                          <div className="grid-1">
                            <label>Název <input className="form-control" value={item.name} onChange={(e) => { const n = clone(draft); n.sections.vouchers.items[i].name = e.target.value; setDraft(n); }} /></label>
                            <label>Popis <textarea className="form-control" rows={3} value={item.description} onChange={(e) => { const n = clone(draft); n.sections.vouchers.items[i].description = e.target.value; setDraft(n); }} /></label>
                            <label>Cena <input className="form-control" value={item.price} onChange={(e) => { const n = clone(draft); n.sections.vouchers.items[i].price = e.target.value; setDraft(n); }} /></label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => addRepeaterItem(["sections", "vouchers", "items"], { name: "", description: "", price: "" })}>+ Přidat položku</button>
                  </div>
                </details>
              )}

              {visibleSections.includes("contact") && (
                <details data-cms-section="contact">
                  <summary>Kontakt</summary>
                  <div className="grid-2">
                    <label>Nadpis <input type="text" value={draft.sections.contact.title} onChange={(e) => updateField(["sections", "contact", "title"], e.target.value)} /></label>
                    <label>Adresa <input type="text" value={draft.sections.contact.address} onChange={(e) => updateField(["sections", "contact", "address"], e.target.value)} /></label>
                    <label>Telefon <input type="text" value={draft.sections.contact.phone} onChange={(e) => updateField(["sections", "contact", "phone"], e.target.value)} /></label>
                    <label>Email <input type="email" value={draft.sections.contact.email} onChange={(e) => updateField(["sections", "contact", "email"], e.target.value)} /></label>
                    <label className="full">Potvrzovací zpráva <textarea rows={2} value={draft.sections.contact.successMessage} onChange={(e) => updateField(["sections", "contact", "successMessage"], e.target.value)} /></label>
                  </div>
                </details>
              )}
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
