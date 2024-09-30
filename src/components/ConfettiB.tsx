"use client";

import { ConfettiButton } from "@/components/ui/confetti";
import { useRef } from "react";
import type { ConfettiRef } from "@/components/ui/confetti";
import Confetti from "@/components/ui/confetti";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";

export function ConfettiButtonDemo() {
  return (
    <div className="relative">
      <ConfettiButton>Add to cart</ConfettiButton>
    </div>
  );
}

export function ConfettiBasicCannon() {
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <div className="bg-background relative flex h-[500px] w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Confetti
      </span>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
    </div>
  );
}

export function ConfettiSideCannons() {
  const handleClick = () => {
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
  };

  return (
    <div className="relative">
      <Button onClick={handleClick}>Trigger Side Cannons</Button>
    </div>
  );
}
