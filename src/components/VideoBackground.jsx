import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import pexelsHome from "../assets/pexels-home-optimized.mp4";
import pexelsServices from "../assets/pexels-services-optimized.mp4";
import pexelsWork from "../assets/pexels-work-optimized.mp4";
import pexelsAbout from "../assets/pexels-about-optimized.mp4";
import pexelsContact from "../assets/pexels-contact-optimized.mp4";

// Each route uses a different optimized cut from the long Pexels source so the
// site feels varied without shipping the full 129 MB original as a background.
const ROUTE_VIDEO = {
  "/": pexelsHome,
  "/services": pexelsServices,
  "/templates": pexelsServices,
  "/playground": pexelsServices,
  "/work": pexelsWork,
  "/pricing": pexelsContact,
  "/contact": pexelsContact,
  "/about": pexelsAbout,
};

function VideoBackground() {
  const location = useLocation();
  const src = ROUTE_VIDEO[location.pathname] || pexelsHome;
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isMounted = true;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = !prefersReducedMotion;

    const playVideo = () => {
      if (!isMounted || prefersReducedMotion || document.hidden) {
        video.pause();
        return;
      }

      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          // Browsers can defer autoplay until media is ready; canplay/visibility
          // will retry without surfacing a console error to users.
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      playVideo();
    };

    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("canplay", playVideo);
    video.load();
    playVideo();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      video.removeEventListener("loadedmetadata", playVideo);
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
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
