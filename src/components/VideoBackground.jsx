import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import assemblyCamera from "../assets/assembly-camera.mp4";
import droneReveal from "../assets/drone-reveal.mp4";
import configuroBg from "../assets/configuro-bg.mp4";

// Background video is atmosphere, not subject: routes that sell across multiple
// service pillars use the brand-neutral loop so a specific product (a watch, a
// car) never narrows how the company reads. Swap in dedicated abstract loops later.
const ROUTE_VIDEO = {
  "/": configuroBg,
  "/services": assemblyCamera,
  "/templates": assemblyCamera,
  "/playground": assemblyCamera,
  "/work": configuroBg,
  "/pricing": configuroBg,
  "/contact": configuroBg,
  "/about": droneReveal,
};

function VideoBackground() {
  const location = useLocation();
  const src = ROUTE_VIDEO[location.pathname] || configuroBg;
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let duration = 4;
    let isReady = false;
    let frameId = 0;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = false;

    const scrollProgress = () => {
      const root = document.documentElement;
      const maxScroll = root.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.min(1, Math.max(0, (window.scrollY || root.scrollTop || 0) / maxScroll));
    };

    const syncToScroll = () => {
      frameId = 0;
      if (!isReady || prefersReducedMotion || document.hidden) return;

      const targetTime = scrollProgress() * Math.max(0, duration - 0.05);
      try {
        video.currentTime = targetTime;
      } catch (error) {
        // Some browsers reject frame seeking until enough data is buffered.
      }
      video.pause();
    };

    const requestSync = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(syncToScroll);
    };

    const handleMetadata = () => {
      duration = video.duration || 4;
      isReady = true;
      syncToScroll();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      requestSync();
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    video.load();
    video.pause();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      video.removeEventListener("loadedmetadata", handleMetadata);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [src]);

  return (
    <div className="cinematic-bg" aria-hidden="true">
      <video
        ref={ref}
        key={src}
        muted
        playsInline
        loop
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="cinematic-vig" />
    </div>
  );
}

export default VideoBackground;
