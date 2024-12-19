"use client";
import React, { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionAction";
import Filters from "./Filters";
import { useParamsStore } from "../hooks/useParamsStore";
import { shallow } from "zustand/shallow";
import qs from "query-string";
import EmptyFilter from "../components/EmptyFilter";
import { useAuctionStore } from "../hooks/useAuctionStore";
export default function Listings() {
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  // const [pageCount, setPageCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pageSize, setPageSize] = useState(3);
  // const [data, setData] = useState<PageResult<Auction>>();
  const [loading,setLoading] = useState(true);
  const params = useParamsStore(
    (state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
    }),
    shallow
  );
  const data = useAuctionStore((state) => ({
    auctions: state.auctions,
    totalCount: state.totalCount,
    pageCount: state.pageCount,
  }));
  const setData = useAuctionStore(state => state.setData)
  const setParams = useParamsStore((state) => state.setParams);
  const url = qs.stringifyUrl({ url: "", query: params });
  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });
  }
  useEffect(() => {
    getData(url).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [url, setData]);

  if (loading) return <h3>Loading...</h3>;

  if (data.totalCount === 0) return <EmptyFilter showRest />;

  return (
    <>
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showRest />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {data.auctions &&
              data.auctions.map((auction) => (
                <AuctionCard auction={auction} key={auction.id} />
              ))}
          </div>
          <div className="flex justify-end mt-4">
            <AppPagination
              pageChanged={setPageNumber}
              currentPage={params.pageNumber}
              pageCount={data.pageCount}
            />
          </div>
        </>
      )}
    </>
  );
}
