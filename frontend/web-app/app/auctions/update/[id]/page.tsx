import AuctionForm from "@/app/auctions/AuctionForm";
import Heading from "@/app/components/Heading";
import React from "react";
import { getDetailedViewData } from "../../../actions/auctionAction";

export default async function page({ params }: { params: { id: string } }) {
  const auction = await getDetailedViewData(params.id); 
  return (
    <div className="mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg">
      <Heading
        title="Update your auction"
        subtitle="Please update the deatils of your car"
      />
      <AuctionForm auction={auction} />
    </div>
  );
}
