import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { getProducts, getProductBySlug } from "../services/productService.js";
import { colours, fonts } from "../theme/theme.js";
import AddToCartNumbers from "../Components/AddToCartNumbers.jsx";
import useCartQuantity from "../hooks/useCartQuantity.js";

const API = import.meta.env.VITE_SERVER_API;

const INK = colours.text;
const BARK = colours.accent;
const CREAM = colours.background;
const CARD = colours.background || colours.background;

const SCOPED_CSS = `
  .product-shell-card {
    border: 1px solid ${colours.border};
    background: ${CARD};
    box-shadow: 0 18px 55px rgba(30, 20, 10, 0.08);
  }
  .product-tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 12px 0;
    cursor: pointer;
    font-family: ${fonts.secondary};
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${colours.accent};
    transition: color 0.2s, border-color 0.2s;
    margin-right: 24px;
  }
  .product-tab.active {
    color: ${colours.text};
    border-bottom-color: ${colours.text};
  }
  .product-tab:hover {
    color: ${colours.text};
  }
  .qty-btn {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colours.background};
    border: 1px solid ${colours.border};
    cursor: pointer;
    border-radius: 999px;
    font-size: 1.1rem;
    color: ${colours.text};
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .qty-btn:hover {
    background: ${colours.primary};
    border-color: ${colours.accent};
    transform: translateY(-1px);
  }
  .thumb-scroll::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  @keyframes skeletonShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function getField(product, camelKey, snakeKey, fallback = "") {
  return product?.[camelKey] ?? product?.[snakeKey] ?? fallback;
}

function money(value) {
  const number = Number(value || 0);
  return number.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveImage(url) {
  if (!url) return "/products/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

function Skel({ w = "100%", h = "16px", style = {} }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "18px",
        background: "linear-gradient(90deg, #E8DDD3 25%, #F2EDE7 50%, #E8DDD3 75%)",
        backgroundSize: "200% 100%",
        animation: "skeletonShimmer 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

function ProductSkeleton() {
  return (
    <section
      style={{
        maxWidth: "1260px",
        margin: "0 auto",
        padding: "40px 24px 72px",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.05fr) minmax(340px, 0.95fr)",
        gap: "36px",
      }}
    >
      <div className="product-shell-card" style={{ borderRadius: "22px", padding: "18px" }}>
        <Skel h="520px" style={{ borderRadius: "18px" }} />
      </div>
      <div className="product-shell-card" style={{ borderRadius: "22px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <Skel w="70%" h="34px" />
        <Skel w="45%" h="16px" />
        <Skel w="38%" h="44px" />
        <Skel h="12px" />
        <Skel h="12px" />
        <Skel w="80%" h="12px" />
        <Skel h="52px" />
      </div>
    </section>
  );
}

function NotFound({ navigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px", textAlign: "center", padding: "40px 24px" }}>
      <h1 style={{ fontFamily: fonts.primary, fontSize: "3rem", fontWeight: 300, color: INK, margin: 0 }}>Product Not Found</h1>
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.88rem", color: BARK, margin: 0 }}>This product does not exist or may have been removed.</p>
      <button
        onClick={() => navigate("/collection")}
        style={{ fontFamily: fonts.secondary, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", background: INK, color: CREAM, border: "none", borderRadius: "999px", padding: "14px 32px", cursor: "pointer", marginTop: "8px" }}
      >
        Browse Collection
      </button>
    </div>
  );
}

function ErrorState({ message, navigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px", textAlign: "center", padding: "40px 24px" }}>
      <h1 style={{ fontFamily: fonts.primary, fontSize: "2.4rem", fontWeight: 300, color: INK, margin: 0, letterSpacing: "0.03em" }}>Unable to Load Product</h1>
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.88rem", color: BARK, margin: 0, maxWidth: "360px", lineHeight: 1.6 }}>{message ?? "Something went wrong. Please check your connection and try again."}</p>
      <button
        onClick={() => navigate("/collection")}
        style={{ fontFamily: fonts.secondary, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", background: INK, color: CREAM, border: "none", borderRadius: "999px", padding: "14px 32px", cursor: "pointer", marginTop: "8px" }}
      >
        Browse Collection
      </button>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "11px 0", borderBottom: `1px solid ${colours.border}` }}>
      <span style={{ fontFamily: fonts.secondary, fontSize: "0.74rem", color: colours.mutedText }}>{label}</span>
      <span style={{ fontFamily: fonts.secondary, fontSize: "0.76rem", color: colours.text, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function PillList({ items }) {
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {items.map((item) => (
        <span key={item} style={{ fontFamily: fonts.secondary, fontSize: "0.7rem", color: colours.text, border: `1px solid ${colours.border}`, background: colours.primary, borderRadius: "999px", padding: "7px 12px" }}>
          {item}
        </span>
      ))}
    </div>
  );
}



export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("description");
  const { quantity: qty, setQuantity: setQty, increase, decrease } = useCartQuantity(product?.id);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 10000);
  
  //   return () => clearTimeout(timer);
  // }, []);
  
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
        const found = await getProductBySlug(slug);
        if (cancelled) return;

        if (!found) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProduct(found);

        const seoTitle = getField(found, "seoTitle", "seo_title", found.name);
        const seoDescription = getField(found, "seoDescription", "seo_description", found.description);
        if (seoTitle) document.title = seoTitle;
        if (seoDescription) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "description");
            document.head.appendChild(meta);
          }
          meta.setAttribute("content", seoDescription);
        }

        let productImages = [];
        try {
          const imgRes = await fetch(`${API}/api/product/${found.id}/images`);
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            productImages = (imgData.images ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          }
        } catch (imgErr) {
          console.error("Failed to load product images", imgErr);
        }

        if (!cancelled) {
          setImages(productImages);
          const primaryImg = productImages.find((img) => img.is_primary) ?? productImages[0];
          setActiveImage(primaryImg ? resolveImage(primaryImg.image_url) : resolveImage(found.image));

          const all = await getProducts();
          const productCategory = found.category ?? found.category_id;
          const related = all
            .filter((p) => p.id !== found.id && (p.category === productCategory || p.category_id === productCategory))
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleAddToCart = () => {
    if (added || isUnavailable) return;
    if (qty === 0) setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: colours.primary, display: "flex", flexDirection: "column" }}>
        <style>{SCOPED_CSS}</style>
        <NavBar />
        <main style={{ flex: 1, paddingTop: "96px" }}>
          <ProductSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

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

  const name = product.name;
  const category = product.categoryName || product.category_name || product.category || product.subtitle || "Product";
  const code = getField(product, "code", "code", "");
  const badge = product.badge;
  const price = Number(product.price || 0);
  const originalPrice = Number(getField(product, "originalPrice", "original_price", 0));
  const discountValue = Number(getField(product, "discountValue", "discount_value", 0));
  const discountType = getField(product, "discountType", "discount_type", "");
  const stockQty = Number(getField(product, "stockQty", "stock_qty", 0));
  const sizeValue = getField(product, "sizeValue", "size_value", "");
  const sizeUnit = getField(product, "sizeUnit", "size_unit", "");
  const status = getField(product, "status", "status", product.isActive === false || product.is_active === false ? "archived" : "active");
  const description = product.description || "No product description available.";
  const ingredients = getField(product, "ingredients", "ingredients", "");
  const usageInstructions = getField(product, "usageInstructions", "usage_instructions", "");
  const benefits = normalizeList(getField(product, "benefits", "benefits", []));
  const concerns = normalizeList(product.concerns);
  const allImages = images.length
    ? images
    : [{ id: "fallback", image_url: product.image, is_primary: true, sort_order: 0 }];
  const activeIndex = Math.max(0, allImages.findIndex((img) => resolveImage(img.image_url) === activeImage));
  const isUnavailable = status === "out_of_stock" || status === "archived" || status === "draft" || stockQty <= 0;
  const discountPct = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : null;
  const discountLabel = discountValue > 0
    ? discountType === "percentage"
      ? `${discountValue}% off`
      : `₹${money(discountValue)} off`
    : discountPct
      ? `${discountPct}% off`
      : null;
  const productSize = sizeValue && sizeUnit ? `${sizeValue} ${sizeUnit}` : "";

  const TAB_CONTENT = {
    description: <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, lineHeight: 1.85, margin: 0 }}>{description}</p>,
    ingredients: ingredients ? (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, lineHeight: 1.85, margin: 0 }}>{ingredients}</p>
    ) : (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, margin: 0 }}>Ingredients are not listed for this product.</p>
    ),
    usage: usageInstructions ? (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, lineHeight: 1.85, margin: 0 }}>{usageInstructions}</p>
    ) : (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, margin: 0 }}>Usage instructions are not listed for this product.</p>
    ),
    benefits: benefits.length ? (
      <ul style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, lineHeight: 1.85, margin: 0, paddingLeft: "20px" }}>
        {benefits.map((item) => <li key={item}>{item}</li>)}
      </ul>
    ) : (
      <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, margin: 0 }}>Benefits are not listed for this product.</p>
    ),
  };

  return (
    <div style={{ minHeight: "100vh", background: colours.background, display: "flex", flexDirection: "column" }}>
      <style>{SCOPED_CSS}</style>
      <NavBar />

      <main style={{ flex: 1, paddingTop: "96px" }}>
        <nav
          style={{
            maxWidth: "1260px",
            margin: "0 auto",
            padding: "24px 24px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: fonts.secondary,
            fontSize: "0.72rem",
            color: BARK,
            letterSpacing: "0.08em",
          }}
        >
          {[
            { label: "Home", action: () => navigate("/") },
            { label: "Collection", action: () => navigate("/collection") },
            { label: category, action: () => navigate(`/collection/${product.category || product.category_id || ""}`) },
          ].map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={crumb.action}
                style={{ background: "none", border: "none", cursor: "pointer", color: BARK, fontSize: "inherit", letterSpacing: "inherit", padding: 0 }}
              >
                {crumb.label}
              </button>
              <span style={{ opacity: 0.4 }}>›</span>
            </span>
          ))}
          <span style={{ color: INK, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "240px" }}>{name}</span>
        </nav>

        <section
          style={{
            maxWidth: "1260px",
            margin: "0 auto",
            padding: "32px 24px 72px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.04fr) minmax(360px, 0.96fr)",
            gap: "36px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "70px minmax(0, 1fr)", gap: "18px" }}>
              <div className="thumb-scroll" style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "520px", overflowY: "auto", padding: "4px 0" }}>
                {allImages.map((img, i) => {
                  const url = resolveImage(img.image_url);
                  const isSelected = activeImage === url || (!activeImage && i === 0);
                  return (
                    <button
                      key={img.id || `${url}-${i}`}
                      type="button"
                      onClick={() => setActiveImage(url)}
                      style={{
                        width: "64px",
                        height: "76px",
                        borderRadius: "12px",
                        border: isSelected ? `2px solid ${INK}` : `1px solid ${colours.border}`,
                        padding: "3px",
                        background: isSelected ? colours.background : colours.primary,
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    >
                      <img src={url} alt={`${name} thumbnail ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "9px", display: "block" }} />
                    </button>
                  );
                })}
              </div>

              <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "18px", overflow: "hidden", background: colours.primary }}>
                <img
                  src={activeImage || resolveImage(product.image)}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => { e.currentTarget.src = "/products/placeholder.png"; }}
                />

                {badge && (
                  <span style={{ position: "absolute", top: "16px", left: "16px", background: INK, color: CREAM, fontSize: "0.68rem", fontFamily: fonts.secondary, letterSpacing: "0.08em", textTransform: "uppercase", padding: "7px 12px", borderRadius: "999px" }}>
                    {badge}
                  </span>
                )}

                
              </div>
            </div>

            <div className="product-shell-card" style={{ borderRadius: "20px", padding: "22px" }}>
              
            </div>
          </div>

          <aside className="product-shell-card" style={{ borderRadius: "22px", padding: "30px", position: "sticky", top: "104px" }}>
            <p style={{ fontFamily: fonts.secondary, fontSize: "0.72rem", color: BARK, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>{category}</p>

            <h1 style={{ fontFamily: fonts.primary, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: INK, margin: "0 0 12px", lineHeight: 1.08 }}>{name}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(product.rating || 0) ? "#c8a96a" : "none"} stroke="#c8a96a" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span style={{ fontFamily: fonts.secondary, fontSize: "0.76rem", color: colours.mutedText }}>
                {product.rating > 0 ? `${product.rating} (${product.reviews || 0} reviews)` : "No reviews yet"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "22px" }}>
              <span style={{ fontFamily: fonts.primary, fontSize: "2.15rem", color: INK, letterSpacing: "-0.02em" }}>₹{money(price)}</span>
              {originalPrice > price && (
                <span style={{ fontFamily: fonts.secondary, fontSize: "0.92rem", color: colours.mutedText, textDecoration: "line-through" }}>₹{money(originalPrice)}</span>
              )}
              {discountLabel && (
                <span style={{ fontFamily: fonts.secondary, fontSize: "0.72rem", fontWeight: 700, background: colours.primary, color: BARK, borderRadius: "999px", padding: "5px 10px" }}>{discountLabel}</span>
              )}
            </div>

            {productSize && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontFamily: fonts.secondary, fontSize: "0.78rem", color: colours.mutedText, margin: "0 0 10px" }}>Size</p>
                <span style={{ display: "inline-flex", border: `1px solid ${INK}`, borderRadius: "999px", padding: "10px 18px", fontFamily: fonts.secondary, fontSize: "0.82rem", fontWeight: 700, color: INK }}>{productSize}</span>
              </div>
            )}

            <p style={{ fontFamily: fonts.secondary, fontSize: "0.9rem", color: colours.mutedText, lineHeight: 1.75, margin: "0 0 24px" }}>{description}</p>

            

            <p style={{ fontFamily: fonts.secondary, fontSize: "0.78rem", color: colours.mutedText, margin: "0 0 10px" }}>Quantity</p>

            <div className="flex items-center gap-6" >
              <AddToCartNumbers
                count={qty}
                onIncrease={increase}
                onDecrease={decrease}
              />
  
              <button
                id="product-add-to-cart"
                type="button"
                onClick={handleAddToCart}
                disabled={isUnavailable}
                style={{
                  width: "100%",
                  fontFamily: fonts.secondary,
                  fontSize: "0.74rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: isUnavailable ? colours.border : added ? BARK : INK,
                  color: isUnavailable ? colours.mutedText : CREAM,
                  border: "none",
                  borderRadius: "999px",
                  padding: "14px 28px",
                  cursor: isUnavailable ? "not-allowed" : added ? "default" : "pointer",
                  fontWeight: 700,
                  transition: "background 0.3s ease",
                }}
              >
                {isUnavailable ? "Currently Unavailable" : added ? "Added to Cart" : `Add to Cart`}
              </button>
            </div>
            

          </aside>
        </section>

        <section style={{ maxWidth: "1260px", margin: "0 auto", padding: "0 24px 72px" }}>
          <div className="product-shell-card" style={{ borderRadius: "22px", padding: "28px" }}>
            <div style={{ borderBottom: `1px solid ${colours.border}`, marginBottom: "20px", overflowX: "auto", whiteSpace: "nowrap" }}>
              {[
                { key: "description", label: "Description" },
                { key: "ingredients", label: "Ingredients" },
                { key: "usage", label: "Usage" },
                { key: "benefits", label: "Benefits" },
              ].map((item) => (
                <button key={item.key} type="button" className={`product-tab${tab === item.key ? " active" : ""}`} onClick={() => setTab(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div style={{ minHeight: "90px" }}>{TAB_CONTENT[tab]}</div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section style={{ maxWidth: "1260px", margin: "0 auto", padding: "0 24px 80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: fonts.primary, fontSize: "1.8rem", fontWeight: 400, color: colours.text, margin: 0, letterSpacing: "0.04em" }}>You May Also Like</h2>
              <div style={{ flex: 1, height: "1px", background: colours.border }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
              {relatedProducts.map((p) => <RelatedCard key={p.id} product={p} navigate={navigate} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function RelatedCard({ product, navigate }) {
  const [hovered, setHovered] = useState(false);
  const productPrice = Number(product.price || 0);

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: CARD,
        borderRadius: "18px",
        overflow: "hidden",
        border: `1px solid ${colours.border}`,
        boxShadow: hovered ? "0 14px 34px rgba(30,20,10,0.14)" : "0 2px 10px rgba(30,20,10,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s ease",
      }}
    >
      <div style={{ aspectRatio: "1/1", overflow: "hidden", background: colours.primary }}>
        <img
          src={resolveImage(product.image)}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.6s ease" }}
          onError={(e) => { e.currentTarget.src = "/products/placeholder.png"; }}
        />
      </div>
      <div style={{ padding: "16px" }}>
        <p style={{ fontFamily: fonts.secondary, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: colours.accent, margin: "0 0 4px", fontWeight: 500 }}>
          {product.category || product.subtitle || "Product"}
        </p>
        <h3 style={{ fontFamily: fonts.primary, fontSize: "1.1rem", fontWeight: 400, color: colours.text, margin: "0 0 8px", letterSpacing: "0.02em" }}>
          {product.name}
        </h3>
        <span style={{ fontFamily: fonts.primary, fontSize: "1.1rem", color: colours.text }}>₹{money(productPrice)}</span>
      </div>
    </article>
  );
}