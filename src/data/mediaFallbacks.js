// Real renders used to fill the media sections on each public page,
// so the site shows actual work instead of placeholder slots — in every language.
import { projects } from "./projects";

const find = (slug) => projects.find((p) => p.slug === slug);
const pick = (slug, n) => {
  const project = find(slug);
  const image = project?.images[n];
  return image ? { ...image, project: project.name, slug } : null;
};

const set = (...entries) => entries.filter(Boolean);

export const mediaFallbacks = {
  homeMediaGallery: set(
    pick("beverly-hills-hotel", 0),
    pick("nights-mixed-use", 0),
    pick("private-residence", 1),
    pick("hillside-villa", 0),
    pick("urban-residences", 0),
  ),
  workMediaGallery: set(
    pick("portobello-quarter", 0),
    pick("silver-diner-district", 0),
    pick("poolside-pavilion", 0),
    pick("urban-residences", 1),
    pick("private-residence", 0),
    pick("nights-mixed-use", 2),
  ),
  aboutMediaGallery: set(
    pick("private-residence", 2),
    pick("hillside-villa", 1),
    pick("poolside-pavilion", 2),
    pick("beverly-hills-hotel", 2),
  ),
  pricingMediaGallery: set(
    pick("outdoor-living", 0),
    pick("urban-residences", 2),
    pick("silver-diner-district", 1),
    pick("beverly-hills-hotel", 3),
  ),
  contactMediaGallery: set(
    pick("hillside-villa", 2),
    pick("portobello-quarter", 1),
    pick("nights-mixed-use", 1),
    pick("private-residence", 3),
  ),
  servicesMediaShowcase: set(
    pick("beverly-hills-hotel", 0),
    pick("private-residence", 1),
    pick("outdoor-living", 0),
    pick("nights-mixed-use", 0),
    pick("silver-diner-district", 0),
  ),
};
