import NavBar from "../Components/NavBar2.jsx";
import ModernCarousel from "../Components/HomePage/Carousel.jsx";
import Philosophy from "../Components/HomePage/Philosophy.jsx";
import Footer from "../Components/Footer.jsx";
import ReviewPanel from "../Components/HomePage/ReviewPanel.jsx";
import { Parallax } from 'react-scroll-parallax';

const Home = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col">
      <NavBar />

      <ModernCarousel />

      <br />

      <Parallax speed={10} >
        <ReviewPanel />
      </Parallax>

      
      <br />
      <Philosophy />
      <br />

      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Home;