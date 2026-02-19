import React from "react";
import { uiPatterns } from "../utils/uiTokens";
import { formatSectionTitle } from "../utils/helpers";
import type { AppData } from "../data/defaultData";

interface AboutSectionProps {
  about: AppData["sections"]["about"];
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="section container">
      <article className={`text-card ${uiPatterns.FloatingPanel}`}>
        <h2 className="section-title">{formatSectionTitle(about.title)}</h2>
        <p className="section-lead">{about.text}</p>
      </article>
    </section>
  );
}
