import React from "react";
import { MapPin, Package, MessageCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose Destination",
      desc: "Pick your perfect weekend escape.",
      icon: <MapPin size={16} />,
    },
    {
      num: "02",
      title: "Build Package",
      desc: "Add stays, rentals, and experiences.",
      icon: <Package size={16} />,
    },
    {
      num: "03",
      title: "Contact Directly",
      desc: "Connect instantly with local hosts.",
      icon: <MessageCircle size={16} />,
    },
  ];

  return (
    <section
      className="
        relative
        py-16
        bg-[#060816]
        overflow-hidden
      "
    >
      {/* AMBIENT BACKGROUND */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-cyan-500/10 blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <span
            className="
              inline-block
              px-4 py-2
              rounded-full
              border border-white/10
              bg-white/[0.03]
              text-white/45
              text-[11px]
              uppercase
              tracking-[0.25em]
              mb-5
            "
          >
            Simple Process
          </span>

          <h2
            className="
              text-3xl
              md:text-4xl
              font-black
              tracking-tight
              text-[#ebe7e1]
              mb-4
            "
          >
            Plan Your Weekend
            <br />
            In Minutes
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              text-white/45
              text-[15px]
              leading-relaxed
            "
          >
            Discover destinations, connect with locals,
            and build unforgettable travel experiences
            without complicated booking flows.
          </p>
        </div>

        {/* COMPACT LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {steps.map((step, i) => (
            <div
              key={i}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
                p-6
                transition-all duration-500
                hover:-translate-y-1
                hover:bg-white/[0.05]
              "
            >
              {/* HOVER GLOW */}
              <div
                className="
                  absolute inset-0 opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-500
                  bg-gradient-to-br
                  from-orange-500/10
                  to-cyan-500/10
                "
              />

              {/* STEP NUMBER */}
              <div
                className="
                  relative z-10
                  flex items-center justify-between
                  mb-5
                "
              >
                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    flex items-center justify-center
                    bg-orange-500/10
                    border border-orange-400/20
                    text-orange-300
                  "
                >
                  {step.icon}
                </div>

                <span
                  className="
                    text-white/20
                    text-xl
                    font-black
                  "
                >
                  {step.num}
                </span>
              </div>

              {/* TITLE */}
              <h3
                className="
                  relative z-10
                  text-[#ebe7e1]
                  text-lg
                  font-semibold
                  mb-2
                "
              >
                {step.title}
              </h3>

              {/* DESC */}
              <p
                className="
                  relative z-10
                  text-white/45
                  text-sm
                  leading-relaxed
                "
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}