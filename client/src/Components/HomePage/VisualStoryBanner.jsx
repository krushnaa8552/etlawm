import { useState } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../../theme/theme";

const STEPS = [
  {
    step: "Step 01",
    phase: "Wildharvesting",
    tagline: "Manipur Botanical Fields",
    description:
      "We source wild bhringraj and hand-picked rosemary directly from organic forest borders in Northeast India. Harvested during solar peak times to ensure plants contain maximum nutrient density.",
    svg: (isActive) => (
      <svg viewBox="0 0 100 100" className={`w-16 h-16 transition-all duration-500 ${isActive ? "text-[#A77C6B]" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Landscape mountains/sun */}
        <circle cx="50" cy="35" r="10" strokeDasharray={isActive ? "none" : "2 2"} className="transition-all" />
        <path d="M15 75 L35 55 L55 70 L85 45 L95 55" />
        <path d="M5 85 L95 85" strokeWidth="2" />
        {/* Little plant sprigs */}
        <path d="M25 85 V80" />
        <path d="M50 85 V78" />
        <path d="M75 85 V82" />
      </svg>
    ),
  },
  {
    step: "Step 02",
    phase: "Cold Extraction",
    tagline: "Low-Temperature Oil Press",
    description:
      "Seeds and leaves are pressed using slow stone grinders at temperatures never exceeding 38°C. This meticulous extraction preserves delicate proteins, vitamins, and antioxidants that heat ordinarily destroys.",
    svg: (isActive) => (
      <svg viewBox="0 0 100 100" className={`w-16 h-16 transition-all duration-500 ${isActive ? "text-[#A77C6B]" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Press gears/gears */}
        <circle cx="50" cy="45" r="18" strokeDasharray={isActive ? "none" : "3 3"} className={`transition-all ${isActive ? "stroke-[2]" : ""}`} />
        <line x1="50" y1="20" x2="50" y2="70" />
        {/* Droplets sliding down */}
        <path
          d="M50 72 C50 72 44 76 44 82 C44 86 47 88 50 88 C53 88 56 86 56 82 C56 76 50 72 50 72 Z"
          fill={isActive ? "#A77C6B" : "none"}
          className="transition-all duration-700"
        />
      </svg>
    ),
  },
  {
    step: "Step 03",
    phase: "Solar Infusion",
    tagline: "21-Day Slow Solar Brew",
    description:
      "We transfer active oils into massive copper urns and solar-infuse them outdoors for 21 full solar cycles. The natural cosmic heat brews active properties, ensuring molecules fuse fully before bottling.",
    svg: (isActive) => (
      <svg viewBox="0 0 100 100" className={`w-16 h-16 transition-all duration-500 ${isActive ? "text-[#A77C6B]" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Sun radiating into a copper jar */}
        <circle cx="50" cy="22" r="10" className={isActive ? "fill-[#A77C6B]/10" : ""} />
        <path d="M50 8 L50 2" />
        <path d="M64 14 L68 10" />
        <path d="M64 30 L69 34" />
        {/* Copper jar outline */}
        <path d="M35 50 H65 V85 H35 Z" strokeWidth="2" />
        <path d="M40 50 V44 H60 V50" />
        {/* Liquid line */}
        <path d="M36 72 Q50 68 64 72" className={isActive ? "stroke-[#A77C6B] stroke-[2]" : ""} />
      </svg>
    ),
  },
];

export default function VisualStoryBanner() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-[#171715] w-full relative overflow-hidden border-t border-white/[0.03]">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">
        
        {/* Title Block */}
        <div className="mb-20 text-center md:text-left">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[#A77C6B]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A77C6B]">
              The Sourcing Ritual
            </p>
          </div>
          <h2
            className="text-3xl md:text-5xl font-normal tracking-[-0.035em] text-[#F7F3EC]"
            style={{ fontFamily: fonts.primary }}
          >
            Sown in Manipur. <br className="md:hidden" /> Brewed by Hand.
          </h2>
        </div>

        {/* Dynamic Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Process Navigator (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {STEPS.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`flex items-center gap-6 p-6 rounded-md border text-left transition-all duration-500 select-none ${
                    isActive
                      ? "bg-[#21211e] border-[#A77C6B]/40 shadow-lg translate-x-1"
                      : "bg-transparent border-white/[0.02] hover:border-white/5 hover:bg-white/[0.01]"
                  }`}
                >
                  <span
                    className={`text-xs font-bold font-mono tracking-wider ${
                      isActive ? "text-[#A77C6B]" : "text-gray-600"
                    }`}
                  >
                    {s.step}
                  </span>
                  <div>
                    <h4
                      className={`text-md font-semibold tracking-wide transition-colors duration-300 ${
                        isActive ? "text-[#F7F3EC]" : "text-gray-400"
                      }`}
                    >
                      {s.phase}
                    </h4>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mt-0.5">
                      {s.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center: Visual Representation (col-span-3) */}
          <div className="lg:col-span-3 flex items-center justify-center bg-[#21211e] border border-white/[0.04] p-12 rounded-md h-72">
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full border border-[#A77C6B]/20 bg-[#171715]">
              <div className="absolute inset-0 w-full h-full rounded-full border border-dashed border-[#A77C6B]/10 animate-spin-slow" />
              {STEPS[activeStep].svg(true)}
            </div>
          </div>

          {/* Right: Narrative Detail (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start bg-[#21211e]/40 border border-white/[0.03] p-8 rounded-md min-h-[260px] justify-center">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A77C6B] font-bold mb-3">
              The Botanical Journey
            </span>
            <h3
              className="text-2xl font-normal text-white mb-4 leading-snug"
              style={{ fontFamily: fonts.primary }}
            >
              {STEPS[activeStep].phase}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {STEPS[activeStep].description}
            </p>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
