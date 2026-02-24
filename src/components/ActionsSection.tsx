import React, { useEffect, useMemo, useState } from "react";
import { uiPatterns } from "../utils/uiTokens";
import type { AppData } from "../data/defaultData";

interface ActionsSectionProps {
  gallery: AppData["sections"]["gallery"];
}

interface ActionPost {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  photos: Array<{ src: string; alt: string }>;
}

const PHOTOS_PER_POST = 2;

function buildActionPosts(images: AppData["sections"]["gallery"]["images"]): ActionPost[] {
  const posts: ActionPost[] = [];
  for (let i = 0; i < images.length; i += PHOTOS_PER_POST) {
    const photos = images.slice(i, i + PHOTOS_PER_POST);
    if (photos.length === 0) continue;
    const index = posts.length + 1;
    const primary = photos[0];
    const summary = primary.alt || "Momentka z každodenního života na farmě.";
    posts.push({
      id: `action-post-${index}`,
      title: `Akce na farmě #${index}`,
      summary,
      paragraphs: [
        `${summary} Na farmě pravidelně pořádáme akce pro děti i dospělé, kde je prostor pro kontakt s koňmi, společný čas venku a příjemnou atmosféru.`,
        "Součástí programu bývá seznámení s péčí o koně, práce ze země, bezpečný pohyb kolem zvířat a čas strávený v přírodě. Každá akce je vedená tak, aby si ji užili začátečníci i ti, kteří už mají s ježděním zkušenosti.",
        "Cílem je nabídnout klidný, smysluplný zážitek a odnést si praktické dovednosti i hezké vzpomínky. Pokud tě tento typ akce zaujal, rádi ti doporučíme vhodný termín.",
      ],
      photos,
    });
  }
  return posts;
}

export function ActionsSection({ gallery }: ActionsSectionProps) {
  const posts = useMemo(() => buildActionPosts(gallery.images), [gallery.images]);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const activePost = activePostIndex !== null ? posts[activePostIndex] : null;
  const photos = activePost?.photos ?? [];
  const activePhoto = photos[activePhotoIndex] ?? null;

  useEffect(() => {
    if (activePostIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePostIndex(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activePostIndex]);

  const openPost = (index: number) => {
    setActivePostIndex(index);
    setActivePhotoIndex(0);
  };

  const showPreviousPost = () => {
    if (activePostIndex === null || posts.length === 0) return;
    const prevIndex = (activePostIndex - 1 + posts.length) % posts.length;
    setActivePostIndex(prevIndex);
    setActivePhotoIndex(0);
  };

  const showNextPost = () => {
    if (activePostIndex === null || posts.length === 0) return;
    const nextIndex = (activePostIndex + 1) % posts.length;
    setActivePostIndex(nextIndex);
    setActivePhotoIndex(0);
  };

  const showPreviousPhoto = () => {
    if (photos.length <= 1) return;
    setActivePhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  const showNextPhoto = () => {
    if (photos.length <= 1) return;
    setActivePhotoIndex((i) => (i + 1) % photos.length);
  };

  return (
    <section id="actions" className="section container">
      <div className={`actions-blog-list cards-bg-title ${uiPatterns.FloatingPanel}`} data-bg-title="Akce">
        {posts.map((post, index) => (
          <article key={post.id} className={`action-post-card hs-card ${uiPatterns.FloatingServiceCard}`}>
            {post.photos[0] && (
              <div className="action-post-media">
                <img src={post.photos[0].src} alt={post.photos[0].alt || post.title} loading="lazy" />
              </div>
            )}
            <div className="action-post-body">
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <button className="btn btn-outline action-card-cta" type="button" onClick={() => openPost(index)}>
                Více
              </button>
            </div>
          </article>
        ))}
      </div>

      {activePost && (
        <div className="action-modal open hs-overlay" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
          <div className="action-modal-card">
            <button
              className="close-btn action-modal-close"
              type="button"
              aria-label="Zavřít detail článku"
              onClick={() => setActivePostIndex(null)}
            >
              ×
            </button>

            <div className="action-modal-content">
              <header className="action-modal-head">
                <h3 id="action-modal-title">{activePost.title}</h3>
                {activePost.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </header>

              {activePhoto && (
                <div className="action-modal-media">
                  <button
                    className="btn btn-outline media-nav-btn action-photo-nav action-photo-nav-prev"
                    type="button"
                    aria-label="Předchozí fotka"
                    onClick={showPreviousPhoto}
                    disabled={photos.length <= 1}
                  >
                    ←
                  </button>
                  <img src={activePhoto.src} alt={activePhoto.alt || activePost.title} />
                  <button
                    className="btn btn-outline media-nav-btn action-photo-nav action-photo-nav-next"
                    type="button"
                    aria-label="Další fotka"
                    onClick={showNextPhoto}
                    disabled={photos.length <= 1}
                  >
                    →
                  </button>
                </div>
              )}

              {photos.length > 1 && (
                <div className="action-modal-thumbs" aria-label="Výběr fotky">
                  {photos.map((photo, photoIndex) => (
                    <button
                      key={photo.src}
                      className={`action-modal-thumb ${photoIndex === activePhotoIndex ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setActivePhotoIndex(photoIndex)}
                      aria-label={`Zobrazit fotku ${photoIndex + 1}`}
                    >
                      <img src={photo.src} alt={photo.alt || `${activePost.title} foto ${photoIndex + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              <footer className="action-modal-footer">
                <button className="btn btn-outline" type="button" onClick={showPreviousPost}>
                  ← Předchozí článek
                </button>
                <span>
                  Článek {activePostIndex !== null ? activePostIndex + 1 : 1} z {posts.length}
                </span>
                <button className="btn btn-outline" type="button" onClick={showNextPost}>
                  Další článek →
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
