import { motion } from "framer-motion";

import BreweryPotPlaceholder from "./BreweryPotPlaceholder.jsx";
import IngredientScene from "./IngredientScene.jsx";

const StickyIngredientStage = ({
  ingredientsList,
  scrollYProgress,
  potY,
  potScale,
  potOpacity,
}) => {
  return (
    <div className="sticky top-0 h-screen overflow-hidden">
      <motion.div
        style={{
          y: potY,
          scale: potScale,
          opacity: potOpacity,
          transformOrigin: "left bottom",
        }}
        className="absolute bottom-[3vh] left-[3.5vw] z-[45] w-[380px] max-w-[42vw]"
      >
        <BreweryPotPlaceholder
          scrollProgress={scrollYProgress}
          total={ingredientsList.length}
          className="h-auto w-full"
        />
      </motion.div>

      {ingredientsList.map((ingredient, index) => (
        <IngredientScene
          key={ingredient.id}
          ingredient={ingredient}
          index={index}
          total={ingredientsList.length}
          scrollProgress={scrollYProgress}
        />
      ))}
    </div>
  );
};

export default StickyIngredientStage;