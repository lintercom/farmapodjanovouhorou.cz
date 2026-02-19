import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { uiPatterns } from "../utils/uiTokens";
import { getHorseImageSource } from "../utils/helpers";
import { HorseModal } from "./HorseModal";
import { HorseCarousel } from "./HorseCarousel";
import type { AppData } from "../data/defaultData";

function formatSectionTitle(title: string | undefined): string {
  const n = String(title ?? "").trim().replace(/[.]$/, "");
  if (!n) return "";
  return n.charAt(0).toUpperCase() + n.slice(1);
}

interface HorsesSectionProps {
  horses: AppData["sections"]["horses"];
  page: string;
}

export function HorsesSection({ horses, page }: HorsesSectionProps) {
  const [searchParams] = useSearchParams();
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const horseParam = searchParams.get("horse");
  useEffect(() => {
    if (page !== "nasi-kone" || modalIndex !== null) return;
    const parsed = horseParam !== null ? parseInt(horseParam, 10) : NaN;
    if (!isNaN(parsed) && parsed >= 0 && parsed < horses.items.length) {
      setModalIndex(parsed);
      setPhotoIndex(0);
    }
  }, [page, horseParam, horses.items.length, modalIndex]);

  if (page === "home") {
    return (
      <section id="horses" className="section container">
        <HorseCarousel horses={horses} />
      </section>
    );
  }

  if (page === "nasi-kone") {
    const currentHorse = modalIndex !== null ? horses.items[modalIndex] : null;
    const total = horses.items.length;

    return (
      <>
        <section id="horses" className="section container">
          <div className={uiPatterns.FloatingPanel}>
            <h2 className="section-title">{formatSectionTitle(horses.title || "Naši koně")}</h2>
            <p className="section-lead">
              Klikni na koně, otevře se detail s informacemi a galerií fotek.
            </p>
            <div className="card-grid">
              {horses.items.map((horse, index) => {
                const imageSrc = getHorseImageSource(horse);
                return (
                  <article
                    key={horse.name}
                    className={`card horse-card ${uiPatterns.FloatingServiceCard} horse-card-clickable`}
                    onClick={() => {
                      setModalIndex(index);
                      setPhotoIndex(0);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setModalIndex(index);
                        setPhotoIndex(0);
                      }
                    }}
                  >
                    {imageSrc && (
                      <div className="horse-card-media">
                        <img src={imageSrc} alt={horse.name || "Kůň na farmě"} loading="lazy" />
                      </div>
                    )}
                    <div className="card-body">
                      <h3>{horse.name}</h3>
                      <p>
                        <strong>Plemeno:</strong> {horse.breed} | <strong>Věk:</strong> {horse.age}
                      </p>
                      <p>{horse.description}</p>
                      <button className="btn btn-outline horse-open-btn" type="button">
                        Detail koně
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        {currentHorse && (
          <HorseModal
            horse={currentHorse}
            photoIndex={photoIndex}
            onPhotoChange={setPhotoIndex}
            onPrev={() => {
              setModalIndex((i) => (i === null ? 0 : (i - 1 + total) % total));
              setPhotoIndex(0);
            }}
            onNext={() => {
              setModalIndex((i) => (i === null ? 0 : (i + 1) % total));
              setPhotoIndex(0);
            }}
            onClose={() => setModalIndex(null)}
          />
        )}
      </>
    );
  }

  return null;
}
