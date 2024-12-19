"use client";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { ReactNode, useEffect, useState } from "react";
import { useAuctionStore } from "../hooks/useAuctionStore";
import { useBidStore } from "../hooks/useBidStore";
import { Auction, AuctionFinished, Bid } from "@/types";
import { User } from "next-auth";
import { toast } from "react-hot-toast";
import AuctionCreatedToast from "../components/AuctionCreatedToast";
import { getDetailedViewData } from "../actions/auctionAction";
import AuctionFinishedToast from "../components/AuctionFinishedToast";
type Props = {
  children: ReactNode;
  user: User | null;
};
export default function SignalRProvider({ children, user }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBids = useBidStore((state) => state.addBid);
  const apiUrl = process.env.NODE_ENV !== "production"
  ? process.env.NEXT_PUBLIC_NOTIFY_URL
  : "https://api.carstiestest.com/notifications"
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiUrl!)
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, [apiUrl]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connection to notification hub");

          connection.on("BidPlaced", (bid: Bid) => {
            console.log("Bid placed event received");
            if (bid.bidStatus.includes("Accepted")) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }
            addBids(bid);
          });
          connection.on("AuctionCreated", (auction: Auction) => {
            console.log("Auction created received");
            if (user?.username !== auction.seller) {
              return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 10000,
              });
            }
          });
          connection.on("AuctionFinished", (finishAuction: AuctionFinished) => {
            const auction = getDetailedViewData(finishAuction.auctionId);
            return toast.promise(
              auction,
              {
                loading: "loading",
                success: (auction) => (
                  <AuctionFinishedToast
                    auction={auction}
                    finishAuction={finishAuction}
                  />
                ),
                error: "Auction finished",
              },
              { success: { duration: 10000, icon: null } }
            );
          });
        })
        .catch((error) => console.log(error));
    }
    return () => {
      connection?.stop();
    };
  }, [connection, setCurrentPrice, addBids, user?.username]);
  return children;
}
