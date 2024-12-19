"use client";
import React, { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useParamsStore } from "../hooks/useParamsStore";
import { MdCancel } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore((state) => state.setParams);
  const setSearchValue = useParamsStore(state => state.setSearchValue);
  const searchValue = useParamsStore(state => state.searchValue);

  const inputRef = useRef<HTMLInputElement>(null);
  function onChange(event: any) {
    const valueSearch = event.target.value;
    setSearchValue(valueSearch);
  }
  function search() {
    if(pathname !=="/") router.push("/");
    setParams({ searchTerm: searchValue });
  }
  function handleclear() {
    setSearchValue('');
    inputRef.current?.focus();
  }
  return (
    <div className="flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm">
      <input
        ref={inputRef}
        value={searchValue}
        type="text"
        onKeyDown={(e: any) => {
          if (e.key === "Enter") search();
        }}
        onChange={onChange}
        placeholder="Search for cars by make, model or color"
        className="
        input-custom
        text-sm
        text-gray-600
        "
      />
      <div className="flex items-center">
        {searchValue !== "" && (
          <button onClick={handleclear} className="mx-5">
            <MdCancel size={20} className="text-white-200" />
          </button>
        )}
        <button onClick={search}>
          <FaSearch
            size={34}
            className="
             bg-red-400
             text-white 
             rounded-full 
             p-2 mr-3 
             cursor-pointer
             hover:bg-green-400
            "
          />
        </button>
      </div>
    </div>
  );
}
