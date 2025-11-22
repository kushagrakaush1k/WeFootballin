"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";

const sponsors = [
  {
    name: "LUPLU",
    logo: "/images/luplu-logo.png",
    link: "https://luplu.com",
    darkBg: true,
  },
  {
    name: "XTCY",
    logo: "/images/XTCY-logo.png",
    link: "https://xtcy.com",
    darkBg: false,
  },
  {
    name: "LOOKS SALON",
    logo: "/images/Looks-salon-logo.png",
    link: "https://www.lookssalon.in",
    darkBg: false,
  },
  {
    name: "IKIGAI",
    logo: "/images/ikigai-logo.png",
    link: "https://www.instagram.com/ikigaicdh?igsh=MXBxZ2lqNDQxYXZ4Yg==",
    darkBg: false,
  },
  {
    name: "DELHI HEIGHTS",
    logo: "/images/delhi-heights-logo.png",
    link: "https://stores.cafedelhiheights.com",
    darkBg: false,
  },
  {
    name: "ROYAL GREEN",
    logo: "/images/royal-green-logo.png",
    link: "https://www.instagram.com/royalgreenspirits?igsh=N3hmNWZscW9weTFu",
    darkBg: false,
  },
];

export default function SponsorsSection() {
  return (
    <section className="bg-[#f7faf8] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 w-full overflow-hidden select-none">
      <div className="max-w-6xl mx-auto mb-10 sm:mb-14 flex flex-col items-center">
        <h2
          className="uppercase font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 tracking-tight text-center px-4"
          style={{
            color: "#356f35",
            letterSpacing: "0.03em",
            textShadow: "0 2px 24px #356f3533",
          }}
        >
          Our Official Partners
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#3e6142] font-semibold text-center px-4">
          Proudly supported by these amazing brands
        </p>
      </div>
      <LogosSlideshow />
    </section>
  );
}

function LogosSlideshow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const scrollSpeed = 0.7;
    let scrollPosition = 0;
    const firstChild = scrollContainer.firstElementChild as HTMLElement;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth;
    const gap = 64;
    const singleSetWidth = (itemWidth + gap) * sponsors.length;
    const scroll = () => {
      if (!isPaused.current && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= singleSetWidth) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = Math.floor(scrollPosition);
      }
      animationRef.current = requestAnimationFrame(scroll);
    };
    animationRef.current = requestAnimationFrame(scroll);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    isPaused.current = true;
  };
  const handleMouseLeave = () => {
    isPaused.current = false;
  };
  const handleSponsorClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="relative py-2 overflow-hidden w-full"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0px, #000 40px, #000 calc(100% - 40px), transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0px, #000 40px, #000 calc(100% - 40px), transparent 100%)",
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-8 sm:gap-12 md:gap-16 overflow-x-hidden whitespace-nowrap"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map(
          (sponsor, index) => (
            <button
              key={`${sponsor.name}-${index}`}
              onClick={() => handleSponsorClick(sponsor.link)}
              className="flex flex-col items-center justify-center flex-shrink-0 cursor-pointer group"
              style={{ minWidth: "150px" }}
              aria-label={`Visit ${sponsor.name}`}
            >
              <div
                className="flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                  borderRadius: 16,
                  height: 90,
                  width: 150,
                  boxShadow: "0 4px 20px rgba(53, 111, 53, 0.25)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={110}
                  height={70}
                  style={{
                    objectFit: "contain",
                    filter: "brightness(1.1) contrast(1.05)",
                  }}
                  className="w-[110px] h-[70px] transition-all duration-300 group-hover:brightness-125"
                />
              </div>
              <span
                className="mt-3 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 group-hover:bg-emerald-600 group-hover:scale-105"
                style={{
                  color: "#059669",
                  background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                  letterSpacing: "0.05em",
                  boxShadow: "0 2px 12px rgba(53, 111, 53, 0.2)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                {sponsor.name}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}