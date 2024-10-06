"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import React from "react";

export function BabyCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  return (
    <Carousel
      className="w-full h-1/2 max-w-xl lg:max-w-sm "
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent className="">
        <CarouselItem>
          <img
            src="/babyModel/img_6013.jpg"
            alt=""
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
          />
        </CarouselItem>
        <CarouselItem className="">
          <img
            src="/babyModel/img_6315.jpg"
            alt=""
            className="object-cover h-full rounded-md saturate-[1.25]"
          />
        </CarouselItem>

        <CarouselItem className="">
          <img
            src="/babyModel/img_6314.jpeg"
            alt=""
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
          />
        </CarouselItem>
        {/* <CarouselItem>
          <img
            src="/babyModel/img_6016.jpg"
            alt=""
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
          />
        </CarouselItem> */}

        <CarouselItem>
          <img
            src="/babyModel/img_6054.jpeg"
            alt=""
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
          />
        </CarouselItem>
        <CarouselItem>
          <img
            src="/babyModel/img_6283.jpeg"
            alt=""
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
          />
        </CarouselItem>
        <CarouselItem>
          <img
            src="/babyModel/img_6014.jpg"
            alt=""
            className="object-cover h-full w-full rounded-md saturate-[1.25]"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
