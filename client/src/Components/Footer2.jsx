import { useState } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../theme/theme.js";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform duration-300 group-hover:scale-110">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:scale-110">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:scale-110">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#A77C6B]">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.18 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#A77C6B]">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#A77C6B]">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function Footer2() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const shopLinks = [
    { label: "All Products", path: "/collection" },
    { label: "Best Sellers", path: "/collection/best-sellers" },
    { label: "New Arrivals", path: "/collection/new" },
  ];

  const companyLinks = [
    { label: "Our Story", path: "/ritual" },
    { label: "The Science", path: "/ingredients" },
    { label: "The Ritual", path: "/ritual" },
  ];

  const supportLinks = [
    { label: "My Account", path: "/dashboard" },
    { label: "Track Order", path: "/dashboard" },
    { label: "FAQs", path: "/ritual" },
  ];

  return (
    <footer
      className="bg-[#0b0b0a] text-[#F7F3EC] relative overflow-hidden pt-20"
      style={{ fontFamily: fonts.secondary }}
    >
      {/* Immersive background decoration */}
      <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#A77C6B]/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-[#bfd8bd]/[0.01] blur-3xl pointer-events-none" />

      {/* Main Top Grid */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Column 1: Brand details (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link
              to="/"
              className="text-3xl font-bold tracking-widest mb-2"
              style={{ fontFamily: fonts.logo }}
            >
              ETLAWM.
            </Link>
            <span className="text-[9px] tracking-[0.4em] text-[#A77C6B] uppercase font-bold mb-6">
              Herbal Rituals & Science
            </span>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Pure botanical formulas crafted with traditional herbal wisdom and modern laboratory science. Designed to nourish your scalp and elevate your hair care ritual.
            </p>
          </div>

          {/* Column 2: Interactive Newsletter (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start bg-white/[0.02] border border-white/[0.04] p-6 rounded-md w-full">
            <span className="text-[10px] tracking-[0.25em] text-[#A77C6B] uppercase font-bold mb-2">
              Stay in the Ritual
            </span>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Subscribe to unlock botanical secrets, early launches, and ancient ritual wisdom directly to your inbox.
            </p>

            {subscribed ? (
              <div className="w-full py-4 px-4 bg-[#A77C6B]/10 border border-[#A77C6B]/30 rounded-sm text-center animate-fade-in">
                <p className="text-xs text-[#A77C6B] font-semibold tracking-wide">
                  Welcome to the Ritual. Check your inbox soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-[#171715] border border-white/10 rounded-sm px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#A77C6B] focus:ring-1 focus:ring-[#A77C6B] transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-[#A77C6B] text-[#171715] hover:bg-[#F7F3EC] transition-colors duration-300 rounded-sm"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Column 3: Mini-Quiz interactive Callout (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start bg-[#171715]/40 border border-[#A77C6B]/10 p-6 rounded-md w-full relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-24 h-24 rounded-full bg-[#A77C6B]/5 blur-xl group-hover:bg-[#A77C6B]/10 transition-colors duration-500" />
            <span className="text-[10px] tracking-[0.25em] text-[#bfd8bd] uppercase font-bold mb-2">
              Scalp Analysis Quiz
            </span>
            <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: fonts.primary }}>
              Confused about your hair needs?
            </h4>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Take our 2-minute Hair & Scalp Analysis to discover your customized botanical ritual bottle.
            </p>
            <Link
              to="/ritual"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#A77C6B] hover:text-[#F7F3EC] transition-colors duration-300 group"
            >
              Start Scalp Quiz
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Grid Border Divider */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-white/[0.05]" />
      </div>

      {/* Link Lists Grid */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Shop */}
          <div>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold mb-4 block">
              Shop
            </span>
            <ul className="space-y-2.5">
              {shopLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-xs text-gray-400 hover:text-white transition-colors relative group py-1 inline-block"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#A77C6B] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold mb-4 block">
              Company
            </span>
            <ul className="space-y-2.5">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-xs text-gray-400 hover:text-white transition-colors relative group py-1 inline-block"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#A77C6B] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold mb-4 block">
              Support
            </span>
            <ul className="space-y-2.5">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-xs text-gray-400 hover:text-white transition-colors relative group py-1 inline-block"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#A77C6B] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold mb-4 block">
              Contact
            </span>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="tel:+916239551893"
                  className="flex items-center gap-3 text-xs text-gray-400 hover:text-[#A77C6B] transition-colors"
                >
                  <PhoneIcon />
                  <span>+91 62395 51893</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@etlawm.com"
                  className="flex items-center gap-3 text-xs text-gray-400 hover:text-[#A77C6B] transition-colors"
                >
                  <MailIcon />
                  <span>info@etlawm.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <LocationIcon />
                  <span>Manipur, India</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Decorative Branding Text: Outlined "ETLAWM" backdrop */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none py-4 border-t border-white/[0.02] bg-black/10">
        <h3
          className="text-center font-extrabold uppercase leading-none tracking-[0.12em]"
          style={{
            fontFamily: fonts.logo,
            fontSize: "11vw",
            color: "transparent",
            WebkitTextStroke: "1px rgba(247, 243, 238, 0.05)",
          }}
        >
          ETLAWM
        </h3>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="bg-[#070707] py-6 border-t border-white/[0.03]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: <InstagramIcon />, href: "#" },
              { icon: <FacebookIcon />, href: "#" },
              { icon: <TwitterIcon />, href: "#" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="group w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#A77C6B]/40 hover:bg-[#A77C6B]/5 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright + Policy links */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 flex-wrap justify-center md:justify-end">
            <span>© 2026 ETLAWM. All rights reserved.</span>
            <span className="mx-1">•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span className="mx-1">•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Use</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
