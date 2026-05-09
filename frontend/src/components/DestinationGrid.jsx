import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { DESTINATIONS } from "../lib/api";

export default function DestinationGrid({ onSelect }) {

  const getCrowdStyles = (level) => {
    switch (level) {
      case "low":
        return {
          text: "Peaceful",
          dot: "bg-emerald-400",
          badge:
            "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
        };

      case "medium":
        return {
          text: "Moderate",
          dot: "bg-amber-400",
          badge:
            "bg-amber-500/15 text-amber-200 border-amber-400/20",
        };

      case "high":
        return {
          text: "Popular",
          dot: "bg-rose-400",
          badge:
            "bg-rose-500/15 text-rose-200 border-rose-400/20",
        };

      default:
        return {
          text: "Unknown",
          dot: "bg-slate-400",
          badge:
            "bg-slate-500/15 text-slate-200 border-slate-400/20",
        };
    }
  };

  return (
    <section
      id="destinations"
      className="
        relative
        overflow-hidden
        py-24
        text-white
        bg-[#050816]
      "
    >
      {/* CLEAN 4K NATURE BACKGROUND */}
      <div className="absolute inset-0 z-0">

        {/* BACKGROUND IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=100"
          alt="Nature background"
          className="
            w-full
            h-full
            object-cover
          "
        />

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 bg-black/55" />

        {/* CINEMATIC GRADIENT */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-[#050816]/40
            via-[#050816]/55
            to-[#050816]
          "
        />
      </div>

      {/* SOFT GLOW */}
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-cyan-500/10 blur-[160px]" />

      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-orange-500/10 blur-[160px]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">

          {/* LABEL */}
          <div
            className="
              inline-flex
              items-center gap-2
              px-4 py-2
              rounded-full
              border border-white/10
              bg-white/[0.05]
              backdrop-blur-xl
              mb-6
            "
          >
            <Sparkles size={13} className="text-orange-300" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-white/50
                font-semibold
              "
            >
              Trending Destinations
            </span>
          </div>

          {/* TITLE */}
          <h2
            className="
              text-4xl
              md:text-6xl
              font-black
              leading-[1]
              tracking-tight
              text-[#f3eee8]
              mb-6
            "
          >
            Discover Beautiful
            <br />
            Weekend Escapes.
          </h2>

          {/* DESC */}
          <p
            className="
              max-w-2xl
              mx-auto
              text-[15px]
              md:text-lg
              leading-relaxed
              text-[#d2cbc2]
            "
          >
            Explore peaceful mountains, hidden forests,
            tropical beaches, and breathtaking destinations
            crafted for unforgettable travel experiences.
          </p>
        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-7
          "
        >
          {DESTINATIONS.map((dest) => {
            const crowd = getCrowdStyles(dest.crowdLevel);

            return (
              <div
                key={dest.id}
                onClick={() => onSelect(dest)}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border border-white/10
                  bg-black/30
                  backdrop-blur-2xl
                  cursor-pointer
                  transition-all duration-700
                  hover:-translate-y-2
                  hover:border-white/20
                  hover:bg-black/40
                  hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]
                "
              >
                {/* IMAGE SECTION */}
                <div className="relative overflow-hidden aspect-[4/3]">

                  {/* IMAGE */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform duration-[2000ms]
                      group-hover:scale-105
                    "
                  />

                  {/* IMAGE OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                  {/* CROWD BADGE */}
                  <div
                    className={`
                      absolute top-5 right-5
                      flex items-center gap-2
                      px-4 py-2
                      rounded-full
                      border
                      backdrop-blur-xl
                      text-xs font-semibold
                      ${crowd.badge}
                    `}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${crowd.dot}`}
                    />

                    {crowd.text}
                  </div>

                  {/* TEXT */}
                  <div className="absolute bottom-0 left-0 p-6">

                    <div className="flex items-center gap-3 mb-3">

                      <h3
                        className="
                          text-3xl
                          font-black
                          tracking-tight
                          text-[#f3eee8]
                        "
                      >
                        {dest.name}
                      </h3>

                      <span
                        className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                          text-white/50
                        "
                      >
                        {dest.state}
                      </span>
                    </div>

                    <p
                      className="
                        text-[#d2cbc2]
                        text-sm
                        leading-relaxed
                        max-w-sm
                      "
                    >
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* BOTTOM */}
                <div
                  className="
                    flex items-center justify-between
                    px-6 py-5
                    border-t border-white/10
                  "
                >
                  <div>
                    <p
                      className="
                        text-white/35
                        text-xs
                        uppercase
                        tracking-[0.2em]
                      "
                    >
                      Weekend Experience
                    </p>

                    <h4 className="text-white font-semibold mt-1">
                      Explore Options
                    </h4>
                  </div>

                  {/* STATIC BUTTON */}
                  <div
                    className="
                      w-12 h-12
                      rounded-2xl
                      flex items-center justify-center
                      bg-white/[0.05]
                      border border-white/10
                      text-white/50
                      transition-all duration-500
                      group-hover:bg-orange-500
                      group-hover:text-white
                    "
                  >
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}