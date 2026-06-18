const HomeQuestions = () => {
  return (
    <section className="bg-[#F7F3EC] px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#68B7AA]">
            Questions
          </p>

          <h2
            className="text-5xl font-normal leading-[0.9] tracking-[-0.06em] md:text-7xl"
            style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
          >
            Have any questions?
          </h2>

          <form className="mt-10 space-y-5">
            <input
              type="text"
              placeholder="Name"
              className="w-full border-0 border-b border-[#171715]/35 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#171715]/45 focus:border-[#171715]"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border-0 border-b border-[#171715]/35 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#171715]/45 focus:border-[#171715]"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border-0 border-b border-[#171715]/35 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#171715]/45 focus:border-[#171715]"
            />

            <textarea
              placeholder="Message"
              rows="4"
              className="w-full resize-none border-0 border-b border-[#171715]/35 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#171715]/45 focus:border-[#171715]"
            />

            <button
              type="submit"
              className="rounded-full bg-[#68B7AA] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#579f94]"
            >
              Send message
            </button>
          </form>

          <p className="mt-5 max-w-md text-xs leading-6 text-[#171715]/50">
            This is only the frontend form. Connect it to your backend contact
            API when that route is ready.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md bg-[#FFF7E7] p-10 shadow-[0_22px_80px_rgba(23,23,21,0.08)]">
            <svg
              viewBox="0 0 420 520"
              className="h-auto w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M132 175C132 145 155 125 188 125H231C264 125 288 145 288 175V411C288 441 264 461 231 461H188C155 461 132 441 132 411V175Z"
                fill="#F7F3EC"
                stroke="#171715"
                strokeWidth="3"
              />
              <path
                d="M158 198H262M158 225H262M158 252H262"
                stroke="#171715"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M176 317C200 300 226 300 250 317"
                stroke="#171715"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M126 169H294"
                stroke="#171715"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M188 124C192 93 209 72 240 62C274 51 304 63 330 92"
                stroke="#171715"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M246 60C247 97 226 123 189 137"
                stroke="#171715"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M248 59C279 84 291 113 284 145"
                stroke="#171715"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M109 469C161 451 239 450 312 469"
                stroke="#171715"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 8"
              />
              <text
                x="210"
                y="368"
                textAnchor="middle"
                fill="#171715"
                fontFamily="Georgia, serif"
                fontSize="32"
              >
                Questions
              </text>
              <text
                x="210"
                y="398"
                textAnchor="middle"
                fill="#171715"
                fontFamily="Georgia, serif"
                fontSize="24"
              >
                Jar
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeQuestions;