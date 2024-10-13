"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

// Component to trigger confetti side cannons on page load
export function ConfettiSideCannons() {
  useEffect(() => {
    const end = Date.now() + 2 * 1000; // 2 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="relative">
      {/* Confetti cannons triggered automatically on load */}
    </div>
  );
}
