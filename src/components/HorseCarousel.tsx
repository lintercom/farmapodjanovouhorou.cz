import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { uiPatterns } from "../utils/uiTokens";
import { getHorseImageSource, formatHorseCardSummary } from "../utils/helpers";
import type { AppData } from "../data/defaultData";

const HOME_HORSES_VISIBLE_COUNT = 3;

function getVisibleCount(): number {
  if (typeof window === "undefined") return HOME_HORSES_VISIBLE_COUNT;
  if (window.matchMedia("(max-width: 920px)").matches) return 1;
  if (window.matchMedia("(max-width: 1200px)").matches) return 2;
  return HOME_HORSES_VISIBLE_COUNT;
}

interface HorseCarouselProps {
  horses: AppData["sections"]["horses"];
}

export function HorseCarousel({ horses }: HorseCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(HOME_HORSES_VISIBLE_COUNT);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = horses.items.length;
  const visible = Math.min(visibleCount, total);
  const maxStart = Math.max(total - visible, 0);
  const clampedStart = Math.min(Math.max(startIndex, 0), maxStart);
  const canSlide = total > visible;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector(".horse-card");
    const trackStyles = window.getComputedStyle(track);
    const gapValue = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0;
    const cardWidth = firstCard instanceof HTMLElement ? firstCard.getBoundingClientRect().width : 0;
    const offsetPx = clampedStart * (cardWidth + gapValue);
    track.style.transform = `translateX(-${offsetPx}px)`;
  }, [clampedStart]);

  return (
    <div className={uiPatterns.FloatingPanel}>
      <div className="home-horse-carousel">
        <button
          className="btn btn-outline home-horse-nav-btn home-horse-nav-btn-prev"
          type="button"
          aria-label="Předchozí koně"
          disabled={!canSlide || clampedStart <= 0}
          onClick={() => setStartIndex((i) => Math.max(i - 1, 0))}
        >
          ←
        </button>
        <div className="home-horse-viewport">
          <div ref={trackRef} className="home-horse-track">
            {horses.items.map((horse, index) => {
              const imageSrc = getHorseImageSource(horse);
              const shortDesc = formatHorseCardSummary(horse.description);
              return (
                <article key={horse.name} className={`card horse-card ${uiPatterns.FloatingServiceCard}`}>
                  {imageSrc && (
                    <div className="horse-card-media">
                      <img src={imageSrc} alt={horse.name || "Kůň na farmě"} loading="lazy" />
                    </div>
                  )}
                  <div className="card-body">
                    <h3>{horse.name}</h3>
                    <p className="horse-card-meta">
                      <strong>Plemeno:</strong> {horse.breed}
                    </p>
                    <p className="horse-card-meta">
                      <strong>Věk:</strong> {horse.age}
                    </p>
                    <p className="horse-card-summary">{shortDesc}</p>
                    <Link className="btn btn-outline horse-card-cta" to={`/nasi-kone?horse=${index}`}>
                      Zobrazit
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <button
          className="btn btn-outline home-horse-nav-btn home-horse-nav-btn-next"
          type="button"
          aria-label="Další koně"
          disabled={!canSlide || clampedStart >= maxStart}
          onClick={() => setStartIndex((i) => Math.min(i + 1, maxStart))}
        >
          →
        </button>
      </div>
    </div>
  );
}
