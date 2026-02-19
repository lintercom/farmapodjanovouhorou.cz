import React from "react";
import { Link } from "react-router-dom";
import { uiPatterns } from "../utils/uiTokens";
import type { AppData } from "../data/defaultData";

interface ActionsSectionProps {
  gallery: AppData["sections"]["gallery"];
}

export function ActionsSection({ gallery }: ActionsSectionProps) {
  return (
    <section id="actions" className="section container">
      <h2 className="section-title">Akce</h2>
      <p className="section-lead">
        Krátké příběhy a fotky z akcí, táborů i běžného života na farmě.
      </p>
      <div className="action-grid">
        {gallery.images.map((item, index) => (
          <article key={item.src} className={`action-card ${uiPatterns.FloatingServiceCard}`}>
            <div className="action-card-body">
              <h3>Příběh z farmy #{index + 1}</h3>
              <p>{item.alt || "Momentka z každodenního života na farmě."}</p>
              <Link className="link-inline" to="/kontakt">
                zjistit více <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
