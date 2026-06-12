import { ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../../theme/theme";
import stockHero from "../../assets/stock/stock5.jpg"; // premium quality stock image
import hairOilImg from "../../assets/etlawm-hair-oil.png"; // bottle image

export default function HeroBanner2() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate cursor position relative to container
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col lg:flex-row bg-[#171715] overflow-hidden"
      style={{ fontFamily: fonts.secondary }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Dynamic Interactive Spotlight Background Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(167, 124, 107, 0.15), transparent 70%)`,
        }}
      />

      {/* Decorative ambient lines */}
      <div className="absolute top-0 bottom-0 left-[8%] w-px bg-white/[0.03] pointer-events-none z-0 hidden lg:block" />
      <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/[0.03] pointer-events-none z-0 hidden lg:block" />

      {/* LEFT COLUMN: Editorial Brand Text & Actions */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-6 pt-24 pb-12 sm:px-12 sm:pt-28 lg:px-20 lg:py-12 xl:px-24">
        {/* Animated Badge */}
        <div className="mb-6 flex items-center gap-3 animate-fade-in opacity-0" style={{ animation: "fadeInUp 0.8s ease forwards" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#A77C6B] animate-ping" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A77C6B] font-semibold">
            Pure Botanical Poetry
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-normal leading-[1.05] text-[#F7F3EC] tracking-[-0.03em] max-w-2xl mb-8"
          style={{ fontFamily: fonts.primary, animation: "fadeInUp 1s ease 0.15s forwards" }}
        >
          Formulas <br className="hidden sm:inline" />
          <span className="italic text-[#A77C6B]">Rooted in Reverence</span>
          <br />
          For Your Scalp.
        </h1>

        {/* Narrative description */}
        <p
          className="text-sm md:text-base text-gray-400 max-w-lg leading-relaxed mb-10"
          style={{ animation: "fadeInUp 1s ease 0.3s forwards" }}
        >
          We curate raw, premium active botanicals and refine them through rigorous herbal laboratory science. Zero fillers, zero shortcuts — just the pure strength of nature working in harmony with your biology.
        </p>

        {/* Interactive CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5"
          style={{ animation: "fadeInUp 1s ease 0.45s forwards" }}
        >
          <Link
            to="/collection"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-[#A77C6B] text-[#171715] font-semibold tracking-wider text-xs uppercase rounded-sm overflow-hidden transition-all duration-300 hover:bg-[#F7F3EC] hover:text-[#171715]"
          >
            {/* Slide up background */}
            <span className="absolute inset-0 bg-[#F7F3EC] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0" />
            <span className="relative z-10 flex items-center gap-2">
              <span>
                Shop The Ritual
              </span>
              <ArrowRight
                size={11}
                strokeWidth={1.1}
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>

          <Link
            to="/ritual"
            className="group flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/40 text-[#F7F3EC] font-semibold tracking-wider text-xs uppercase rounded-sm transition-all duration-300"
          >
            <span>
              Find Your Ritual
            </span>
            <ArrowRight
              size={11}
              strokeWidth={1.1}
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Interactive Floating Credentials widget (visible on lg screens, anchored to bottom-left) */}
        <div 
          className="hidden lg:flex items-center gap-8 mt-16 pt-8 border-t border-white/5"
          style={{ animation: "fadeInUp 1.2s ease 0.6s forwards" }}
        >
          <div>
            <p className="text-[20px] font-semibold text-[#A77C6B] leading-none" style={{ fontFamily: fonts.primary }}>100%</p>
            <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-1">Active Botanicals</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-[20px] font-semibold text-[#A77C6B] leading-none" style={{ fontFamily: fonts.primary }}>Zero</p>
            <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-1">Synthetic Fillers</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-[20px] font-semibold text-[#A77C6B] leading-none" style={{ fontFamily: fonts.primary }}>Sustain</p>
            <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-1">Wildharvested</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Full-Bleed Media Frame with Floating Cards */}
      <div className="relative flex-1 min-h-[450px] lg:min-h-screen overflow-hidden group/media">
        {/* Immersive Image with zoom effect on mount and hover */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={stockHero}
            alt="Botanical wild herbs background"
            className="w-full h-full object-cover transition-transform duration-[6s] ease-out scale-[1.06] group-hover/media:scale-100 filter brightness-90 saturate-[0.8]"
          />
          {/* Subtle gradient overlay to tie image to the left text container */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#171715] via-[#171715]/40 to-transparent lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171715] via-transparent to-transparent lg:hidden block" />
        </div>

        {/* Floating Interactive Product Showcase Card */}
        <div 
          className="absolute right-6 bottom-6 md:right-10 md:bottom-10 z-10 max-w-[280px] bg-[#171715]/80 backdrop-blur-md border border-white/10 p-5 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-[#A77C6B]/40 hover:-translate-y-1"
          style={{ animation: "fadeInUp 1.2s ease 0.8s forwards" }}
        >
          <div className="flex gap-4 items-center mb-3">
            <img 
              src={hairOilImg} 
              alt="Hair Oil" 
              className="w-12 h-12 object-contain bg-white/5 rounded-sm p-1 transition-transform duration-500 hover:rotate-6"
            />
            <div>
              <p className="text-[10px] text-[#A77C6B] uppercase tracking-[0.2em]">Featured Ritual</p>
              <h4 className="text-white text-sm font-semibold tracking-wide" style={{ fontFamily: fonts.primary }}>Root Stimulating Oil</h4>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-normal mb-3">
            A concentrated blend of cold-pressed castor, cold-brewed bhringraj, and rosemary leaf extracts.
          </p>
          <Link 
            to="/product/root-ritual-hair-oil" 
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#A77C6B] hover:text-white transition-colors"
          >
            Explore Bottle
            <span>→</span>
          </Link>
        </div>

        
      </div>

      

      {/* Inline styles for custom keyframe animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }
          50%, 100% {
            transform: translateY(200%);
          }
        }
        .animate-scroll-line {
          animation: scrollLine 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
      `}</style>
    </section>
  );
}
