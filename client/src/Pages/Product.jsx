import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { getProducts, getProductBySlug } from "../services/productService.js";
import { colours, fonts } from "../theme/theme.js";

const API = import.meta.env.VITE_SERVER_API;

const INK   = colours.text;
const BARK  = colours.accent;
const CREAM = colours.background;

const SCOPED_CSS = `
  .product-tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 10px 0;
    cursor: pointer;
    font-family: ${fonts.secondary};
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${colours.accent};
    transition: color 0.2s, border-color 0.2s;
    margin-right: 28px;
  }
  .product-tab.active {
    color: ${colours.text};
    border-bottom-color: ${colours.text};
  }
  .product-tab:hover {
    color: ${colours.text};
  }
  .qty-btn {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid rgba(199,165,138,0.35);
    cursor: pointer;
    border-radius: 2px;
    font-size: 1.1rem;
    color: ${colours.text};
    transition: background 0.2s, border-color 0.2s;
  }
  .qty-btn:hover { background: rgba(199,165,138,0.1); border-color: rgba(199,165,138,0.6); }
  @keyframes skeletonShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* ── Skeleton shimmer block helper ─────────────── */
function Skel({ w = "100%", h = "16px", style = {} }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "4px",
        background: "linear-gradient(90deg, #E8DDD3 25%, #F2EDE7 50%, #E8DDD3 75%)",
        backgroundSize: "200% 100%",
        animation: "skeletonShimmer 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

/* ── Full-page loading skeleton ──────────────────── */
function ProductSkeleton() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "40px 24px 72px",
        display: "flex",
        gap: "64px",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {/* Image panel skeleton */}
      <div style={{ flex: "1 1 360px", maxWidth: "560px" }}>
        <Skel h="0" style={{ aspectRatio: "3/4", height: "auto", paddingBottom: "133%" }} />
      </div>

      {/* Info panel skeleton */}
      <div style={{ flex: "1 1 300px", maxWidth: "540px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <Skel w="40%" h="12px" />
        <Skel w="75%" h="40px" />
        <Skel w="55%" h="12px" />
        <div style={{ width: "40px", height: "1px", background: colours.border }} />
        <Skel h="12px" />
        <Skel h="12px" />
        <Skel w="80%" h="12px" />
        <Skel w="30%" h="38px" style={{ marginTop: "8px" }} />
        <Skel h="52px" style={{ marginTop: "8px" }} />
      </div>
    </section>
  );
}

/* ── 404-style not found ─────────────────────── */
function NotFound({ navigate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "20px",
        textAlign: "center",
        padding: "40px 24px",
      }}
    >
      <h1 style={{ fontFamily: fonts.primary, fontSize: "3rem", fontWeight: 300, color: INK, margin: 0 }}>
        Product Not Found
      </h1>
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.88rem", color: BARK, margin: 0 }}>
        This product doesn't exist or may have been removed.
      </p>
      <button
        onClick={() => navigate("/collection")}
        style={{
          fontFamily: fonts.secondary,
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: INK,
          color: CREAM,
          border: "none",
          borderRadius: "2px",
          padding: "14px 32px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        Browse Collection
      </button>
    </div>
  );
}

/* ── Error state ─────────────────────────────── */
function ErrorState({ message, navigate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "20px",
        textAlign: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ fontSize: "2.4rem" }}>🌿</div>
      <h1
        style={{
          fontFamily: fonts.primary,
          fontSize: "2.4rem",
          fontWeight: 300,
          color: INK,
          margin: 0,
          letterSpacing: "0.03em",
        }}
      >
        Unable to Load Product
      </h1>
      <p
        style={{
          fontFamily: fonts.secondary,
          fontSize: "0.88rem",
          color: BARK,
          margin: 0,
          maxWidth: "360px",
          lineHeight: 1.6,
        }}
      >
        {message ?? "Something went wrong. Please check your connection and try again."}
      </p>
      <button
        onClick={() => navigate("/collection")}
        style={{
          fontFamily: fonts.secondary,
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: INK,
          color: CREAM,
          border: "none",
          borderRadius: "2px",
          padding: "14px 32px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        Browse Collection
      </button>
    </div>
  );
}

/* ── Main Product Page ───────────────────────── */
const resolveImage = (url) => {
  if (!url) return '/products/placeholder.png';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

/* ── Main Product Page ───────────────────────── */
export default function Product() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
 
  // ── API state ─────────────────────────────────────────────────
  const [product,         setProduct]         = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [notFound,        setNotFound]        = useState(false);
  const [images,          setImages]          = useState([]);
  const [activeImage,     setActiveImage]     = useState(null);
 
  // ── UI state (preserved exactly from original) ────────────────
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);
  const [tab,     setTab]     = useState("description");
  const [imgZoom, setImgZoom] = useState(false);
 
  // ── Fetch product + related products on slug change ───────────
  useEffect(() => {
    let cancelled = false;
 
    async function fetchData() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setProduct(null);
      setRelatedProducts([]);
      setImages([]);
      setActiveImage(null);
 
      try {
        // Fetch the target product by slug
        const found = await getProductBySlug(slug);
 
        if (cancelled) return;
 
        if (!found) {
          setNotFound(true);
          setLoading(false);
          return;
        }
 
        setProduct(found);
 
        // Fetch all product images
        let productImages = [];
        try {
          const imgRes = await fetch(`${API}/api/products/${found.id}/images`);
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            productImages = imgData.images ?? [];
          }
        } catch (imgErr) {
          console.error("Failed to load product images", imgErr);
        }
 
        if (!cancelled) {
          setImages(productImages);
          const primaryImg = productImages.find(img => img.is_primary) ?? productImages[0];
          setActiveImage(primaryImg ? resolveImage(primaryImg.image_url) : found.image);
 
          // Fetch all products to build related items list
          // (getProducts() is a cheap second call — results may be browser-cached)
          const all = await getProducts();
          const related = all
            .filter(p => p.id !== found.id && p.category === found.category)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
 
    fetchData();
    return () => { cancelled = true; };
  }, [slug]);
 
  // ── Handlers ──────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };
 
  // ── Render: loading ───────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: colours.background, display: "flex", flexDirection: "column" }}>
        <style>{SCOPED_CSS}</style>
        <NavBar />
        <main style={{ flex: 1, paddingTop: "96px" }}>
          <ProductSkeleton />
        </main>
        <Footer />
      </div>
    );
  }
 
  // ── Render: error ─────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: colours.background, display: "flex", flexDirection: "column" }}>
        <style>{SCOPED_CSS}</style>
        <NavBar />
        <ErrorState message={error} navigate={navigate} />
        <Footer />
      </div>
    );
  }
 
  // ── Render: not found ─────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div style={{ minHeight: "100vh", background: colours.background, display: "flex", flexDirection: "column" }}>
        <style>{SCOPED_CSS}</style>
        <NavBar />
        <NotFound navigate={navigate} />
        <Footer />
      </div>
    );
  }
 
  // ── Derived values ────────────────────────────────────────────
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
 
  const TAB_CONTENT = {
    description: (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.88rem", color: colours.mutedText, lineHeight: 1.8, margin: 0 }}>
        {product.description}
      </p>
    ),
    ingredients: (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.88rem", color: colours.mutedText, lineHeight: 1.8, margin: 0 }}>
        {product.ingredients}Aqua, Rosa Damascena Flower Water, Glycerin (vegetable-derived), Butyrospermum Parkii (Shea) Butter, Helianthus Annuus (Sunflower) Seed Oil, Emulsifying Wax NF, Cetyl Alcohol, Niacinamide, Allantoin, Aloe Barbadensis Leaf Juice, Tocopherol (Vitamin E), Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.
      </p>
    ),
    howToUse: (
      <ol style={{ fontFamily: fonts.secondary, fontSize: "0.88rem", color: colours.mutedText, lineHeight: 2, margin: 0, paddingLeft: "20px" }}>
        <li>Apply a small amount to clean, dry hair or skin.</li>
        <li>Massage gently in circular motions for 2–3 minutes.</li>
        <li>Leave on as directed, or rinse after the recommended time.</li>
        <li>Use consistently — morning and/or evening — for best results.</li>
        <li>Store in a cool, dry place away from direct sunlight.</li>
      </ol>
    ),
  };
 
  // ── Render: product ───────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: colours.background, display: "flex", flexDirection: "column" }}>
      <style>{SCOPED_CSS}</style>
      <NavBar />
 
      <main style={{ flex: 1, paddingTop: "96px" }}>
 
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "24px 24px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: fonts.secondary,
            fontSize: "0.7rem",
            color: BARK,
            letterSpacing: "0.1em",
          }}
        >
          {[
            { label: "Home",            action: () => navigate("/") },
            { label: "Collection",      action: () => navigate("/collection") },
            { label: product.subtitle,  action: () => navigate(`/collection/${product.category}`) },
          ].map((crumb, i, arr) => (
            <span key={crumb.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={crumb.action}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: i === arr.length - 1 ? INK : BARK,
                  fontSize: "inherit", letterSpacing: "inherit",
                  padding: 0, fontWeight: i === arr.length - 1 ? 600 : 400,
                }}
              >
                {crumb.label}
              </button>
              {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>›</span>}
            </span>
          ))}
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: INK, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
            {product.name}
          </span>
        </nav>
 
        {/* ── Product detail: image + info ──────────────────── */}
        <section
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "40px 24px 72px",
            display: "flex",
            gap: "64px",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Image panel */}
          <div
            style={{
              flex: "1 1 360px",
              maxWidth: "560px",
              position: "sticky",
              top: "96px",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "3/4",
                borderRadius: "4px",
                overflow: "hidden",
                background: colours.primary,
                cursor: imgZoom ? "zoom-out" : "zoom-in",
              }}
              onClick={() => setImgZoom(v => !v)}
            >
              <img
                src={activeImage || product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: imgZoom ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              {product.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: product.isNew ? BARK : colours.text,
                    color: CREAM,
                    fontSize: "9px",
                    fontFamily: fonts.primary,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "5px 12px",
                    borderRadius: "2px",
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>
 
            {/* Premium Thumbnail Gallery */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "16px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {images.map((img, i) => {
                  const resolvedUrl = resolveImage(img.image_url);
                  const isSelected = activeImage === resolvedUrl;
                  return (
                    <button
                      key={img.id || i}
                      onClick={() => setActiveImage(resolvedUrl)}
                      onMouseEnter={() => setActiveImage(resolvedUrl)}
                      style={{
                        width: "64px",
                        height: "85px",
                        borderRadius: "4px",
                        border: isSelected
                          ? `2px solid ${BARK}`
                          : "2px solid transparent",
                        padding: 0,
                        background: "none",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={resolvedUrl}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          opacity: isSelected ? 1 : 0.75,
                          transition: "opacity 0.2s ease",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Info panel */}
          <div style={{ flex: "1 1 300px", maxWidth: "540px" }}>
            {/* Category */}
            <p
              style={{
                fontFamily: fonts.secondary,
                fontSize: "0.65rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: BARK,
                margin: "0 0 10px",
                fontWeight: 500,
              }}
            >
              {product.subtitle}
            </p>
 
            {/* Name */}
            <h1
              style={{
                fontFamily: fonts.primary,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300,
                color: INK,
                margin: "0 0 12px",
                letterSpacing: "0.03em",
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h1>
 
            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "16px" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                  fill={i <= Math.round(product.rating) ? "#c8a96a" : "none"}
                  stroke="#c8a96a" strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span style={{ fontFamily: fonts.secondary, fontSize: "0.72rem", color: BARK, marginLeft: "6px" }}>
                {product.rating > 0
                  ? `${product.rating} (${product.reviews} reviews)`
                  : "No reviews yet"}
              </span>
            </div>
 
            {/* Divider */}
            <div style={{ width: "40px", height: "1px", background: colours.border, margin: "0 0 20px" }} />
 
            {/* Description */}
            <p
              style={{
                fontFamily: fonts.secondary,
                fontSize: "0.88rem",
                color: colours.mutedText,
                lineHeight: 1.8,
                margin: "0 0 28px",
              }}
            >
              {product.description}
            </p>
 
            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "28px" }}>
              <span
                style={{
                  fontFamily: fonts.primary,
                  fontSize: "2rem",
                  color: colours.text,
                  letterSpacing: "-0.01em",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, textDecoration: "line-through" }}>
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      background: colours.primary,
                      color: colours.secondary,
                      padding: "3px 10px",
                      borderRadius: "99px",
                    }}
                  >
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>
 
            {/* Quantity + Add to cart */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
              {/* Quantity */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${colours.border}`,
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >−</button>
                <span
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: "1.1rem",
                    color: colours.text,
                    padding: "0 18px",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {qty}
                </span>
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => q + 1)}
                  aria-label="Increase quantity"
                >+</button>
              </div>
 
              {/* Add to cart */}
              <button
                id="product-add-to-cart"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  fontFamily: fonts.secondary,
                  fontSize: "0.72rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  background: added ? colours.accent : colours.text,
                  color: colours.background,
                  border: "none",
                  borderRadius: "2px",
                  padding: "16px 28px",
                  cursor: added ? "default" : "pointer",
                  fontWeight: 500,
                  transition: "background 0.3s ease",
                }}
              >
                {added ? "Added to Cart ✓" : `Add to Cart — ₹${(product.price * qty).toLocaleString("en-IN")}`}
              </button>
            </div>
 
            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                padding: "16px 20px",
                background: colours.primary,
                borderRadius: "4px",
                marginBottom: "32px",
              }}
            >
              {[
                { icon: "🌿", text: "100% Natural" },
                { icon: "🚚", text: "Free Shipping ₹799+" },
                { icon: "♻️", text: "Eco Packaging" },
              ].map(b => (
                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1rem" }}>{b.icon}</span>
                  <span
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: "0.7rem",
                      color: colours.mutedText,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
 
            {/* Tabs */}
            <div style={{ borderBottom: `1px solid ${colours.border}`, marginBottom: "20px" }}>
              {[
                { key: "description", label: "Description" },
                { key: "ingredients", label: "Ingredients" },
                { key: "howToUse",    label: "How to Use"  },
              ].map(t => (
                <button
                  key={t.key}
                  className={`product-tab${tab === t.key ? " active" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
 
            {/* Tab content */}
            <div style={{ minHeight: "80px" }}>
              {TAB_CONTENT[tab]}
            </div>
          </div>
        </section>
 
        {/* ── Related products ──────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "0 24px 80px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  color: colours.text,
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                You May Also Like
              </h2>
              <div style={{ flex: 1, height: "1px", background: colours.border }} />
            </div>
 
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              {relatedProducts.map(p => (
                <RelatedCard key={p.id} product={p} navigate={navigate} />
              ))}
            </div>
          </section>
        )}
      </main>
 
      <Footer />
    </div>
  );
}
 
/* ── Lightweight related card ─────────────────── */
function RelatedCard({ product, navigate }) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: colours.surface,
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 12px 36px rgba(30,20,10,0.13), 0 0 0 1px rgba(199,165,138,0.18)"
          : "0 2px 10px rgba(30,20,10,0.07), 0 0 0 1px rgba(199,165,138,0.10)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s ease",
      }}
    >
      <div style={{ aspectRatio: "1/1", overflow: "hidden", background: colours.primary }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      </div>
      <div style={{ padding: "16px" }}>
        <p style={{ fontFamily: fonts.secondary, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: colours.accent, margin: "0 0 4px", fontWeight: 500 }}>
          {product.subtitle}
        </p>
        <h3 style={{ fontFamily: fonts.primary, fontSize: "1.1rem", fontWeight: 400, color: colours.text, margin: "0 0 8px", letterSpacing: "0.02em" }}>
          {product.name}
        </h3>
        <span style={{ fontFamily: fonts.primary, fontSize: "1.1rem", color: colours.text }}>
          ₹{product.price.toLocaleString("en-IN")}
        </span>
      </div>
    </article>
  );
}