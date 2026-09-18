"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
};

export default function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return <section className="aspect-square w-full bg-surface-low" />;
  }

  function showNextImage() {
    setSelectedImageIndex((current) => (current + 1) % images.length);
  }

  function showPreviousImage() {
    setSelectedImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance < 0) {
      showNextImage();
    } else {
      showPreviousImage();
    }
  }

  return (
    <section
      className="relative aspect-square w-full touch-pan-y overflow-hidden bg-surface-low"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStartX.current = null;
      }}
    >
      <Image
        src={images[selectedImageIndex]}
        alt={`Product image ${selectedImageIndex + 1}`}
        fill
        priority
        className="object-cover"
      />

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-surface/75 px-3 py-2 backdrop-blur-sm">
          {images.map((_, index) => {
            const isSelected = index === selectedImageIndex;

            return (
              <button
                key={index}
                type="button"
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedImageIndex(index)}
                className={
                  isSelected
                    ? "h-2 w-5 rounded-full bg-primary transition-all"
                    : "h-2 w-2 rounded-full bg-primary/35 transition-all hover:bg-primary/60"
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}