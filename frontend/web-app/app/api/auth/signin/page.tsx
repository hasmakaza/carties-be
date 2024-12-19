import EmptyFilter from "@/app/components/EmptyFilter";
import React from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { callBackUrl: string };
}) {
  return (
    <EmptyFilter
      titile="You need  to be logged in to do that"
      subtitle="Please click below to sign in"
      showLogin
      callBackUrl={searchParams.callBackUrl}
    />
  );
}
