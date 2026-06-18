import NavBar from "../Components/NavBar2.jsx";
import HomeHero from "../Components/HomePage/HomeHero.jsx";
import HomeDirections from "../Components/HomePage/HomeDirections.jsx";
import HomePathways from "../Components/HomePage/HomePathways.jsx";
import HomePrinciples from "../Components/HomePage/HomePrinciples.jsx";
import HomeInsights from "../Components/HomePage/HomeInsights.jsx";
import HomeSupport from "../Components/HomePage/HomeSupport.jsx";
import HomeQuestions from "../Components/HomePage/HomeQuestions.jsx";
import HomeFinalCTA from "../Components/HomePage/HomeFinalCTA.jsx";
import HomeFooter from "../Components/HomePage/HomeFooter.jsx";
import Philosophy from "../Components/HomePage/Philosophy3.jsx";

const Home = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F3EC] text-[#171715]">
      <NavBar />

      <main>
        <HomeHero />
        <HomeDirections />
        <Philosophy />
        <HomePathways />
        <HomePrinciples />
        <HomeInsights />
        <HomeSupport />
        <HomeQuestions />
        <HomeFinalCTA />
      </main>

      <HomeFooter />
    </div>
  );
};

export default Home;