import { Link } from "react-router-dom";

const articles = [
  {
    label: "Guide",
    title: "How to build a basic routine without using too many products",
    text: "A simple order for cleansing, treating, hydrating, and finishing.",
    large: true,
  },
  {
    label: "Ingredients",
    title: "Why gentle formulas matter for daily use",
    text: "How mild care helps consistency.",
  },
  {
    label: "Ritual",
    title: "Morning care versus night care",
    text: "What to keep different and what can stay the same.",
  },
];

const ArticleImage = ({ large = false }) => {
  return (
    <div
      className={`relative overflow-hidden border border-[#171715]/15 bg-[#EAF3F7] ${
        large ? "aspect-[1.45/1]" : "aspect-[1.6/1]"
      }`}
    >
      <svg
        viewBox="0 0 500 320"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="500" height="320" fill="#EAF3F7" />
        <circle cx="260" cy="128" r="82" fill="#FFF8EC" stroke="#171715" />
        <path
          d="M170 201C226 173 289 173 351 202"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M190 222C230 204 286 202 332 223"
          stroke="#171715"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="4 8"
        />
        <path
          d="M121 247C194 222 288 224 379 249"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M235 112C246 94 269 89 286 101C303 113 303 139 288 153C270 170 237 154 230 133"
          fill="#E6B9A4"
          stroke="#171715"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  );
};

const HomeInsights = () => {
  return (
    <section className="bg-[#F7F3EC] px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl border-y border-[#171715]/20 py-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#68B7AA]">
              Notes from the shelf
            </p>

            <h2
              className="text-6xl font-normal leading-none tracking-[-0.08em] md:text-8xl"
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            >
              INSIGHTS
            </h2>
          </div>

          <p className="hidden text-4xl font-light tracking-[-0.04em] md:block">
            2026
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Link
            to="/blogs"
            className="group block border border-[#171715]/20 bg-[#FFFDF8] p-4 transition hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(23,23,21,0.1)]"
          >
            <ArticleImage large />

            <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#68B7AA]">
              {articles[0].label}
            </p>

            <h3
              className="mt-2 text-4xl font-normal leading-none tracking-[-0.04em] group-hover:underline"
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            >
              {articles[0].title}
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#171715]/70">
              {articles[0].text}
            </p>
          </Link>

          <div className="grid gap-6">
            {articles.slice(1).map((item) => (
              <Link
                key={item.title}
                to="/blogs"
                className="group block border border-[#171715]/20 bg-[#FFFDF8] p-4 transition hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(23,23,21,0.1)]"
              >
                <ArticleImage />

                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[#68B7AA]">
                  {item.label}
                </p>

                <h3
                  className="mt-2 text-3xl font-normal leading-none tracking-[-0.04em] group-hover:underline"
                  style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
                >
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#171715]/70">
                  {item.text}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/blogs"
            className="inline-flex rounded-full bg-[#68B7AA] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#579f94]"
          >
            Read more
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeInsights;