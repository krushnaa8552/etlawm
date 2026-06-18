import { forwardRef } from "react";
import { Link } from "react-router-dom";

const principles = [
  {
    number: "01",
    title: "Fewer ingredients",
    description:
      "Every ingredient must earn its place. Nothing unnecessary, nothing added only to make the label look impressive.",
  },
  {
    number: "02",
    title: "Nature, refined",
    description:
      "We keep the strength of botanicals, then refine them into formulas that feel practical for everyday use.",
  },
  {
    number: "03",
    title: "Results over trends",
    description:
      "Our products are built around steady care, clear purpose, and consistency rather than temporary attention.",
  },
];

const PhilosophySketch = () => {
  return (
    <div className="relative aspect-[1.15/1] w-full overflow-hidden bg-[#FFF8EA] shadow-[0_20px_80px_rgba(23,23,21,0.08)]">
      <svg
        viewBox="0 0 520 460"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="520" height="460" fill="#FFF8EA" />

        <path
          d="M68 365C129 327 201 317 275 339C354 363 420 354 474 314"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M78 389C163 363 244 362 327 381C391 396 438 390 486 368"
          stroke="#171715"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 8"
        />

        <path
          d="M177 169C177 133 205 109 247 109H292C334 109 363 133 363 169V326C363 362 334 386 292 386H247C205 386 177 362 177 326V169Z"
          fill="#F7F3EC"
          stroke="#171715"
          strokeWidth="3"
        />

        <path
          d="M174 166H366"
          stroke="#171715"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M208 197H329M208 223H317M208 249H330"
          stroke="#171715"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M232 307C255 292 285 292 308 307"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M260 104C264 66 286 42 326 33C365 24 397 41 422 74"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M329 33C329 75 305 102 262 118"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M329 33C365 62 378 94 367 131"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M98 317V220"
          stroke="#171715"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M98 220L58 308M98 220L139 308M98 253L70 313M98 253L126 313"
          stroke="#171715"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M419 326V232"
          stroke="#171715"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M419 232L380 318M419 232L459 318M419 262L393 322M419 262L445 322"
          stroke="#171715"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M401 165C419 140 449 130 474 138C502 147 516 176 503 201C490 226 453 231 429 213C408 197 386 188 401 165Z"
          fill="#C94131"
          stroke="#171715"
          strokeWidth="2"
        />

        <path
          d="M451 214C448 239 445 260 444 288"
          stroke="#171715"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M83 94C134 64 192 52 251 64C306 75 345 103 399 92"
          stroke="#171715"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 9"
        />

        <text
          x="270"
          y="340"
          textAnchor="middle"
          fill="#171715"
          fontFamily="Georgia, serif"
          fontSize="28"
        >
          Care
        </text>
      </svg>
    </div>
  );
};

const PrincipleCard = ({ principle }) => {
  return (
    <article className="group relative overflow-hidden border-t border-[#171715]/20 py-7">
      <div className="absolute inset-0 origin-left scale-x-0 bg-[#FFF8EA] transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative grid gap-4 sm:grid-cols-[72px_1fr]">
        <p className="text-xs uppercase tracking-[0.3em] text-[#68B7AA]">
          {principle.number}
        </p>

        <div>
          <h3
            className="text-3xl font-normal leading-none tracking-[-0.04em] md:text-4xl"
            style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
          >
            {principle.title}
          </h3>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#171715]/68">
            {principle.description}
          </p>
        </div>
      </div>
    </article>
  );
};

const Philosophy = forwardRef(function Philosophy(props, ref) {
  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[#F7F3EC] px-5 py-24 text-[#171715] md:px-10 md:py-28 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-40 w-full bg-[linear-gradient(to_bottom,rgba(255,253,248,0.8),transparent)]" />

        <p
          className="absolute -right-8 top-10 hidden select-none text-[11rem] font-normal leading-none tracking-[-0.1em] text-[#171715]/[0.035] xl:block"
          style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
        >
          PURE
        </p>

        <svg
          viewBox="0 0 900 260"
          className="absolute bottom-0 left-1/2 h-52 w-[900px] -translate-x-1/2 opacity-40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 190C120 151 225 151 330 180C438 209 524 213 632 172C735 133 819 135 886 166"
            stroke="#171715"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="4 9"
          />
          <path
            d="M3 217C134 191 284 196 414 222C548 249 720 237 897 196"
            stroke="#171715"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.34em] text-[#68B7AA]">
              Our philosophy
            </p>

            <h2
              className="text-[clamp(3.5rem,7vw,7.8rem)] font-normal leading-[0.82] tracking-[-0.08em]"
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            >
              Less is more.
              <br />
              Pure is better.
            </h2>
          </div>

          <div className="max-w-xl lg:ml-auto">
            <p className="text-sm leading-7 text-[#171715]/70 md:text-base">
              Etlawm begins with a simple idea: care should feel clear, useful,
              and repeatable. We remove what does not belong, keep what serves
              the formula, and build products that fit into a daily ritual
              without making the routine heavier.
            </p>

            <Link
              to="/collection"
              className="mt-7 inline-flex rounded-full bg-[#68B7AA] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(104,183,170,0.22)] transition hover:-translate-y-0.5 hover:bg-[#579f94]"
            >
              Explore collection
            </Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <PhilosophySketch />

          <div className="border-b border-[#171715]/20">
            {principles.map((principle) => (
              <PrincipleCard key={principle.number} principle={principle} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Philosophy;