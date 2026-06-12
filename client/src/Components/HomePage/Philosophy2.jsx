import { useState } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../../theme/theme";

const principles = [
  {
    number: "01",
    title: "Fewer ingredients.",
    tagline: "Absolute Purity",
    description:
      "Every single botanical must earn its place. Nothing unnecessary, nothing added for fragrance or appearance alone. We believe that dilution is the enemy of healing.",
    // A clean SVG droplet + leaf
    svg: (isActive) => (
      <svg
        viewBox="0 0 100 100"
        className={`w-16 h-16 transition-all duration-700 ${
          isActive ? "text-[#A77C6B] scale-110" : "text-gray-600 scale-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M50 15 C30 45 30 75 50 85 C70 75 70 45 50 15 Z"
          className={`transition-all duration-700 ${
            isActive ? "fill-[#A77C6B]/10 stroke-[2]" : "fill-none"
          }`}
        />
        <path
          d="M50 45 C50 45 62 48 62 58 C62 64 57 68 50 68"
          strokeDasharray={isActive ? "none" : "2 2"}
          className="transition-all duration-500"
        />
        <circle
          cx="50"
          cy="85"
          r="3"
          className={`${isActive ? "fill-[#A77C6B]" : "fill-gray-600"}`}
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Nature, refined.",
    tagline: "Laboratory Verified",
    description:
      "We preserve the raw organic strength of botanical extracts while refining them in scientific laboratories to ensure optimal absorption, safety, and everyday stability.",
    // An SVG beaker + stem
    svg: (isActive) => (
      <svg
        viewBox="0 0 100 100"
        className={`w-16 h-16 transition-all duration-700 ${
          isActive ? "text-[#A77C6B] scale-110" : "text-gray-600 scale-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Beaker outline */}
        <path
          d="M35 25 L45 25 L45 50 L25 80 L75 80 L55 50 L55 25 L65 25"
          className={`transition-all duration-700 ${
            isActive ? "stroke-[2]" : ""
          }`}
        />
        {/* Beaker fluid level */}
        <path
          d="M29.5 73 L70.5 73"
          className={`transition-all duration-700 ${
            isActive ? "stroke-[#A77C6B] stroke-[2]" : "stroke-gray-600"
          }`}
        />
        {/* Plant leaf growing out */}
        <path
          d="M50 73 L50 35 C50 35 60 30 62 40 C64 50 50 50 50 50"
          className={`transition-all duration-700 ${
            isActive ? "stroke-[#bfd8bd] stroke-[2]" : "stroke-gray-500"
          }`}
        />
        {isActive && (
          <>
            <circle cx="42" cy="65" r="2" fill="currentColor" className="animate-bubble-1" />
            <circle cx="58" cy="68" r="1.5" fill="currentColor" className="animate-bubble-2" />
          </>
        )}
      </svg>
    ),
  },
  {
    number: "03",
    title: "Results over trends.",
    tagline: "Consistent Care",
    description:
      "Our formulas are built around cellular nourishment, consistency, and measurable care — not temporary visual filters, heavy silicones, or social media trends.",
    // An SVG time cycle + plant
    svg: (isActive) => (
      <svg
        viewBox="0 0 100 100"
        className={`w-16 h-16 transition-all duration-700 ${
          isActive ? "text-[#A77C6B] scale-110" : "text-gray-600 scale-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Circle dial */}
        <circle
          cx="50"
          cy="50"
          r="35"
          strokeDasharray={isActive ? "none" : "4 4"}
          className={`transition-all duration-700 ${
            isActive ? "stroke-[2] stroke-[#A77C6B]/40" : ""
          }`}
        />
        {/* Clock hand/sprout */}
        <path
          d="M50 50 L50 25 C50 25 58 20 60 28 C62 36 50 42 50 50"
          className={`transition-all duration-700 ${
            isActive ? "stroke-[#A77C6B] stroke-[2]" : "stroke-gray-500"
          }`}
          style={{
            transformOrigin: "50px 50px",
            transform: isActive ? "rotate(30deg)" : "rotate(0deg)",
            transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        <path
          d="M50 50 L68 58"
          className="transition-all duration-700"
          style={{
            transformOrigin: "50px 50px",
            transform: isActive ? "rotate(-40deg)" : "rotate(0deg)",
            transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Philosophy2() {
  const [activePillar, setActivePillar] = useState(0);

  return (
    <section className="relative w-full py-24 bg-[#0d0d0c] overflow-hidden">
      {/* Immersive radial glows */}
      <div className="absolute -left-96 top-1/4 w-[600px] h-[600px] rounded-full bg-[#A77C6B]/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute -right-96 bottom-1/4 w-[600px] h-[600px] rounded-full bg-[#bfd8bd]/[0.015] blur-3xl pointer-events-none" />

      {/* Decorative vertical running line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.02] hidden xl:block pointer-events-none" />

      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] xl:gap-24 items-start">
          {/* LEFT SIDE: Sticky Header / Introduction */}
          <div className="lg:sticky lg:top-32 flex flex-col items-start">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A77C6B]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A77C6B]">
                Our Philosophy
              </p>
            </div>

            <h2
              className="text-[clamp(2rem,4.5vw,4.2rem)] font-normal leading-[1.1] text-[#F7F3EC] tracking-[-0.035em] mb-8"
              style={{ fontFamily: fonts.primary }}
            >
              Less elements. <br />
              <span className="italic text-gray-500">Deeper nourishment.</span>
            </h2>

            <div className="space-y-6 text-sm md:text-base text-gray-400 leading-relaxed mb-10 max-w-md">
              <p>
                ETLAWM was founded on a singular conviction: your hair does not require chemical facades to look healthy. It requires targeted bio-available nutrients that respect your scalp's integrity.
              </p>
              <p className="text-gray-500">
                By stripping away the artificial silicones, colorants, and fillers that coat your scalp, we allow active botanicals to heal from the follicles up.
              </p>
            </div>

            <Link
              to="/collection"
              className="group inline-flex items-center gap-6 px-6 py-3.5 border border-[#A77C6B]/30 hover:border-[#A77C6B] text-xs font-bold uppercase tracking-widest text-[#F7F3EC] rounded-sm transition-all duration-300 bg-[#A77C6B]/5 hover:bg-[#A77C6B] hover:text-[#171715]"
            >
              Explore Collection
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* RIGHT SIDE: Interactive Accordion-Cards */}
          <div className="flex flex-col gap-6">
            {principles.map((p, idx) => {
              const isActive = activePillar === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActivePillar(idx)}
                  onMouseEnter={() => setActivePillar(idx)}
                  className={`relative flex flex-col md:flex-row gap-6 p-8 rounded-lg border cursor-pointer transition-all duration-500 ease-out select-none ${
                    isActive
                      ? "bg-[#171715] border-[#A77C6B]/40 shadow-[0_15px_40px_rgba(0,0,0,0.4)] translate-x-1"
                      : "bg-transparent border-white/[0.04] hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Active Border Accent Line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#A77C6B] transition-transform duration-500 origin-top rounded-l-lg ${
                      isActive ? "scale-y-100" : "scale-y-0"
                    }`}
                  />

                  {/* SVG / Graphic Column */}
                  <div className="flex items-center justify-start md:justify-center w-16 h-16 shrink-0 bg-white/[0.02] rounded-md p-2">
                    {p.svg(isActive)}
                  </div>

                  {/* Content Column */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-xs font-bold tracking-wider ${
                          isActive ? "text-[#A77C6B]" : "text-gray-600"
                        }`}
                      >
                        {p.number}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
                        {p.tagline}
                      </span>
                    </div>

                    <h3
                      className={`text-xl md:text-2xl font-normal tracking-wide transition-colors duration-300 mb-3 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                      style={{ fontFamily: fonts.primary }}
                    >
                      {p.title}
                    </h3>

                    {/* Height animated description */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100 mt-2"
                          : "grid-rows-[0fr] opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bubble animations for Science SVG */}
      <style>{`
        @keyframes riseBubble1 {
          0% { transform: translateY(10px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-25px); opacity: 0; }
        }
        @keyframes riseBubble2 {
          0% { transform: translateY(8px); opacity: 0; }
          40% { opacity: 0.6; }
          100% { transform: translateY(-30px); opacity: 0; }
        }
        .animate-bubble-1 {
          animation: riseBubble1 2s infinite ease-in-out;
        }
        .animate-bubble-2 {
          animation: riseBubble2 2.5s infinite ease-in-out 0.6s;
        }
      `}</style>
    </section>
  );
}
