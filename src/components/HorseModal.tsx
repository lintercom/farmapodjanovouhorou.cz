import React, { useEffect } from "react";
import { getHorsePhotos } from "../utils/helpers";
import type { AppData } from "../data/defaultData";

interface HorseModalProps {
  horse: AppData["sections"]["horses"]["items"][0];
  photoIndex: number;
  onPhotoChange: (_i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function HorseModal({ horse, photoIndex, onPhotoChange, onPrev, onNext, onClose }: HorseModalProps) {
  const photos = getHorsePhotos(horse);
  const safeIndex = Math.min(Math.max(photoIndex, 0), photos.length - 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="horse-modal open"
      id="horse-modal"
      role="dialog"
      aria-modal="true"
      aria-hidden="false"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="horse-modal-card">
        <button
          className="close-btn horse-modal-close"
          aria-label="Zavřít detail koně"
          onClick={onClose}
        >
          ×
        </button>
        <div className="horse-modal-media">
          {photos.length > 0 && (
            <img
              id="horse-modal-image"
              src={photos[safeIndex]}
              alt={`Fotka koně ${horse.name}`}
            />
          )}
          <div id="horse-modal-thumbs" className="horse-modal-thumbs" aria-label="Další fotky koně">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`horse-modal-thumb ${i === safeIndex ? "is-active" : ""}`}
                onClick={() => onPhotoChange(i)}
                aria-label={`Zobrazit fotku ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="horse-modal-content">
          <h3 id="horse-modal-name">{horse.name}</h3>
          <p id="horse-modal-meta">
            Plemeno: {horse.breed} | Věk: {horse.age}
          </p>
          <p id="horse-modal-description">{horse.description}</p>
          <div className="horse-modal-actions">
            <button className="btn btn-outline" type="button" onClick={onPrev}>
              Předchozí kůň
            </button>
            <button className="btn btn-outline" type="button" onClick={onNext}>
              Další kůň
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
