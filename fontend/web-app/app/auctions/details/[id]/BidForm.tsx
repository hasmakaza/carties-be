"use client";
import { useBidStore } from "@/app/hooks/useBidStore";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { numberWithCommas } from "@/app/lib/numberWithComma";
import { toast } from "react-hot-toast";
import { placeBidForAuction } from "@/app/actions/auctionAction";
type Props = {
  auctionId: string;
  highBid: number;
};
export default function BidForm({ auctionId, highBid }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const addBids = useBidStore((state) => state.addBid);
  function onSubmit(data: FieldValues) {
    if (data.amount <= highBid){
      reset();
      return toast.error(
        "Bid must be at leat " + numberWithCommas(highBid + 1)
      );
    }
    placeBidForAuction(auctionId, +data.amount)
      .then((bid) => {
        if (bid.error) throw bid.error;
        addBids(bid);
        reset();
      })
      .catch((err) => toast.error(err.message));
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center border-2 rounded-lg py-2"
    >
      <input
        min={highBid ?? 0}
        type="number"
        {...register("amount")}
        className="input-custom text-sm text-gray-600"
        placeholder={`Enter your bid (minimum bid is $${numberWithCommas(
          highBid + 1
        )})`}
      />
    </form>
  );
}
