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
        <div className="home-actions-list cards-bg-title" data-bg-title="Akce">
          {latest.map((item, index) => (
            <article key={item.src} className={`home-action-item ${uiPatterns.FloatingServiceCard}`}>
              <div className="home-action-media">
                <img src={item.src} alt={item.alt || `Akce #${latest.length - index}`} loading="lazy" />
              </div>
              <div className="home-action-body">
                <p className="home-action-meta">
                  Akce na farmě <span>#{latest.length - index}</span>
                </p>
                <h3>Akce #{latest.length - index}</h3>
                <p>{item.alt || "Momentka z dění na farmě."}</p>
                <Link className="btn btn-outline home-action-cta" to="/akce">
                  Více <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
