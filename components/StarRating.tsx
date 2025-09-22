"use client";

import React from "react";

type Props = { rating: number };

const StarRating = ({ rating }: Props) => {
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`text-2xl ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    );
  }
  return <div className="flex gap-1">{stars}</div>;
};

export default StarRating;
