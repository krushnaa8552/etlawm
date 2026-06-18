import { Link } from "react-router-dom";

const MiniLogo = () => {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]">
      <span className="h-2 w-2 rounded-full bg-[#68B7AA]" />
      <span>ETLAWM</span>
    </div>
  );
};

const HeroLandscape = () => {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 320"
        className="h-[210px] w-full md:h-[280px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 235C143 212 235 179 384 194C531 209 612 266 760 247C946 223 1033 120 1219 132C1315 138 1378 170 1440 198V320H0V235Z"
          fill="#F0E8DA"
        />
        <path
          d="M0 245C129 222 234 198 380 210C545 224 598 269 750 257C926 243 1012 151 1198 153C1302 154 1370 183 1440 214"
          stroke="#171715"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="4 7"
        />
        <path
          d="M45 255C88 224 120 218 171 227C230 238 252 271 310 263C379 253 393 206 462 207C529 208 551 252 618 254C697 256 717 203 796 193C895 181 948 249 1049 226C1152 203 1169 126 1272 132C1336 136 1389 168 1440 197"
          stroke="#171715"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <g stroke="#171715" strokeWidth="1.7" strokeLinecap="round">
          <path d="M120 243V172" />
          <path d="M120 172L91 230" />
          <path d="M120 172L151 230" />
          <path d="M120 191L101 233" />
          <path d="M120 191L141 233" />

          <path d="M171 237V156" />
          <path d="M171 156L137 229" />
          <path d="M171 156L205 229" />
          <path d="M171 181L148 232" />
          <path d="M171 181L193 232" />

          <path d="M1260 181V88" />
          <path d="M1260 88L1218 173" />
          <path d="M1260 88L1304 173" />
          <path d="M1260 119L1231 177" />
          <path d="M1260 119L1289 177" />

          <path d="M1324 205V126" />
          <path d="M1324 126L1287 198" />
          <path d="M1324 126L1360 198" />
        </g>

        <path
          d="M722 148C754 106 800 86 840 94C890 104 916 156 895 200C874 243 814 249 775 219C739 191 696 182 722 148Z"
          fill="#C94131"
          stroke="#171715"
          strokeWidth="2"
        />
        <path
          d="M802 218C797 241 793 263 790 292"
          stroke="#171715"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M790 292C782 275 775 267 761 260"
          stroke="#171715"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M790 292C800 276 811 268 827 263"
          stroke="#171715"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const HomeHero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F3EC] px-5 pt-28 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#171715]/20 pb-4">
        <MiniLogo />

        <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-[#171715]/70 md:flex">
          <span>Skin rituals</span>
          <span>Hair care</span>
          <span>Daily essentials</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-6xl flex-col items-center justify-center text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.36em] text-[#68B7AA]">
          Ayurvedic care, simplified
        </p>

        <h1
          className="max-w-5xl text-[clamp(3.2rem,8vw,8.8rem)] font-normal leading-[0.82] tracking-[-0.08em]"
          style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
        >
          A ritual roadmap
          <br />
          for every day.
        </h1>

        <p className="mt-7 max-w-xl text-sm leading-7 text-[#171715]/70 md:text-base">
          Build your routine through calm formulas, essential ingredients, and
          products made to sit naturally inside your daily rhythm.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/collection"
            className="rounded-full bg-[#68B7AA] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(104,183,170,0.28)] transition hover:-translate-y-0.5 hover:bg-[#579f94]"
          >
            Shop collection
          </Link>

          <Link
            to="/ritual"
            className="rounded-full border border-[#171715]/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#171715] transition hover:-translate-y-0.5 hover:border-[#171715]"
          >
            Find a ritual
          </Link>
        </div>
      </div>

      <HeroLandscape />
    </section>
  );
};

export default HomeHero;