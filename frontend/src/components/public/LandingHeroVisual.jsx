import { motion, useReducedMotion } from 'framer-motion';

export function LandingHeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="ab-hero-scene" role="img" aria-label="Illustration of Kimberley reservoir markers, a road, and a municipal water tanker">
      <div className="ab-hero-scene__sky" />
      <div className="ab-hero-scene__ground" />
      <div className="ab-hero-scene__path" aria-hidden="true" />
      <div className="ab-hero-scene__road" aria-hidden="true">
        <div className="ab-hero-scene__road-line" />
      </div>

      <div className="ab-hero-scene__photo-slot">
        <p className="text-[10px] font-heading font-semibold uppercase tracking-wide text-brand-navy-dark">
          Photograph needed
        </p>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Kimberley civic landscape — Newton Reservoir, Big Hole rim, or a Sol Plaatje street with a municipal tanker. Landscape, daylight, no staged people.
        </p>
      </div>

      <img
        src="/dam_marker_watch.svg"
        alt=""
        className="ab-hero-scene__marker"
        style={{ left: '16%', top: '14%' }}
      />
      <img
        src="/dam_marker_healthy.svg"
        alt=""
        className="ab-hero-scene__marker"
        style={{ left: '38%', top: '8%' }}
      />

      <motion.img
        src="/truck_map_icon.svg"
        alt="Municipal water tanker"
        className="ab-hero-scene__tanker"
        initial={reduceMotion ? false : { x: 28, opacity: 0 }}
        animate={reduceMotion ? undefined : { x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

export default LandingHeroVisual;
