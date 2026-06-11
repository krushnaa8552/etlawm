import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { colours, fonts } from "../../theme/theme";

const principles = [
  {
    number: "01",
    title: "Fewer ingredients",
    description:
      "Every ingredient must earn its place. Nothing unnecessary, nothing added for appearance alone.",
  },
  {
    number: "02",
    title: "Nature, refined",
    description:
      "We preserve the strength of botanicals while refining them into effective everyday formulations.",
  },
  {
    number: "03",
    title: "Results over trends",
    description:
      "Our products are built around consistency, clarity and measurable care—not temporary attention.",
  },
];

// forwardRef so Home.jsx can attach a ref and drive the snap scroll
const Philosophy = forwardRef(function Philosophy(props, ref) {
  return (
    <section
      ref={ref}
      className="relative isolate flex h-screen h-[100svh] scroll-mt-0 items-center overflow-hidden bg-black px-6 text-white sm:px-10 lg:px-16"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-white/[0.025] blur-3xl" />

        <p className="absolute right-[-2rem] top-1/2 hidden -translate-y-1/2 select-none text-[13rem] font-black leading-none tracking-[-0.08em] text-white/[0.018] xl:block">
          PURE
        </p>

        <div className="absolute bottom-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px]">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-[#a68b5b]" />

          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b89b69]">
            Our Philosophy
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Left */}
          <div>
            <h2 className="max-w-4xl text-[clamp(3.5rem,7vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.07em]">
              <span className="block">Less is more.</span>

              <span className="mt-3 block text-[#4b5565]">
                Pure is better.
              </span>
            </h2>

            <div className="mt-10 grid gap-6 border-l border-white/15 pl-6 sm:grid-cols-2">
              <p className="max-w-md text-sm leading-7 text-[#9299a5] lg:text-base">
                Etlawm was founded on a simple belief: nature already provides
                what effective care needs. Our work begins by removing what
                does not belong.
              </p>

              <p className="max-w-md text-sm leading-7 text-[#9299a5] lg:text-base">
                Every formula is intentionally considered, carefully refined
                and created to deliver results without unnecessary complexity.
              </p>
            </div>

            <Link
              to="/collection"
              className="group mt-8 inline-flex items-center gap-8 rounded-md border border-white/20 px-7 py-4 text-sm font-semibold transition duration-300 hover:border-[#b89b69] hover:bg-[#b89b69] hover:text-black"
            >
              Explore the Collection

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="divide-y divide-white/10 border-y border-white/10">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="group relative gap-4 overflow-hidden py-6 sm:grid-cols-[55px_1fr]"
              >
                <div className="absolute inset-0 origin-left scale-x-0 bg-white/[0.035] transition-transform duration-500 group-hover:scale-x-100" />

                <div className="relative px-4 cursor-pointer">
                  <div className="relative flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-medium tracking-[-0.03em]">
                      {principle.title}
                    </h3>
                  </div>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-[#858c98]">
                    {principle.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Philosophy;