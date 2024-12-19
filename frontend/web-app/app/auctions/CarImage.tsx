'use client'
import React, { useState } from "react";
import Image from "next/image";
type Props = {
    imgUrl: string,
    alt: string
}
export default function CarImage({imgUrl,alt}: Props) {
  const [isLoading, setLoading] = useState(true); 
  return (
    <Image
      src={imgUrl}
      alt={alt}
      fill
      priority
      className={`
          object-cover
          group-hover:opacity-75
          duration-700
          ease-in-out
          ${isLoading ? 'grayscale blur-2xl scale-110' : 'graysacle-0 blur-0 scale-100'}
      `}
      sizes="(max-width:768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      onLoad={() => setLoading(false)}
    />
  );
}
