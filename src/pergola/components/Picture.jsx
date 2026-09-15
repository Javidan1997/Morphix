const IMG = "/pergola-configurators/v2/img";

/**
 * Responsive AVIF/WebP picture for derivatives in public/pergola-configurators/v2/img.
 * `fallback` picks the WebP width used as the plain src.
 */
export default function Picture({ name, widths, sizes, alt, width, height, priority = false, className, imgClassName, fallback }) {
  const set = (ext) => widths.map((w) => `${IMG}/${name}-${w}.${ext} ${w}w`).join(", ");
  const src = `${IMG}/${name}-${fallback ?? widths[Math.min(1, widths.length - 1)]}.webp`;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img className={imgClassName} src={src} srcSet={set("webp")} sizes={sizes} alt={alt} width={width} height={height}
        loading={priority ? "eager" : "lazy"} decoding={priority ? "sync" : "async"} fetchPriority={priority ? "high" : undefined} />
    </picture>
  );
}

export { IMG };
