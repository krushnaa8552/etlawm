import NavBar from "../Components/NavBar.jsx";
// import NavHome from "../Components/NavHome.jsx";
import ModernCarousel from "../Components/HomePage/Carousel.jsx";
import Footer from "../Components/Footer.jsx";
import ReviewPanel from "../Components/HomePage/ReviewPanel.jsx";

const Home = () => {
  // const [navDone, setNavDone] = useState(false);

  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col">
      {/* <NavBar onScrolled={() => setNavDone(true)} />*/}
      <NavBar />
      {/* <div
        className={
          navDone
            ? "relative w-full h-screen pointer-events-none"
            : "fixed top-0 left-0 w-full h-screen z-1 pointer-events-none"
        }
      >
      </div>*/}
      <ModernCarousel />
      <br />
        <ReviewPanel />
      <br />
      {/* <InfiniteCarousel />*/}
      <br />
      <div className="mt-auto"><Footer /></div>
    </div>
  );
};

export default Home;