import KettleSVG from "../Components/KettleSVG.jsx";
import SvgComponent from "../Components/KettleSVG2.jsx";
import kettle from '../assets/kettle2.svg';

const Ritual = () => {
  return (
    <div>
      <section
        className="relative min-h-[200vh]"
        style={{
          backgroundColor: "#d8d8d8",
        }}
      >
        <div className="sticky top-0 z-10 w-screen h-screen flex items-center justify-center overflow-hidden">
          <KettleSVG className="w-full h-full object-contain" />
          {/* <SvgComponent />*/}
          <img src={kettle}/>
        </div>

        <div className="h-screen flex items-center justify-center text-4xl">
          akjdsf
        </div>
      </section>
    </div>
  );
};

export default Ritual;