import React from "react";
import Heading from "@/app/components/Heading";
import CountDownTimer from "@/app/auctions/CountdownTimer";
import CarImage from "@/app/auctions/CarImage";
import DetailSpecs from "./DetailSpecs";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import BidList from "./BidList";
import { getDetailedViewData } from "@/app/actions/auctionAction";
import { getCurrentUser } from "@/app/actions/authAction";

export default async function Details({ params }: { params: { id: string } }) {
  const data = await getDetailedViewData(params.id);
  const user = await getCurrentUser();
  return (
    <div className="pb-10 ">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Heading title={`${data.make} ${data.model}`} />
          {user?.username && user.username === data.seller && (
            <>
              <EditButton id={params.id} />
              <DeleteButton id={params.id} />
            </>
          )}
        </div>
        <div className="flex gap-3">
          <h3 className="text-2xl font-semibold">Time remainning: </h3>
          <CountDownTimer auctionEnd={data.auctionEnd} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-3">
        <div className="w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden">
          <CarImage imgUrl={data.imageUrl} alt={data.make} />
        </div>
        <BidList auction={data} user={user} />
      </div>
      <div className="mt-3 grid gird-cols-1 rounded-lg">
        <DetailSpecs auction={data} />
      </div>
    </div>
  );
}
