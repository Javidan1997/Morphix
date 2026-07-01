import { useCallback, useEffect } from "react";

function Lightbox({ images, index, onClose, onIndexChange }) {
  const isOpen = index !== null && index >= 0;

  const go = useCallback(
    (delta) => {
      if (!images.length) return;
      const next = (index + delta + images.length) % images.length;
      onIndexChange(next);
    },
    [images.length, index, onIndexChange],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, go, onClose]);

  if (!isOpen) return null;
  const current = images[index];
  if (!current) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Project image viewer" onClick={onClose}>
      <button className="lightbox-close" type="button" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {images.length > 1 ? (
        <button
          className="lightbox-nav is-prev"
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
        >
          ‹
        </button>
      ) : null}
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img className="lightbox-image" src={current.src} alt={current.alt} />
        <figcaption className="lightbox-caption">
          {current.project ? <span className="lightbox-caption-project">{current.project}</span> : null}
          <span>{current.alt}</span>
          {images.length > 1 ? (
            <span className="lightbox-counter">
              {index + 1} / {images.length}
            </span>
          ) : null}
        </figcaption>
      </figure>
      {images.length > 1 ? (
        <button
          className="lightbox-nav is-next"
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
        >
          ›
        </button>
      ) : null}
    </div>
  );
}

export default Lightbox;
