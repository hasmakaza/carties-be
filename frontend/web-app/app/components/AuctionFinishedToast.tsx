import { Auction, AuctionFinished } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { numberWithCommas } from "../lib/numberWithComma";
import { usePathname } from "next/navigation";

type Props = {
  finishAuction: AuctionFinished;
  auction: Auction;
};
export default function AuctionFinishedToast({
  auction,
  finishAuction,
}: Props) {
  const pathname = usePathname();
  function changePathname(auctionId: string, pathname: string) {
    switch (pathname) {
      case "/":
        return `auctions/details/${auctionId}`;
      default:
        return auctionId;
    }
  }
  return (
    <Link
      href={changePathname(auction.id, pathname)}
      className="flex flex-col items-center"
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          src={auction.imageUrl}
          alt={auction.model}
          height={80}
          width={80}
          className="rounded-lg w-20 h-auto"
        />
        <div className="flex flex-col">
          <span>
            Auction for {auction.make} {auction.model} has finished
          </span>
          {finishAuction.itemSold && finishAuction.amount ? (
            <p>
              Congrats to {finishAuction.winner} who was this auction for $$
              {numberWithCommas(finishAuction.amount)}
            </p>
          ) : (
            <p>This item did not sell</p>
          )}
        </div>
      </div>
    </Link>
  );
}
