import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppData } from "../state/AppDataContext";

const DEFAULT_LOGO = "migration_export/images/krouzky/krouzky__02__40942955f2cf.png";

export function Header() {
  const { data } = useAppData();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const logoSrc = data.settings.favicon?.trim() || DEFAULT_LOGO;
  const currentPath = (location.pathname.replace(/\/+$/, "") || "/");

  const handleTopNavClick = (targetPath: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const normalizedTargetPath = targetPath.replace(/\/+$/, "") || "/";
    if (currentPath !== normalizedTargetPath) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} id="top">
      <nav className="nav container" aria-label="Hlavní navigace">
        <Link to="/" className="brand" id="brand-link" aria-label="Domů" onClick={handleTopNavClick("/")}>
          <img id="brand-logo" src={logoSrc} alt="Logo farmy" />
        </Link>
        <button
          className="hamburger"
          id="hamburger"
          type="button"
          aria-label="Otevřít menu"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          className={`nav-links ${menuOpen ? "open" : ""}`}
          id="nav-links"
          role="list"
          onClick={() => setMenuOpen(false)}
        >
          <li>
            <Link to="/" onClick={handleTopNavClick("/")}>Domů</Link>
          </li>
          <li className={`nav-dropdown ${dropdownOpen ? "open" : ""}`}>
            <div className="nav-dropdown-head">
              <Link className="nav-main-link" to="/sluzby" onClick={handleTopNavClick("/sluzby")}>
                Služby
              </Link>
              <button
                className="nav-dropdown-toggle"
                type="button"
                aria-expanded={dropdownOpen}
                aria-controls="services-dropdown"
                aria-label="Rozbalit služby"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen((o) => !o);
                }}
              >
                <span aria-hidden="true">▾</span>
              </button>
            </div>
            <ul className="dropdown-menu" id="services-dropdown">
              <li>
                <Link to="/sluzby#tabory">Tábory</Link>
              </li>
              <li>
                <Link to="/sluzby#krouzky">Kroužky</Link>
              </li>
              <li>
                <Link to="/sluzby#vyjizdky">Vyjížďky</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/akce" onClick={handleTopNavClick("/akce")}>Akce</Link>
          </li>
          <li>
            <Link to="/nasi-kone" onClick={handleTopNavClick("/nasi-kone")}>Naši koně</Link>
          </li>
          <li>
            <Link to="/o-nas" onClick={handleTopNavClick("/o-nas")}>O nás</Link>
          </li>
          <li>
            <Link to="/kontakt" onClick={handleTopNavClick("/kontakt")}>Kontakt</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
