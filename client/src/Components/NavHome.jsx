import { colours, fonts } from "../theme/theme";

const NavHome = () => {
  const navLinks = ["Ritual", "Science", "Ingredients", "Collection"];
  
  return (
    <div>
      <header
        className="w-full bg-transparent"
      >
        <nav className="mx-auto flex h-60 w-full items-start justify-between px-12 py-8">
          <a
            href="/"
            className="text-3xl tracking-[-0.04em] text-[#d8d0d2]"
            style={{
              fontFamily: fonts.logo,
            }}
          >
            ETLAWM
          </a>

          <ul className="flex flex-col gap-5 text-right text-md uppercase tracking-[-0.03em]">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`${link.toLowerCase()}`}
                  className="text-[#d8d0d2] transition-colors duration-200 hover:text-white relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
                  style={{
                    fontFamily: fonts.primary,
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default NavHome;