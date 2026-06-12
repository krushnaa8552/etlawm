import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../../theme/theme";
import { getProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";

// Fallback images
import hairOilImg from "../../assets/etlawm-hair-oil.png";
import faceSerumImg from "../../assets/etlawm-face-serum.png";
import bottlesImg from "../../assets/bottles.jpg";

const MOCK_PRODUCTS = [
  {
    id: "fallback-1",
    name: "Root Stimulating Hair Oil",
    slug: "root-ritual-hair-oil",
    price: 499,
    originalPrice: 650,
    badge: "Best Seller",
    rating: 5,
    reviews: 142,
    image: hairOilImg,
    subtitle: "Castor & Bhringraj",
  },
  {
    id: "fallback-2",
    name: "Glow Infusing Face Serum",
    slug: "glow-infusing-face-serum",
    price: 599,
    originalPrice: 750,
    badge: "New",
    rating: 4.8,
    reviews: 98,
    image: faceSerumImg,
    subtitle: "Saffron & Rosehip",
  },
  {
    id: "fallback-3",
    name: "Botanical Scalp Mask",
    slug: "botanical-hair-mask",
    price: 699,
    originalPrice: 890,
    badge: "Highly Rated",
    rating: 5,
    reviews: 74,
    image: bottlesImg,
    subtitle: "Neem & Tea Tree",
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (isMounted) {
          // Filter active or take top 3
          const active = data.filter((p) => p.isActive);
          if (active.length > 0) {
            setProducts(active.slice(0, 3));
          } else {
            setProducts(MOCK_PRODUCTS);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch products, using high-end mock fallback:", err);
        if (isMounted) {
          setProducts(MOCK_PRODUCTS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAdd = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingId(productId);
      // If it is a fallback/mock product, use a dummy wait, otherwise run API
      if (typeof productId === "string" && productId.startsWith("fallback")) {
        await new Promise((r) => setTimeout(r, 800));
        // Add to guest cart or just mock it
        try {
          await addToCart(1, 1); // fallback DB ID
        } catch {
          // ignore DB error for mock items
        }
      } else {
        await addToCart(productId, 1);
      }
      // Success triggers
      setAddedId(productId);
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(() => {
        setAddedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed adding to cart:", err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="py-24 bg-[#F7F3EC] w-full">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">
        
        {/* Section Title */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A77C6B]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A77C6B]">
                Selected Rituals
              </p>
            </div>
            <h2
              className="text-3xl md:text-5xl font-normal tracking-[-0.035em] text-[#171715]"
              style={{ fontFamily: fonts.primary }}
            >
              The Best Sellers
            </h2>
          </div>

          <Link
            to="/collection"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#171715] hover:text-[#A77C6B] transition-colors duration-300"
          >
            View All Botanical Bottles
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => {
            const isAdding = addingId === p.id;
            const isAdded = addedId === p.id;

            return (
              <div
                key={p.id}
                className="group relative flex flex-col bg-white border border-[#D8D2C8]/60 p-6 rounded-md hover:shadow-[0_20px_45px_rgba(23,23,21,0.04)] transition-all duration-500 hover:-translate-y-1"
              >
                {/* Badge Tag */}
                {p.badge && (
                  <span className="absolute left-6 top-6 z-10 text-[9px] uppercase tracking-wider font-bold bg-[#A77C6B] text-[#F7F3EC] px-3 py-1 rounded-sm">
                    {p.badge}
                  </span>
                )}

                {/* Rating Display */}
                <div className="absolute right-6 top-6 z-10 flex items-center gap-1 bg-[#F7F3EC]/80 backdrop-blur-sm px-2 py-0.5 rounded-sm text-[10px] text-gray-700 font-semibold">
                  <span>★</span>
                  <span>{p.rating || 5}</span>
                </div>

                {/* Product Image Frame */}
                <Link
                  to={`/product/${p.slug}`}
                  className="relative flex items-center justify-center h-72 w-full overflow-hidden bg-[#F4F1EC] rounded-sm mb-6"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-56 object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-[#171715]/[0.02] pointer-events-none" />
                </Link>

                {/* Categories/Subtitles */}
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A77C6B] font-semibold mb-2">
                  {p.subtitle || p.category || "Active Botanical"}
                </span>

                {/* Product Title */}
                <Link
                  to={`/product/${p.slug}`}
                  className="text-lg md:text-xl font-normal text-[#171715] hover:text-[#A77C6B] transition-colors mb-3 leading-snug"
                  style={{ fontFamily: fonts.primary }}
                >
                  {p.name}
                </Link>

                {/* Pricing / Details Row */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-md font-semibold text-[#171715]">
                    ₹{p.price}
                  </span>
                  {p.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{p.originalPrice}
                    </span>
                  )}
                </div>

                {/* Interactive Add to Bag Button */}
                <button
                  onClick={(e) => handleQuickAdd(p.id, e)}
                  disabled={isAdding}
                  className={`mt-auto w-full py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm border transition-all duration-300 flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-[#bfd8bd] text-[#171715] border-transparent scale-[1.02]"
                      : "bg-[#171715] text-[#F7F3EC] border-transparent hover:bg-[#A77C6B] active:scale-98 disabled:opacity-50"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding...
                    </>
                  ) : isAdded ? (
                    "Added ✓"
                  ) : (
                    "Add to Bag"
                  )}
                </button>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
