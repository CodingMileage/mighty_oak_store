"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React from "react";

export function BabyCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      // If you need to perform any actions on selecting a slide
    });
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true })
  );

  return (
    <Carousel
      className="w-full h-1/2 max-w-xl lg:max-w-sm"
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent>
        <CarouselItem>
          <Image
            src="/babyModel/img_6013.jpg"
            alt="Baby Model 1"
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
            width={300}
            height={300}
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src="/babyModel/img_6315.jpg"
            alt="Baby Model 2"
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
            width={300}
            height={300}
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src="/babyModel/img_6314.jpeg"
            alt="Baby Model 3"
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
            width={300}
            height={300}
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src="/babyModel/img_6054.jpeg"
            alt="Baby Model 4"
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
            width={300}
            height={300}
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src="/babyModel/img_6283.jpeg"
            alt="Baby Model 5"
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
            width={300}
            height={300}
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src="/babyModel/img_6014.jpg"
            alt="Baby Model 6"
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
            width={300}
            height={300}
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
