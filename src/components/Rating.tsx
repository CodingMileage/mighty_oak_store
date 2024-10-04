"use client";

import React from "react";
import { Rating } from "primereact/rating";

interface StarRatingProps {
  value: number; // define the value type
}

export default function StarRating({ value }: StarRatingProps) {
  return (
    <div className="card flex justify-content-center">
      <Rating value={value} readOnly cancel={false} />
    </div>
  );
}
