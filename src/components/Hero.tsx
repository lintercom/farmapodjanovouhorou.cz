import React from "react";
import { Link } from "react-router-dom";
import type { AppData } from "../data/defaultData";

const HERO_VEIL = "rgba(26, 46, 5, 0.6)";

function isSplitHomeHeroTitle(title: string, page: string): boolean {
  return page === "home" && title.toLowerCase().trim() === "jízda na koni pro děti i dospělé";
}

interface HeroProps {
  hero: AppData["sections"]["hero"];
  page: string;
}

export function Hero({ hero, page }: HeroProps) {
  const bgStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(120deg, ${HERO_VEIL}, rgba(0,0,0,.34)), url('${hero.image.replace(/'/g, "\\'")}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (page !== "home") {
    const titles: Record<string, string> = {
      sluzby: "Služby",
      akce: "Akce",
      "nasi-kone": "Naši koně",
      "o-nas": "O nás",
      kontakt: "Kontakt",
    };
    if (!titles[page]) return null;

    return (
      <section className="hero page-hero" aria-labelledby="hero-title" style={bgStyle}>
        <div className="hero-overlay">
          <div className="container hero-content page-hero-content d-flex align-items-end" />
        </div>
      </section>
    );
  }

  const isCustom = isSplitHomeHeroTitle(hero.title, page);

  return (
    <section className="hero" aria-labelledby="hero-title" style={bgStyle}>
      <div className="hero-overlay">
        <div className="container hero-content">
          <h2 id="hero-title" className={isCustom ? "hero-title-custom" : ""}>
            {isCustom ? (
              <>
                <span className="hero-line hero-line-main">
                  Jízda na <span className="hero-koni">KONI</span>
                </span>
                <span className="hero-line hero-line-pro">pro</span>
                <span className="hero-line hero-line-kids">děti i dospělé</span>
              </>
            ) : (
              hero.title
            )}
          </h2>
          <Link
            className={`btn btn-primary ${isCustom ? "hero-custom-cta" : ""}`}
            to={hero.ctaTarget === "#contact" ? "/kontakt" : hero.ctaTarget || "/kontakt"}
          >
            {hero.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
