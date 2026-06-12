import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/cartService";
import { colours, fonts } from "../theme/theme";

const menuLinks = [
  {
    label: "Ritual",
    href: "/ritual",
  },
  {
    label: "Science",
    href: "/science",
  },
  {
    label: "Ingredients",
    href: "/ingredients",
  },
  {
    label: "Collection",
    href: "/collection",
    panel: "collection",
  },
];

const secondaryLinks = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const collectionCards = [
  {
    title: "Skin Care",
    href: "/collection/skin-care",
    image: "/images/menu/skin-care.jpg",
  },
  {
    title: "Hair Care",
    href: "/collection/hair-care",
    image: "/images/menu/hair-care.jpg",
  },
  {
    title: "Best Sellers",
    href: "/collection/best-sellers",
    image: "/images/menu/best-sellers.jpg",
  },
  {
    title: "Complete Sets",
    href: "/collection/kits",
    image: "/images/menu/kits.jpg",
  },
];

const OpenMenu = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [activePanel, setActivePanel] = useState(null);

  const accountHref = user
    ? isAdmin
      ? "/admin/dashboard"
      : "/dashboard"
    : "/login";

  const accountLabel = user
    ? isAdmin
      ? "Admin panel"
      : "Dashboard"
    : "Join";

  useEffect(() => {
    if (!isOpen) {
      setActivePanel(null);
      return undefined;
    }

    const loadCartCount = async () => {
      try {
        const cart = await getCart();

        const totalQuantity = (cart?.items ?? []).reduce(
          (total, item) => total + Number(item.quantity || 0),
          0,
        );

        setCartCount(totalQuantity);
      } catch (error) {
        console.error("Unable to load cart count:", error);
        setCartCount(0);
      }
    };

    loadCartCount();

    window.addEventListener("cart-updated", loadCartCount);

    return () => {
      window.removeEventListener("cart-updated", loadCartCount);
    };
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    setActivePanel(null);
    onClose();
  };

  const togglePanel = (panelName) => {
    setActivePanel((currentPanel) =>
      currentPanel === panelName ? null : panelName,
    );
  };

  const isCollectionOpen = activePanel === "collection";

  return (
    <div
      className={`
        fixed inset-0 z-[200]
        transition-[visibility] duration-500
        ${isOpen ? "visible" : "invisible"}
      `}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={handleClose}
        className={`
          absolute inset-0 h-full w-full
          bg-black/35 backdrop-blur-[8px]
          transition-opacity duration-500
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          absolute left-2 top-2 bottom-2
          flex overflow-hidden rounded-lg bg-[#f4f1ea]
          shadow-[30px_0_70px_rgba(0,0,0,0.16)]
          transition-[width,transform] duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            isCollectionOpen
              ? "w-[calc(100%-1rem)] max-w-[980px]"
              : "w-[85vw] max-w-[430px]"
          }
          ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.5rem)]"}
        `}
      >
        <div className="flex h-full w-full">
          <div className="flex h-full w-full shrink-0 flex-col bg-[#f4f1ea] md:w-[390px]">
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-black/10 px-5 sm:px-8">
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close navigation menu"
                className="-ml-2 flex h-11 items-center gap-3 text-[#171717] transition-opacity duration-300 hover:opacity-55"
                style={{
                  fontFamily: fonts.primary,
                }}
              >
                <X size={23} strokeWidth={1.25} />
                <span className="text-sm">Close</span>
              </button>

              <Link
                to="/cart"
                onClick={handleClose}
                aria-label="Open cart"
                className="relative flex h-11 w-11 items-center justify-center text-[#171717] transition-opacity duration-300 hover:opacity-55"
              >
                <ShoppingBag size={21} strokeWidth={1.25} />

                {cartCount > 0 && (
                  <span
                    className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#171717] px-1 text-[10px] leading-none text-white"
                    style={{
                      fontFamily: fonts.secondary,
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-10 sm:px-10 sm:pt-12">
              <nav>
                <ul>
                  {menuLinks.map((item, index) => (
                    <li
                      key={item.href}
                      className={`
                        transition-all duration-500
                        ${
                          isOpen
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-5 opacity-0"
                        }
                      `}
                      style={{
                        transitionDelay: isOpen
                          ? `${120 + index * 65}ms`
                          : "0ms",
                      }}
                    >
                      {item.panel ? (
                        <button
                          type="button"
                          onClick={() => togglePanel(item.panel)}
                          className={`
                            group flex w-full items-center justify-between py-2 text-left
                            text-[29px] leading-none tracking-[-0.045em]
                            text-[#171717] transition-opacity duration-300 hover:opacity-55 sm:text-[36px]
                            ${isCollectionOpen ? "opacity-55" : "opacity-100"}
                          `}
                          style={{
                            fontFamily: fonts.primary,
                          }}
                        >
                          <span className="text-2xl">{item.label}</span>

                          <ArrowUpRight
                            size={21}
                            strokeWidth={1.1}
                            className={`
                              transition-all duration-300
                              ${
                                isCollectionOpen
                                  ? "translate-y-0 rotate-45 opacity-100"
                                  : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                              }
                            `}
                          />
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={handleClose}
                          className="group flex items-center justify-between py-2 text-[29px] leading-none tracking-[-0.045em] text-[#171717] transition-opacity duration-300 hover:opacity-55 sm:text-[36px]"
                          style={{
                            fontFamily: fonts.primary,
                          }}
                        >
                          <span className="text-2xl">{item.label}</span>

                          <ArrowUpRight
                            size={21}
                            strokeWidth={1.1}
                            className="translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                          />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto border-t border-black/10 pt-6">
                <Link
                  to={accountHref}
                  onClick={handleClose}
                  className="group flex items-center gap-4"
                  style={{
                    fontFamily: fonts.primary,
                  }}
                >
                  <button
                    type="button"
                    className="h-14 cursor-pointer px-5 text-xl duration-300 hover:opacity-75"
                    style={{
                      backgroundColor: colours.primary,
                      fontFamily: fonts.primary,
                    }}
                  >
                    {accountLabel}
                  </button>

                  <ArrowRight
                    size={21}
                    strokeWidth={1.1}
                    className="translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </Link>

                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {secondaryLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={handleClose}
                        className="text-[12px] uppercase tracking-[0.08em] text-black/55 transition-colors duration-300 hover:text-black"
                        style={{
                          fontFamily: fonts.primary,
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`
              hidden h-full overflow-hidden border-l border-black/10 bg-[#f7f4ee]
              transition-[width,opacity,transform,padding] duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)] md:block
              ${
                isCollectionOpen
                  ? "w-[590px] translate-x-0 p-2 opacity-100"
                  : "w-0 translate-x-8 p-0 opacity-0"
              }
            `}
          >
            <div className="grid h-full w-[590px] grid-cols-2 gap-2">
              {collectionCards.map((card, index) => (
                <Link
                  key={card.href}
                  to={card.href}
                  onClick={handleClose}
                  className={`
                    group relative overflow-hidden rounded-md bg-black
                    transition-all duration-500
                    ${
                      isCollectionOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-6 opacity-0"
                    }
                  `}
                  style={{
                    transitionDelay: isCollectionOpen
                      ? `${120 + index * 70}ms`
                      : "0ms",
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-16">
                    <p
                      className="text-center text-[15px] text-white underline underline-offset-2"
                      style={{
                        fontFamily: fonts.primary,
                      }}
                    >
                      {card.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OpenMenu;