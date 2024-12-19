import { Auction } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
type Props = {
  auction: Auction;
};
export default function AuctionCreatedToast({ auction }: Props) {
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
        <span>New Auction! {auction.make} {auction.model}</span>
      </div>
    </Link>
  );
}
