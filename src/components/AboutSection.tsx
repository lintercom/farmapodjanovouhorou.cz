import React from "react";
import { uiPatterns } from "../utils/uiTokens";
import type { AppData } from "../data/defaultData";

interface AboutSectionProps {
  about: AppData["sections"]["about"];
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="section container">
      <div className={`cards-bg-title ${uiPatterns.FloatingPanel}`} data-bg-title="O nás">
        <article className={`card about-copy-card hs-card ${uiPatterns.FloatingServiceCard}`}>
          <div className="card-body">
            <p>{about.text}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
