import { useRef, useState } from "react";

import stock1 from "../assets/stock/stock1.jpg";
import stock2 from "../assets/stock/stock2.jpg";
import stock3 from "../assets/stock/stock3.jpg";
import stock4 from "../assets/stock/stock4.jpg";
import stock5 from "../assets/stock/stock5.jpg";
import stock6 from "../assets/stock/stock6.jpg";

const images = [stock1, stock2, stock3, stock4, stock5, stock6];

const slots = [-3, -2, -1, 0, 1, 2, 3];

const mod = (value, length) => {
  return ((value % length) + length) % length;
};

const getPositionStyles = (offset) => {
  if (offset === 0) {
    return {
      transform: "translateX(0px) translateZ(220px) rotateY(0deg) scale(1)",
      zIndex: 50,
      opacity: 1,
    };
  }

  if (offset === 1) {
    return {
      transform: "translateX(180px) translateZ(70px) rotateY(-35deg) scale(0.82)",
      zIndex: 40,
      opacity: 0.9,
    };
  }

  if (offset === -1) {
    return {
      transform: "translateX(-180px) translateZ(70px) rotateY(35deg) scale(0.82)",
      zIndex: 40,
      opacity: 0.9,
    };
  }

  if (offset === 2) {
    return {
      transform: "translateX(310px) translateZ(-90px) rotateY(-48deg) scale(0.68)",
      zIndex: 30,
      opacity: 0.55,
    };
  }

  if (offset === -2) {
    return {
      transform: "translateX(-310px) translateZ(-90px) rotateY(48deg) scale(0.68)",
      zIndex: 30,
      opacity: 0.55,
    };
  }

  if (offset === 3) {
    return {
      transform: "translateX(430px) translateZ(-180px) rotateY(-58deg) scale(0.5)",
      zIndex: 10,
      opacity: 0,
    };
  }

  return {
    transform: "translateX(-430px) translateZ(-180px) rotateY(58deg) scale(0.5)",
    zIndex: 10,
    opacity: 0,
  };
};

export default function MotionImageCarousel() {
  const [activePosition, setActivePosition] = useState(0);
  const isScrollingRef = useRef(false);

  const handleWheel = (event) => {
    // event.preventDefault();

    if (isScrollingRef.current) return;

    isScrollingRef.current = true;

    if (event.deltaY > 0) {
      setActivePosition((prev) => prev + 1);
    } else {
      setActivePosition((prev) => prev - 1);
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  return (
    <section
      onWheel={handleWheel}
      className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-6"
    >
      <div
        className="relative h-[420px] w-full max-w-5xl"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[280px] w-[220px] -translate-x-1/2 -translate-y-1/2"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {slots.map((slot) => {
            const virtualIndex = activePosition + slot;
            const imageIndex = mod(virtualIndex, images.length);
            const style = getPositionStyles(slot);

            return (
              <div
                key={virtualIndex}
                className="absolute inset-0 overflow-hidden rounded-2xl bg-neutral-200 shadow-2xl transition-all duration-700 ease-in-out"
                style={style}
              >
                <img
                  src={images[imageIndex]}
                  alt={`Carousel item ${imageIndex + 1}`}
                  className="h-full w-full object-cover"
                  draggable="false"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}