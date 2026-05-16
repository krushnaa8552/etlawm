import { useState, useEffect, useRef } from "react";

const LINKS = [
  { label: "Ritual",      href: "/ritual"      },
  { label: "Science",     href: "/science"     },
  { label: "Ingredients", href: "/ingredients" },
];

const COLLECTION_ITEMS = [
  { label: "Hair Care"  },
  { label: "Skin Care"  },
  { label: "Hair Masks" },
];

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

  :root {
    --warm-white: #FAF8F4;
    --bark: #9C8B77;
    --ink: #1E1C18;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Josefin Sans', sans-serif;
  }

  .nav-link-underline {
    position: relative;
    padding-bottom: 2px;
  }
  .nav-link-underline::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 1px;
    background: currentColor;
    transition: width 0.2s linear;
  }
  .nav-link-underline:hover::after { width: 100%; }

  .join-btn:hover {
    background: #ffffff !important;
    color: var(--ink) !important;
    border-color: #ffffff !important;
  }

  .drawer-item {
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity  0.4s ease calc(var(--i) * 0.07s),
      transform 0.4s ease calc(var(--i) * 0.07s);
  }
  .drawer-item.open { opacity: 1; transform: none; }
`;

const EASE = "0.4s cubic-bezier(0.25, 0.5, 0.25, 1)";

const NAV_LINK_STYLE = {
  fontFamily: "var(--serif)",
  fontSize: "0.8rem",
  fontWeight: 500,
  letterSpacing: "0.18em",
};

export default function NavBar() {
  const [open,           setOpen]           = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const leaveTimer = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  const handleCollectionEnter = () => { clearTimeout(leaveTimer.current); setCollectionOpen(true); };
  const handleCollectionLeave = () => { leaveTimer.current = setTimeout(() => setCollectionOpen(false), 120); };

  const linkColor = scrolled ? "text-[var(--ink)]" : "text-[var(--warm-white)]";

  const navStyle = {
    background:          scrolled ? "rgba(250, 248, 244, 0.82)" : "transparent",
    backdropFilter:      scrolled ? "blur(16px) saturate(200%)" : "none",
    WebkitBackdropFilter:scrolled ? "blur(16px) saturate(200%)" : "none",
    border:              scrolled ? "1px solid rgba(47, 47, 47, 0.15)" : "1px solid transparent",
    boxShadow:           scrolled ? "0 4px 24px rgba(40,40,40,0.06), inset 0 1px 0 rgba(255,255,255,0.4)" : "none",
    borderRadius: "999px",
    transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease, backdrop-filter 0.45s ease",
  };

  return (
    <>
      <style>{SCOPED_CSS}</style>

      <nav
        style={{ fontFamily: "var(--sans)", ...navStyle }}
        className="fixed top-[10px] left-[20px] right-[20px] h-[72px] z-[200] flex items-center justify-between px-10 box-border"
      >
        {/* Logo */}
        <a
          href="/"
          aria-hidden={!scrolled}
          tabIndex={scrolled ? 0 : -1}
          style={{
            fontFamily: "var(--sans)",
            color: "var(--ink)",
            opacity:   scrolled ? 1 : 0,
            transform: scrolled ? "translateX(0)" : "translateX(-12px)",
            pointerEvents: scrolled ? "auto" : "none",
            transition: "opacity 0.45s ease, transform 0.45s ease",
            fontSize: "1.6rem",
            letterSpacing: "0.45em",
            marginLeft: "1rem",
          }}
          className="uppercase no-underline whitespace-nowrap hover:opacity-75"
        >
          ETLAWM
        </a>

        {/* Centre nav links */}
        <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 list-none m-0 p-0 max-md:hidden">
          {LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className={`nav-link-underline no-underline uppercase transition-colors duration-[450ms] ease-linear ${linkColor}`} style={NAV_LINK_STYLE}>
                {label}
              </a>
            </li>
          ))}
          <li onMouseEnter={handleCollectionEnter} onMouseLeave={handleCollectionLeave}>
            <a
              href="/shop"
              onClick={e => e.preventDefault()}
              className={`nav-link-underline no-underline uppercase transition-colors duration-[450ms] ease-linear ${linkColor}`}
              style={NAV_LINK_STYLE}
            >
              Collection
            </a>
          </li>
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-6 m-0 p-0" style={{ marginRight: "1rem" }}>
          {/* Cart */}
          <a
            href="/cart"
            aria-label="Cart"
            style={{ color: scrolled ? "var(--ink)" : "var(--warm-white)", transition: `opacity ${EASE}, color 0.45s ease` }}
            className="no-underline flex items-center relative hover:opacity-50 max-md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span
              style={{
                fontFamily: "var(--serif)",
                background: scrolled ? "var(--ink)" : "var(--warm-white)",
                color:      scrolled ? "var(--warm-white)" : "var(--ink)",
                transition: "background 0.45s ease, color 0.45s ease",
                fontSize: "0.6rem",
              }}
              className="absolute -top-0.5 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            >
              0
            </span>
          </a>

          {/* Join */}
          <a
            href="/login"
            style={{
              fontFamily: "var(--serif)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              borderRadius: "999px",
              background:   scrolled ? "var(--ink)" : "transparent",
              color:        scrolled ? "var(--warm-white)" : "var(--warm-white)",
              border:       scrolled ? "1px solid var(--ink)" : "1px solid rgba(250,248,244,0.55)",
              transition: `background ${EASE}, color ${EASE}, border-color 0.45s ease`,
            }}
            className="join-btn uppercase no-underline px-[1.1rem] py-2 font-medium max-md:hidden"
          >
            Join
          </a>

          {/* Burger */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
            className="hidden max-md:flex flex-col gap-1.5 bg-transparent border-none cursor-pointer w-7 p-0"
          >
            {[open ? "translateY(3.5px) rotate(45deg)" : "none", open ? "translateY(-3.5px) rotate(-45deg)" : "none"].map((transform, i) => (
              <span
                key={i}
                style={{
                  background: scrolled ? "var(--ink)" : "var(--warm-white)",
                  transition: `transform ${EASE}, opacity ${EASE}, background 0.45s ease`,
                  transform,
                }}
                className="block w-full h-px"
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mega-menu */}
      <div
        onMouseEnter={handleCollectionEnter}
        onMouseLeave={handleCollectionLeave}
        style={{
          background: "rgba(250, 248, 244, 0.75)",
          backdropFilter: "blur(16px) saturate(200%)",
          WebkitBackdropFilter: "blur(16px) saturate(200%)",
          borderBottom: "1px solid rgba(47,47,47,0.2)",
          boxShadow: "0 12px 40px rgba(40,40,40,0.08)",
          opacity:       collectionOpen ? 1 : 0,
          transform:     collectionOpen ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: collectionOpen ? "all" : "none",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
        className="fixed top-[72px] left-0 w-full z-[195]"
      >
        <div className="flex justify-center px-12 py-8 gap-6">
          {COLLECTION_ITEMS.map(({ label }) => (
            <a
              key={label}
              href="/shop"
              style={{ border: "1px solid rgba(156,139,119,0.2)", color: "var(--ink)", transition: "background 0.35s ease, border-color 0.35s ease" }}
              className="w-[22%] flex-none aspect-square bg-white flex flex-col items-center justify-center no-underline gap-2 hover:bg-[#f5efe6] hover:border-[rgba(156,139,119,0.45)]"
            >
              <span style={{ fontFamily: "var(--serif)", letterSpacing: "0.12em" }} className="text-base font-normal uppercase">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        style={{
          opacity:       open ? 1 : 0,
          transform:     open ? "none" : "translateY(-8px)",
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          background: "var(--warm-white)",
        }}
        className="fixed top-[72px] left-0 right-0 bottom-0 z-[190] flex flex-col justify-center px-10 py-12"
      >
        <ul className="list-none m-0 p-0">
          {LINKS.map(({ label, href }, i) => (
            <li key={label} style={{ "--i": i }} className={`drawer-item${open ? " open" : ""}`}>
              <a
                href={href}
                onClick={close}
                style={{ fontFamily: "var(--sans)", fontSize: "2.6rem", color: "var(--ink)", transition: "color 0.3s" }}
                className="no-underline font-light hover:text-[var(--bark)]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div
          onClick={close}
          style={{ background: "rgba(30,28,24,0.3)", backdropFilter: "blur(2px)" }}
          className="fixed inset-0 z-[180]"
        />
      )}
    </>
  );
}