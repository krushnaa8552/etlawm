import { useState, useEffect, useRef } from "react";
import { colours, fonts } from "../../theme/theme.js";

// ── Local assets ────────────────────────────────────────────────────────────
import c1 from "../../assets/carousel1.jpeg";
import c2 from "../../assets/carousel2.jpeg";
import c3 from "../../assets/carousel3.jpeg";
import c4 from "../../assets/carousel4.jpeg";
import c5 from "../../assets/carousel5.jpeg";

// ── Keyframe + custom-property injection ─────────────────────────────────────
// Tailwind cannot express @keyframes or CSS custom properties, so we inject
// them once via a <style> tag. Everything else is pure Tailwind.
const GLOBAL_STYLES = `
  :root {
    --warm-white: ${colours.background};
    --bark:       ${colours.accent};
    --bark-light: ${colours.hover};
    --ink:        ${colours.text};
    --ink-soft:   rgba(43,43,43,0.55);
    --serif:      ${fonts.primary};
    --sans:       ${fonts.secondary};
    --ease:       cubic-bezier(0.25, 0.5, 0.25, 1);
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Tailwind won't generate these exact animation calls with delays */
  .anim-title    { animation: slide-up 0.65s var(--ease) both; }
  .anim-subtitle { animation: slide-up 0.65s 0.08s var(--ease) both; }
  .anim-cta      { animation: slide-up 0.65s 0.16s var(--ease) both; }
`;

const slides = [
  {
    id: "01",
    title: "Root Ritual Hair Oil",
    subtitle: "Ancient herbs. Modern science.",
    image: c1,
  },
  {
    id: "02",
    title: "Scalp Elixir Serum",
    subtitle: "Nourishment from the source.",
    image: c2,
  },
  {
    id: "03",
    title: "Botanical Hair Mask",
    subtitle: "Deep repair. Pure botanicals.",
    image: c3,
  },
  {
    id: "04",
    title: "The Full Collection",
    subtitle: "Complete care. Naturally.",
    image: c4,
  },
  {
    id: "05",
    title: "Herbal Essence Range",
    subtitle: "Pure botanicals. Timeless results.",
    image: c5,
  },
];

const TOTAL = slides.length; // 5

const ModernCarousel = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [animated, setAnimated]     = useState(true);
  const [titleKey, setTitleKey]      = useState(0);
  const intervalRef                  = useRef(null);

  const realIndex = trackIndex === TOTAL ? 0 : trackIndex;

  // ── Navigate ──────────────────────────────────────────────────────────────
  const goToReal = (index) => {
    setAnimated(true);
    setTrackIndex(index);
    setTitleKey((k) => k + 1);
  };

  const nextSlide = () => {
    setAnimated(true);
    setTrackIndex((prev) => prev + 1);
    setTitleKey((k) => k + 1);
  };

  const prevSlide = () => {
    setAnimated(true);
    setTrackIndex((prev) => (prev === 0 ? TOTAL - 1 : prev - 1));
    setTitleKey((k) => k + 1);
  };

  // ── Silent jump: clone → real slide 0 ────────────────────────────────────
  useEffect(() => {
    if (trackIndex === TOTAL) {
      const timer = setTimeout(() => {
        setAnimated(false);
        setTrackIndex(0);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [trackIndex]);

  // ── Auto-advance ──────────────────────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 6000);
    return () => clearInterval(intervalRef.current);
  }, [trackIndex]);

  const trackSlides = [...slides, slides[0]];

  return (
    <>
      {/* Inject global keyframes + CSS variables once */}
      <style>{GLOBAL_STYLES}</style>

      {/* ── carousel-section ── */}
      <section
        style={{ background: "var(--warm-white)" }}
        className="w-screen h-screen p-0 box-border flex items-stretch justify-center overflow-hidden"
      >
        {/* ── carousel-card ── */}
        <div
          style={{ background: "var(--ink)" }}
          className="relative w-full h-full rounded-none overflow-hidden"
        >
          {/* ── Ambient gradient overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(125deg, rgba(30,28,24,0.88) 0%, rgba(30,28,24,0.4) 50%, rgba(30,28,24,0.08) 100%)",
            }}
          />

          {/* ── Image track ── */}
          <div
            className="absolute inset-0 flex w-full h-full z-[1]"
            style={{
              transform: `translateX(-${trackIndex * 100}%)`,
              transition: animated
                ? "transform 0.6s cubic-bezier(0.77,0,0.175,1)"
                : "none",
            }}
          >
            {trackSlides.map((slide, i) => (
              <img
                key={i}
                src={slide.image}
                alt={slide.title}
                draggable={false}
                className="w-full h-full flex-shrink-0 object-cover"
                style={{
                  filter: "saturate(0.85) brightness(0.9)",
                  transition: "filter 0.85s ease",
                }}
              />
            ))}
          </div>

          {/* ── Content overlay ── */}
          <div
            className="relative z-[3] h-full flex flex-col justify-between box-border"
            style={{ padding: "2.5rem 3rem" }}
          >
            {/* Header */}
            <header className="flex items-center justify-between">
              {/* <span
                style={{
                  fontFamily: "var(--sans)",
                  color: "var(--warm-white)",
                  letterSpacing: "0.5em",
                }}
                className="text-[1.1rem] uppercase no-underline font-normal"
              >
                ETLAWM
              </span>*/}
              {/* tagline hidden (commented out in original) */}
            </header>

            {/* Body */}
            <div className="flex-1 flex flex-col justify-end pb-6">
              {/* ghost index number — hidden (commented out in original) */}

              <h2
                key={`title-${titleKey}`}
                className="anim-title m-0 mb-[0.6rem]"
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.0,
                  color: "var(--warm-white)",
                  letterSpacing: "0.01em",
                }}
              >
                {slides[realIndex].title}
              </h2>

              <p
                key={`sub-${titleKey}`}
                className="anim-subtitle m-0 mb-[1.8rem]"
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "0.7rem",
                  fontWeight: 300,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "var(--bark-light)",
                }}
              >
                {slides[realIndex].subtitle}
              </p>

              {/* CTA hidden (commented out in original) */}
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between flex-wrap gap-4">
              {/* Dot indicators */}
              <div className="flex items-center gap-[0.6rem]" role="tablist" aria-label="Slides">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={realIndex === index}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => goToReal(index)}
                    className="h-[2px] rounded-[2px] border-none cursor-pointer p-0"
                    style={{
                      background:
                        realIndex === index
                          ? "var(--bark-light)"
                          : "rgba(247,243,238,0.28)",
                      width: realIndex === index ? "56px" : "28px",
                      transition:
                        "width 0.4s cubic-bezier(0.25,0.5,0.25,1), background 0.4s ease",
                    }}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-3">
                {[
                  { label: "Previous slide", symbol: "←", fn: prevSlide },
                  { label: "Next slide",     symbol: "→", fn: nextSlide },
                ].map(({ label, symbol, fn }) => (
                  <button
                    key={label}
                    aria-label={label}
                    onClick={fn}
                    className="
                      w-11 h-11 rounded-full bg-transparent
                      flex items-center justify-center
                      cursor-pointer text-[1rem]
                      transition-all duration-300 ease-in-out
                      hover:scale-[1.08] active:scale-[0.95]
                    "
                    style={{
                      border: "1px solid rgba(247,243,238,0.3)",
                      color: "var(--warm-white)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--warm-white)";
                      e.currentTarget.style.background = "rgba(247,243,238,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(247,243,238,0.3)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModernCarousel;