"use client";
import React, { useState } from "react";

interface WhatsAppFloatProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppFloat({
  phoneNumber,
  message = "Hi! I want to join WeFootballin'",
}: WhatsAppFloatProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className="fixed bottom-6 left-0 z-50 flex items-center"
        style={{
          marginLeft: 0,
        }}
      >
        {/* WhatsApp Button */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative"
          aria-label="Chat on WhatsApp"
          style={{
            marginLeft: 50,
            paddingLeft: 0,
          }}
        >
          {/* Outer pulse ring */}
          <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping pointer-events-none"></span>
          {/* Button container */}
          <div
            className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-110 shadow-2xl" : "scale-100"
            }`}
          >
            {/* WhatsApp Icon */}
            <svg
              viewBox="0 0 32 32"
              className="w-9 h-9 text-white"
              fill="currentColor"
            >
              <path d="M16.002 0C7.164 0 0 7.162 0 16c0 2.831.738 5.489 2.031 7.791L.696 30.307l6.728-1.765A15.94 15.94 0 0 0 16.002 32C24.838 32 32 24.838 32 16S24.838 0 16.002 0zm0 29.474c-2.538 0-4.923-.698-6.966-1.914l-.5-.294-5.176 1.357 1.381-5.046-.323-.518A13.427 13.427 0 0 1 2.526 16c0-7.444 6.058-13.5 13.476-13.5 7.417 0 13.474 6.056 13.474 13.5s-6.057 13.474-13.474 13.474z" />
              <path d="M23.42 19.643c-.392-.196-2.318-1.144-2.677-1.274-.358-.131-.619-.196-.88.196-.261.392-1.011 1.274-1.239 1.535-.229.261-.458.294-.85.098-.392-.197-1.654-.61-3.151-1.944-1.165-1.038-1.951-2.321-2.18-2.713-.228-.392-.024-.604.172-.799.176-.175.392-.458.588-.687.196-.229.261-.392.392-.653.131-.261.066-.49-.033-.687-.098-.196-.88-2.12-1.206-2.903-.318-.764-.641-.66-.88-.672-.228-.011-.489-.013-.75-.013s-.685.098-1.043.49c-.359.392-1.369 1.34-1.369 3.264s1.402 3.785 1.598 4.046c.196.261 2.761 4.217 6.688 5.915.935.405 1.665.647 2.233.828.939.298 1.794.256 2.47.155.753-.112 2.318-.948 2.644-1.863.326-.915.326-1.699.228-1.863-.098-.163-.359-.261-.751-.457z" />
            </svg>
          </div>
        </button>

        {/* Tooltip on right of button */}
        <div
          className={`relative transition-all duration-300 ease-out`}
          style={{
            marginLeft: isHovered ? 12 : -12,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-20px)",
            pointerEvents: isHovered ? "auto" : "none",
            transition: "all 0.3s",
          }}
        >
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium relative ml-4">
            Chat With Us!
            {/* Pointer/arrow on left of tooltip */}
            <div className="absolute left-[-16px] top-1/2 -translate-y-1/2">
              <div className="border-8 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}
