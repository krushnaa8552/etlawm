import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colours, fonts } from "../../theme/theme.js";
import AddToCartNumbers from "../AddToCartNumbers.jsx";
import useCartQuantity from "../../hooks/useCartQuantity.js";

/**
 * CollectionProductCard — product card for the collection grid.
 * Props: product (from products.js data shape)
 */
export default function CollectionProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colours.surface,
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 48px rgba(30,20,10,0.15), 0 0 0 1px rgba(199,165,138,0.18)"
          : "0 2px 12px rgba(30,20,10,0.07), 0 0 0 1px rgba(199,165,138,0.12)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "box-shadow 0.4s ease, transform 0.4s ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          background: colours.primary,
          flexShrink: 0,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />

        {/* Badge */}
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background: product.isNew ? colours.accent : colours.text,
              color: colours.background,
              fontSize: "9px",
              fontFamily: fonts.primary,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "5px 11px",
              borderRadius: "2px",
              zIndex: 2,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Discount pill */}
        {discountPct && (
          <span
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(245,220,200,0.92)",
              color: colours.text,
              fontSize: "9px",
              fontFamily: fonts.secondary,
              fontWeight: 600,
              letterSpacing: "0.06em",
              padding: "4px 9px",
              borderRadius: "99px",
              zIndex: 2,
            }}
          >
            -{discountPct}%
          </span>
        )}

        {/* Quick view overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "20px",
            background: "rgba(123,124,124,0.45)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
            pointerEvents: hovered ? "auto" : "none",
          }}
        >
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            style={{
              fontFamily: fonts.secondary,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "rgba(245,220,200,0.95)",
              color: colours.text,
              border: "none",
              borderRadius: "2px",
              padding: "10px 22px",
              cursor: "pointer",
              fontWeight: 500,
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "transform 0.35s ease, background 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "white")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,220,200,0.95)")}
          >
            View Product
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "20px 20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flexGrow: 1,
        }}
      >
        {/* Subtitle / category */}
        <p
          style={{
            margin: 0,
            fontSize: "9px",
            fontFamily: fonts.secondary,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colours.accent,
            fontWeight: 500,
          }}
        >
          {product.subtitle}
        </p>

        {/* Divider */}
        <div style={{ width: "28px", height: "1px", background: colours.border, margin: "2px 0" }} />

        {/* Name */}
        <h3
          style={{
            margin: 0,
            fontFamily: fonts.primary,
            fontSize: "1.2rem",
            fontWeight: 400,
            color: colours.text,
            letterSpacing: "0.02em",
            lineHeight: 1.25,
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: colours.mutedText,
            lineHeight: 1.65,
            fontFamily: fonts.secondary,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>

        {/* Footer: price + add to cart */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "14px",
            gap: "10px",
          }}
        >
          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontFamily: fonts.primary,
                fontSize: "1.3rem",
                color: colours.text,
                letterSpacing: "-0.01em",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: "0.75rem",
                  color: colours.secondary,
                  textDecoration: "line-through",
                }}
              >
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartBtn productId={product.id} />
        </div>
      </div>
    </article>
  );
}

function AddToCartBtn({ productId }) {
  const { quantity: count, setQuantity, increase, decrease } = useCartQuantity(productId);
  const [active, setActive] = useState(false);

  const handleAddToCart = () => {
    setActive(true);

    setTimeout(() => {
      setActive(false);
      setQuantity(1);
    }, 150);
  };

  if (count > 0) {
    return (
      <AddToCartNumbers
        count={count}
        onIncrease={increase}
        onDecrease={decrease}
      />
    );
  }

  return (
    <button
      id={`add-to-cart-${productId}`}
      onClick={handleAddToCart}
      style={{
        fontFamily: fonts.secondary,
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        background: active ? colours.mutedText : colours.text,
        color: colours.background,
        border: "none",
        borderRadius: "2px",
        height: "32px",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontWeight: 500,
        whiteSpace: "nowrap",
        transition: "background 0.2s ease, transform 0.15s ease",
        transform: active ? "scale(0.96)" : "scale(1)",
        flexShrink: 0,
      }}
    >
      Add to Cart
    </button>
  );
}