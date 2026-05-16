// ProductCard.jsx — fully composable via children slots
// Usage: import ProductCard, { CardImage, CardBadge, CardName, CardSubtitle, CardDescription, CardPrice, CardButton } from './ProductCard'

const styles = {
  card: {
    position: "relative",
    width: "300px",
    background: "#faf7f2",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(60,40,20,0.08), 0 0 0 1px rgba(60,40,20,0.07)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    cursor: "default",
  },
  cardHoverTarget: {
    // Applied via onMouseEnter/Leave in the component
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    background: "#ede8df",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  badge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    background: "#2c1a0e",
    color: "#f5efe6",
    fontSize: "9px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "5px 10px",
    borderRadius: "2px",
    zIndex: 2,
  },
  body: {
    padding: "20px 22px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  name: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "normal",
    color: "#1e110a",
    letterSpacing: "0.01em",
    lineHeight: 1.2,
  },
  subtitle: {
    margin: 0,
    fontSize: "11px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8a6a50",
  },
  divider: {
    width: "32px",
    height: "1px",
    background: "#c8b49a",
    margin: "6px 0",
  },
  description: {
    margin: 0,
    fontSize: "13px",
    color: "#5a4030",
    lineHeight: 1.65,
    fontFamily: "'Georgia', serif",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "14px",
  },
  price: {
    fontSize: "22px",
    color: "#1e110a",
    letterSpacing: "-0.01em",
  },
  button: {
    background: "#2c1a0e",
    color: "#f5efe6",
    border: "none",
    borderRadius: "2px",
    padding: "10px 18px",
    fontSize: "10px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
};

/* ─── Slot Components ─────────────────────────────────────── */

export function CardImage({ src, alt = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      style={styles.image}
      className="pc-img"
    />
  );
}

export function CardBadge({ children }) {
  return <span style={styles.badge}>{children}</span>;
}

export function CardName({ children }) {
  return <h2 style={styles.name}>{children}</h2>;
}

export function CardSubtitle({ children }) {
  return <p style={styles.subtitle}>{children}</p>;
}

export function CardDescription({ children }) {
  return <p style={styles.description}>{children}</p>;
}

export function CardPrice({ children }) {
  return <span style={styles.price}>{children}</span>;
}

export function CardButton({ children, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      style={{
        ...styles.button,
        background: hovered ? "#4a2c18" : "#2c1a0e",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

/* ─── Main Card ───────────────────────────────────────────── */

// Children are split into "image area" and "body" via named slots:
//   imageSlot  → renders inside the image wrapper (CardImage, CardBadge, etc.)
//   bodySlot   → renders inside the text body

export default function ProductCard({ imageSlot, bodySlot }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <article
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 12px 32px rgba(60,40,20,0.16), 0 0 0 1px rgba(60,40,20,0.09)"
          : styles.card.boxShadow,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image zone */}
      <div style={styles.imageWrap}>
        {/* Scale image on card hover via inline style cascade */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {imageSlot}
        </div>
      </div>

      {/* Body zone */}
      <div style={styles.body}>
        <div style={styles.divider} />
        {bodySlot}
      </div>
    </article>
  );
}