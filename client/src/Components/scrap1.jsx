import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { colours, fonts } from "../theme/theme.js";

const LINKS = [
  { label: "Ritual",      href: "/ritual"      },
  { label: "Science",     href: "/science"     },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Collection",  href: "/collection"  },
];

const SCOPED_CSS = `
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
    background: ${colours.hover} !important;
    color: ${colours.text} !important;
    border-color: ${colours.hover} !important;
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
  fontFamily: fonts.primary,
  fontSize: "0.8rem",
  fontWeight: 500,
  letterSpacing: "0.18em",
};

export default function NavBar() {
  const { user, isAdmin } = useAuth();
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = window.location.pathname === "/";
  const navActive  = !isHomePage || scrolled;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  const navStyle = {
    background:           navActive ? `rgba(247, 243, 238, 0.88)` : "transparent",
    backdropFilter:       navActive ? "blur(16px) saturate(200%)" : "none",
    WebkitBackdropFilter: navActive ? "blur(16px) saturate(200%)" : "none",
    border:               navActive ? `1px solid rgba(47, 47, 47, 0.15)` : "1px solid transparent",
    boxShadow:            navActive ? "0 4px 24px rgba(40,40,40,0.06), inset 0 1px 0 rgba(255,255,255,0.4)" : "none",
    borderRadius: "0",
    transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease, backdrop-filter 0.45s ease",
  };

  return (
    <>
      <style>{SCOPED_CSS}</style>

      <nav
        style={{ fontFamily: fonts.secondary, ...navStyle }}
        className="fixed top-0 left-0 right-0 h-[72px] z-[200] flex items-center justify-between px-10 box-border"
      >
        {/* Logo */}
        <a
          href="/"
          aria-hidden={!scrolled}
          tabIndex={scrolled ? 0 : -1}
          style={{
            fontFamily: fonts.secondary,
            color: colours.text,
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? "translateY(0)" : "translateY(-12px)",
            pointerEvents: scrolled ? "auto" : "none",
            transition: "opacity 0.45s ease, transform 0.45s ease, color 0.45s ease",
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
              <a
                href={href}
                className="nav-link-underline no-underline uppercase transition-colors duration-[450ms] ease-linear"
                style={{
                  ...NAV_LINK_STYLE,
                  color: navActive ? colours.text : colours.background,
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-6 m-0 p-0" style={{ marginRight: "1rem" }}>
          {/* Cart */}
          <a
            href="/cart"
            aria-label="Cart"
            style={{ color: navActive ? colours.text : colours.background, transition: `opacity ${EASE}, color 0.45s ease` }}
            className="no-underline flex items-center relative hover:opacity-50 max-md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span
              style={{
                fontFamily: fonts.primary,
                background: navActive ? colours.text : colours.background,
                color:      navActive ? colours.background : colours.text,
                transition: "background 0.45s ease, color 0.45s ease",
                fontSize: "0.6rem",
              }}
              className="absolute -top-0.5 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            >
              0
            </span>
          </a>

          {/* Join / Dashboard / Admin */}
          <a
            href={user ? (isAdmin ? "/admin/collection" : "/dashboard") : "/login"}
            style={{
              fontFamily: fonts.primary,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              borderRadius: "4px",
              background:   navActive ? colours.text : "transparent",
              color:        colours.background,
              border:       navActive ? `1px solid ${colours.text}` : `1px solid ${colours.background}`,
              transition: `background ${EASE}, color ${EASE}, border-color 0.45s ease`,
            }}
            className="join-btn uppercase no-underline px-[1.1rem] py-2 font-medium max-md:hidden"
          >
            {user ? (isAdmin ? "Admin Panel" : "Dashboard") : "Join"}
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
                  background: navActive ? colours.text : colours.background,
                  transition: `transform ${EASE}, opacity ${EASE}, background 0.45s ease`,
                  transform,
                }}
                className="block w-full h-px"
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        style={{
          opacity:       open ? 1 : 0,
          transform:     open ? "none" : "translateY(-8px)",
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          background: colours.primary,
        }}
        className="fixed top-[72px] left-0 right-0 bottom-0 z-[190] flex flex-col justify-center px-10 py-12"
      >
        <ul className="list-none m-0 p-0">
          {LINKS.map(({ label, href }, i) => (
            <li key={label} style={{ "--i": i }} className={`drawer-item${open ? " open" : ""}`}>
              <a
                href={href}
                onClick={close}
                style={{ fontFamily: fonts.secondary, fontSize: "2.6rem", color: colours.text, transition: "color 0.3s" }}
                className={`no-underline font-light hover:text-[${colours.accent}]`}
              >
                {label}
              </a>
            </li>
          ))}
          <li style={{ "--i": LINKS.length }} className={`drawer-item${open ? " open" : ""}`}>
            <a
              href={user ? (isAdmin ? "/admin/collection" : "/dashboard") : "/login"}
              onClick={close}
              style={{ fontFamily: fonts.secondary, fontSize: "2.6rem", color: colours.accent, transition: "color 0.3s" }}
              className={`no-underline font-light hover:text-[${colours.text}]`}
            >
              {user ? (isAdmin ? "Admin Panel" : "Dashboard") : "Join"}
            </a>
          </li>
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