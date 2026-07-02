import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";

import StickyIngredientStage from "../Components/Ingredients/StickyIngredientStage.jsx";
import NavBar2 from "../Components/NavBar2.jsx";
import { ingredients as staticIngredients } from "../Components/Ingredients/ingredientsData.js";
import ProductReveal from "../Components/Ingredients/ProductReveal.jsx";
import ingredientService from "../services/ingredientService.js";
import { fonts } from "../theme/theme.js";

const Ingredients = () => {
  const scrollRef = useRef(null);
  const [ingredientsList, setIngredientsList] = useState(staticIngredients);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await ingredientService.getPublicIngredients();
        if (data && data.ingredients && data.ingredients.length > 0) {
          const mapped = data.ingredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            scientificName: ing.scientific_name,
            image: ing.image_url,
            leftText: ing.para1,
            rightTextOne: ing.para2,
            rightTextTwo: ing.para3,
          }));
          setIngredientsList(mapped);
        }
      } catch (err) {
        console.error(
          "Failed to load ingredients, using static fallback:",
          err,
        );
      }
    };
    fetchIngredients();
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const potScale = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.85]);
  const potOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);
  const potY = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    ["0vh", "0vh", "-2vh"],
  );

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-black">
      <NavBar2 />

      <section className="relative min-h-screen overflow-hidden px-6 pt-32">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.45em] text-neutral-500" style={{ fontFamily: fonts.secondary }}>
            Ingredients
          </p>

          <h1 className="max-w-4xl font-serif text-6xl leading-none md:text-8xl">
            Every ingredient enters the brew with intention.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-700" style={{ fontFamily: fonts.secondary }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. The scroll
            below shows each ingredient entering the central brewing pot.
          </p>
        </div>
      </section>

      <section
        ref={scrollRef}
        style={{
          height: `${ingredientsList.length * 300}vh`,
        }}
        className="relative bg-[#f7f3ec]"
      >
        <StickyIngredientStage
          ingredientsList={ingredientsList}
          scrollYProgress={scrollYProgress}
          potY={potY}
          potScale={potScale}
          potOpacity={potOpacity}
        />
      </section>

      <ProductReveal />
    </main>
  );
};

export default Ingredients;
