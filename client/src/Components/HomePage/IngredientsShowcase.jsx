import { useState } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../../theme/theme";

const INGREDIENTS = [
  {
    name: "Rosemary Leaf",
    scientific: "Rosmarinus Officinalis",
    role: "Follicle Stimulation",
    benefit: "Scalp Microcirculation",
    details:
      "Rosemary leaf extracts naturally stimulate scalp microcirculation, bringing critical oxygen and nutrients directly to hair roots. It acts as a bio-active DHT blocker, slowing follicle shrinkage and encouraging density.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#A77C6B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M50 85 V15" strokeLinecap="round" />
        <path d="M50 70 C35 60 30 50 32 45 C34 40 45 50 50 60" />
        <path d="M50 70 C65 60 70 50 68 45 C66 40 55 50 50 60" />
        <path d="M50 50 C35 40 30 30 32 25 C34 20 45 30 50 40" />
        <path d="M50 50 C65 40 70 30 68 25 C66 20 55 30 50 40" />
        <path d="M50 30 C40 22 35 12 37 8 C39 4 48 15 50 22" />
        <path d="M50 30 C60 22 65 12 63 8 C61 4 52 15 50 22" />
      </svg>
    ),
  },
  {
    name: "Bhringraj Herb",
    scientific: "Eclipta Prostrata",
    role: "Root Invigoration",
    benefit: "Ayurvedic Revitalizer",
    details:
      "Commonly revered as the 'King of Hair' in Ayurveda, Bhringraj invigorates sleeping follicles, helping extend the active hair growth cycle (anagen phase). It targets roots to boost pigment synthesis and delay premature greying.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#A77C6B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M50 90 V20" strokeLinecap="round" />
        <path d="M50 75 Q30 70 35 55 T50 60" />
        <path d="M50 60 Q70 55 65 40 T50 45" />
        <path d="M50 45 Q30 40 35 25 T50 30" />
        {/* Minimal flower head */}
        <circle cx="50" cy="20" r="6" />
        <circle cx="50" cy="8" r="3" />
        <circle cx="38" cy="20" r="3" />
        <circle cx="62" cy="20" r="3" />
        <circle cx="50" cy="32" r="3" />
      </svg>
    ),
  },
  {
    name: "Cold-Pressed Castor",
    scientific: "Ricinus Communis",
    role: "Strand Fortification",
    benefit: "Ricinoleic Acid Shield",
    details:
      "Rich in ricinoleic acid and essential omega-6 fatty acids, cold-pressed castor oil coats individual strands to lock in moisture, smoothing cuticles. It fortifies the hair shaft to prevent styling-induced splitting.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#A77C6B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Seed outline */}
        <path d="M50 15 C20 40 20 70 50 85 C80 70 80 40 50 15 Z" />
        {/* Organic internal segments */}
        <path d="M50 15 V85" strokeDasharray="3 3" />
        <path d="M35 45 C35 45 42 50 50 50 C58 50 65 45 65 45" />
        <path d="M32 65 C32 65 42 70 50 70 C58 70 68 65 68 65" />
      </svg>
    ),
  },
  {
    name: "Hibiscus Petals",
    scientific: "Hibiscus Rosa-Sinensis",
    role: "Keratin Synthesis",
    benefit: "Amino Acid Complex",
    details:
      "Naturally abundant in amino acids and vitamin C, Hibiscus acts as a structural booster. It stimulates keratin production within the cells, reinforcing damaged ends and restoring natural hair elasticity.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#A77C6B]" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* 5 Petal outline */}
        <circle cx="50" cy="50" r="6" />
        <path d="M50 44 C40 20 60 20 50 44 Z" />
        <path d="M56 50 C80 40 80 60 56 50 Z" />
        <path d="M50 56 C60 80 40 80 50 56 Z" />
        <path d="M44 50 C20 60 20 40 44 50 Z" />
        {/* Pistil extension */}
        <path d="M50 50 L68 32" strokeWidth="2" />
        <circle cx="68" cy="32" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export default function IngredientsShowcase() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="py-24 bg-[#171715] w-full relative overflow-hidden">
      {/* Background visual touches */}
      <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-[#A77C6B]/[0.015] blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 rounded-full bg-[#bfd8bd]/[0.015] blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">
        
        {/* Heading */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-6 bg-[#A77C6B]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A77C6B]">
              Active Ingredients Library
            </p>
            <span className="h-px w-6 bg-[#A77C6B]" />
          </div>
          <h2
            className="text-3xl md:text-5xl font-normal tracking-[-0.035em] text-[#F7F3EC]"
            style={{ fontFamily: fonts.primary }}
          >
            The Botanical Alchemy
          </h2>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            We isolate raw, potent botanical agents and integrate them without modification. Discover the bioactive herbs that form our therapeutic core.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INGREDIENTS.map((item, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative flex flex-col p-8 border rounded-md transition-all duration-500 ease-out cursor-default ${
                  isHovered
                    ? "bg-[#21211e] border-[#A77C6B]/40 shadow-[0_15px_35px_rgba(0,0,0,0.3)] translate-y-[-4px]"
                    : "bg-transparent border-white/[0.04]"
                }`}
              >
                {/* SVG Icon Container */}
                <div
                  className={`w-20 h-20 rounded-sm flex items-center justify-center mb-6 transition-all duration-500 ${
                    isHovered ? "bg-[#A77C6B]/10 scale-105" : "bg-white/[0.02]"
                  }`}
                >
                  {item.svg}
                </div>

                {/* Subtitle / Role */}
                <span className={`text-[9px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 mb-1 ${
                  isHovered ? "text-[#A77C6B]" : "text-gray-500"
                }`}>
                  {item.role}
                </span>

                {/* Name */}
                <h3 className="text-xl font-semibold text-white mb-0.5" style={{ fontFamily: fonts.primary }}>
                  {item.name}
                </h3>

                {/* Scientific Name */}
                <span className="text-xs italic text-gray-400 mb-4 block font-serif">
                  {item.scientific}
                </span>

                {/* Divider */}
                <div className={`w-8 h-px bg-white/10 mb-4 transition-all duration-500 ${
                  isHovered ? "w-16 bg-[#A77C6B]/50" : ""
                }`} />

                {/* Benefit Tagline */}
                <span className="text-xs font-semibold text-gray-300 mb-2 block">
                  {item.benefit}
                </span>

                {/* Details text block */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.details}
                </p>

              </div>
            );
          })}
        </div>

        {/* Footer CTAs */}
        <div className="mt-16 text-center">
          <Link
            to="/ingredients"
            className="group inline-flex items-center gap-6 px-8 py-4 bg-[#A77C6B] text-[#171715] font-bold tracking-widest text-xs uppercase rounded-sm hover:bg-[#F7F3EC] transition-all duration-300 shadow-lg"
          >
            Explore Full Ingredients Glossary
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
