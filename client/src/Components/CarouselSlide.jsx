import stock1 from "../assets/stock/stock1.jpg";
import stock2 from "../assets/stock/stock2.jpg";
import stock3 from "../assets/stock/stock3.jpg";
import stock4 from "../assets/stock/stock4.jpg";
import stock5 from "../assets/stock/stock5.jpg";
import stock6 from "../assets/stock/stock6.jpg";

const images = [stock1, stock2, stock3, stock4, stock5, stock6];

const CarouselSlide = () => {
  return (
    <div className="mx-auto my-[100px] w-[90%] overflow-hidden">
      {/* <div className="flex w-max gap-4 ">*/}
      <div className="flex w-max animate-[scroll_10s_linear_infinite] gap-4 pl-4">
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="h-[360px] w-[200px] shrink-0 overflow-hidden rounded-[0.2em]"
          >
            <img
              src={image}
              alt="Stock product"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselSlide;