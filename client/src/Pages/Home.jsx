import NavBar from "../Components/NavBar2.jsx";
import HeroBanner2 from "../Components/HomePage/HeroBanner2.jsx";
import IngredientsShowcase from "../Components/HomePage/IngredientsShowcase.jsx";
import FeaturedProducts from "../Components/HomePage/FeaturedProducts.jsx";
import Philosophy2 from "../Components/HomePage/Philosophy2.jsx";
import Footer2 from "../Components/Footer2.jsx";
import ReviewPanel from "../Components/HomePage/ReviewPanel.jsx";

const Home = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col bg-[#F7F3EC]">
      {/* Retained NavBar */}
      <NavBar />

      {/* New Creative Hero Banner */}
      <HeroBanner2 />
      <br />

      {/* Interactive Ingredients Showcase */}
      <IngredientsShowcase />

      {/* Curated Best Sellers Grid */}
      <FeaturedProducts />

      {/* Retained ReviewPanel wrapped in Parallax */}
      
      <ReviewPanel />
      


      {/* Remade Philosophy Panel */}
      <Philosophy2 />

      {/* Remade Footer */}
      <div className="mt-auto">
        <Footer2 />
      </div>
    </div>
  );
};

export default Home;
