"use client";

import { Container } from "@mui/material";
import { Button } from "./ui/button";
import { BabyCarousel } from "./BabySlider";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="pb-5"
    >
      <Container maxWidth="lg" className="flex justify-between rounded-md p-4">
        <div className="flex flex-col justify-around w-full rounded-md max-w-xl items-center pr-4">
          {/* <img src="/images/logoTree.png" alt="" /> */}
          <Image src="/images/logoTree.png" alt="" height={500} width={500} />

          <Link href="/products">
            <Button className="p-4 rounded-full font-bold bg-emerald-600 hover:bg-emerald-800">
              Browse Our Clothes
            </Button>
          </Link>
        </div>
        <BabyCarousel />
      </Container>
    </motion.div>
  );
}
