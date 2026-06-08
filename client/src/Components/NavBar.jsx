import { useEffect, useState } from "react";
import NavHome from "./NavHome";
import NavMain from "./NavMain";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = window.location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isHomePage) {
    return <NavMain />;
  }

  return (
    <>
      <div
        className={`
          absolute left-0 top-0 z-50 w-full
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "-translate-y-8 opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }
        `}
      >
        <NavHome />
      </div>

      <div
        className={`
          fixed left-0 top-0 z-[60] w-full
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }
        `}
      >
        <NavMain />
      </div>
    </>
  );
};

export default Navbar;