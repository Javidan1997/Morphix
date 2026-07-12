import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import automationIndigo from "../assets/automation-indigo.mp4";
import automationSlate from "../assets/automation-slate.mp4";
import pexelsAbout from "../assets/pexels-about-optimized.mp4";

// Two renders of the "automation network" scene (brand indigo and a calmer
// slate) alternate across routes. The clips are rendered from bg-render/ and
// scrubbed by scroll: the network assembles and powers up as the user reads
// down the page — design, build, automate told visually.
const ROUTE_VIDEO = {
  "/": automationIndigo,
  "/services": automationIndigo,
  "/templates": automationSlate,
  "/playground": automationIndigo,
  "/work": automationSlate,
  "/pricing": automationSlate,
  "/contact": automationIndigo,
  "/about": pexelsAbout,
};

function VideoBackground() {
  const location = useLocation();
  const src = ROUTE_VIDEO[location.pathname] || automationSlate;
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

    // Ease the displayed time toward the scroll target instead of jumping.
    // The clips are all-intra encoded, so each small seek decodes one frame.
    const FRAME = 1 / 30;
    let shownTime = 0;

    const syncToScroll = () => {
      frameId = 0;
      if (!isReady || prefersReducedMotion || document.hidden) return;

      const targetTime = scrollProgress() * Math.max(0, duration - 0.05);
      const delta = targetTime - shownTime;
      if (Math.abs(delta) < FRAME) return;

      shownTime += Math.abs(delta) < FRAME * 2 ? delta : delta * 0.3;
      try {
        video.currentTime = shownTime;
      } catch (error) {
        // Some browsers reject frame seeking until enough data is buffered.
      }
      video.pause();
      frameId = window.requestAnimationFrame(syncToScroll);
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
