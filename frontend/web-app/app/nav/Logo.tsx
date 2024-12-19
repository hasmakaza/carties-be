"use client";
import React from "react";
import { AiOutlineCar } from "react-icons/ai";
import { useParamsStore } from "../hooks/useParamsStore";
import { useRouter, usePathname } from "next/navigation";

export default function Logo() {
  const router = useRouter();
  const pathname = usePathname();
  const reset = useParamsStore((state) => state.reset);

  function doReset() {
    if (pathname != "/") router.push("/");
    reset();
  }
  return (
    <div
      onClick={doReset}
      className="flex items-center gap-2 text-3xl font-semibold text-red-500 hover:text-green-400 cursor-pointer"
    >
      <AiOutlineCar size={34} />
      <div>Carties Auctions</div>
    </div>
  );
}
