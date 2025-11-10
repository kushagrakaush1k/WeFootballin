"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// SPONSOR LOGOS (add/remove as needed)
const sponsors = [
  {
    name: "LUPLU",
    logo: "/images/luplu-logo.png",
    darkBg: true,
  },
  {
    name: "XTCY",
    logo: "/images/XTCY-logo.png",
    darkBg: false,
  },
  {
    name: "LOOKS SALON",
    logo: "/images/Looks-salon-logo.png",
    darkBg: false,
  },
  {
    name: "IKIGAI",
    logo: "/images/ikigai-logo.png",
    darkBg: false,
  },
  {
    name: "DELHI HEIGHTS",
    logo: "/images/delhi-heights-logo.png",
    darkBg: false,
  },
  {
    name: "ROYAL GREEN",
    logo: "/images/royal-green-logo.png",
    darkBg: false,
  },
];

export default function SponsorsSection() {
  return (
    <section className="bg-[#f7faf8] py-28 px-0 w-full overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-6 py-2 flex flex-col items-center">
        <h2
          className="uppercase font-black text-4xl md:text-5xl mb-3 tracking-tight"
          style={{
            color: "#356f35",
            letterSpacing: "0.03em",
            textShadow: "0 2px 24px #356f3533",
          }}
        >
          Our Official Partners
        </h2>
        <p className="text-lg md:text-2xl mb-12 text-[#3e6142] font-semibold text-center">
          Proudly funded and supported by these amazing brands
        </p>
      </div>

      <LogosSlideshow />
    </section>
  );
}

function LogosSlideshow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5; // Adjust for slower/faster

    const scroll = () => {
      if (!isPaused.current && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Reset to beginning when scrolled halfway (seamless loop)
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  return (
    <div
      className="relative py-2 overflow-hidden w-full"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0px, #000 60px, #000 calc(100% - 60px), transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0px, #000 60px, #000 calc(100% - 60px), transparent 100%)",
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-16 overflow-x-hidden whitespace-nowrap"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {/* Triple the sponsors for seamless infinite loop */}
        {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
          <div
            key={`${sponsor.name}-${index}`}
            className="flex flex-col items-center justify-center flex-shrink-0"
            style={{ minWidth: "200px" }}
          >
            <div
              className="flex items-center justify-center transition-transform hover:scale-105"
              style={{
                background: "#1a1a1a",
                borderRadius: 20,
                height: 110,
                width: 190,
                boxShadow: "0 4px 20px rgba(53, 111, 53, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={130}
                height={85}
                style={{
                  objectFit: "contain",
                  filter: "brightness(1.1) contrast(1.05)",
                }}
                className="w-[130px] h-[85px]"
              />
            </div>
            <span
              className="mt-4 text-sm font-extrabold uppercase tracking-wide text-center px-4 py-2 rounded-lg"
              style={{
                color: "#ffffff",
                background: "#1a1a1a",
                letterSpacing: "0.05em",
                boxShadow: "0 2px 12px rgba(53, 111, 53, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {sponsor.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
