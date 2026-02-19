import React from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../state/AppDataContext";

const DEFAULT_LOGO = "migration_export/images/krouzky/krouzky__02__40942955f2cf.png";

interface FooterProps {
  variant?: "home" | "simple";
}

export function Footer({ variant = "simple" }: FooterProps) {
  const { data } = useAppData();
  const year = new Date().getFullYear();
  const footerText = data.settings.footerText || data.settings.siteName;

  if (variant === "home") {
    return (
      <footer className="site-footer" aria-label="Patička webu">
        <div className="container footer-home">
          <div className="footer-home-map">
            <h3>Najdeš nás tady</h3>
            <iframe
              title="Mapa farmy"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Janova%20Hora%20466%2C%20763%2012%20Vizovice&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>
          <div className="footer-home-links">
            <h3>Užitečné odkazy</h3>
            <Link to="/sluzby">Služby</Link>
            <Link to="/akce">Akce</Link>
            <Link to="/nasi-kone">Naši koně</Link>
            <Link to="/o-nas">O nás</Link>
            <Link to="/kontakt">Kontakt</Link>
          </div>
          <div className="footer-home-brand">
            <img src={DEFAULT_LOGO} alt="Logo farmy" />
            <p id="footer-text">© {year} {footerText}</p>
            <p className="footer-note">
              Farma pod Janovou horou z.s.
              <br />
              Janova Hora 466, 763 12 Vizovice
              <br />
              Tel.: +420 605 279 222
            </p>
            <Link className="lock-btn" to="/cms" aria-label="Přihlášení do CMS">
              🔒
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer" aria-label="Patička webu">
      <div className="container footer-inner">
        <div>
          <p id="footer-text">© {year} {footerText}</p>
          <p className="footer-note">Zásady soukromí · Obchodní podmínky · Provozovatel webu</p>
        </div>
        <Link className="lock-btn" to="/cms" aria-label="Přihlášení do CMS">
          🔒
        </Link>
      </div>
    </footer>
  );
}
