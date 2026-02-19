import React from "react";
import { Link } from "react-router-dom";
import { uiPatterns } from "../utils/uiTokens";
import type { AppData } from "../data/defaultData";

interface HomeActionsSectionProps {
  gallery: AppData["sections"]["gallery"];
}

export function HomeActionsSection({ gallery }: HomeActionsSectionProps) {
  const latest = [...gallery.images].slice(-3).reverse();

  return (
    <section id="home-actions" className="section container">
      <div className={uiPatterns.FloatingPanel}>
        <div className="home-actions-list">
          {latest.map((item, index) => (
            <article key={item.src} className={`home-action-item ${uiPatterns.FloatingServiceCard}`}>
              <div className="home-action-body">
                <h3>Akce #{latest.length - index}</h3>
                <p>{item.alt || "Momentka z dění na farmě."}</p>
                <Link className="link-inline" to="/akce">
                  zobrazit všechny akce <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
