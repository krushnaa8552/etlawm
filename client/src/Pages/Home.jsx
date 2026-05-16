import { useState } from "react";
import NavBar from "../Components/NavBar2.jsx";
import ModernCarousel from "../Components/Carousel.jsx";
import Footer from "../Components/Footer.jsx";

const Home = () => {
  const [navDone, setNavDone] = useState(false);

  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col">
      <NavBar onScrolled={() => setNavDone(true)} />
      <div
        className={
          navDone
            ? "relative w-full h-screen pointer-events-none"
            : "fixed top-0 left-0 w-full h-screen z-1 pointer-events-none"
        }
      >
      </div>
      <ModernCarousel />
      <br />
      <br />
      <div className="mt-auto"><Footer /></div>
    </div>
  );
};

export default Home;