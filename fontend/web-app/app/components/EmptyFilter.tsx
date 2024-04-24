'use client'
import React from "react";
import { useParamsStore } from "../hooks/useParamsStore";
import Heading from "./Heading";
import { Button } from "flowbite-react";
import { signIn } from "next-auth/react";
type Props = {
  titile?: string;
  subtitle?: string;
  showRest?: boolean;
  showLogin?: boolean;
  callBackUrl?: string;
};
export default function EmptyFilter({
  titile = "No matches for this filter",
  subtitle = "Try changing or resetting the filter",
  showRest,
  showLogin,
  callBackUrl,
}: Props) {
  const reset = useParamsStore((state) => state.reset);
  return (
    <div className="h-[40vh] flex flex-col gap-2 justify-center  items-center shadow-lg">
      <Heading title={titile} subtitle={subtitle} center />
      {showRest && (
        <Button outline onClick={reset}>
          Remove filters
        </Button>
      )}
      {showLogin && (
        <Button outline onClick={() => signIn('id-server', {callBackUrl})}>
          Login
        </Button>
      )}
    </div>
  );
}
