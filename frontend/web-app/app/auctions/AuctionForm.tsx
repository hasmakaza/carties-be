"use client";
import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Input from "../components/Input";
import DateInput from "../components/DateInput";
import { createAuction, updateAuction } from "../actions/auctionAction";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Auction } from "@/types";
type Props = {
  auction?: Auction;
};
export default function AuctionForm({ auction }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onTouched",
  });
  useEffect(() => {
    if (auction) {
      const { make, model, color, mileage, year } = auction;
      reset({ make, model, color, mileage, year });
    }
    setFocus("make");
  }, [setFocus, auction, reset]);

  async function onSubmit(data: FieldValues) {
    try {
      let id = "";
      let message = "Create successfully";
      let res;
      if (pathname.match("/auctions/create")) {
        res = await createAuction(data);
        id = res.id;
      } else {
        if (auction) {
          res = await updateAuction(auction.id, data);
          id = auction.id;
          message = "Update successfully";
        }
      }
      if (res.error) {
        throw res.error;
      }
      toast.success(message);
      router.push(`/auctions/details/${id}`);
    } catch (err: any) {
      toast.error(err.status + " " + err.message);
    }
  }
  function cancel() {
    if (auction) {
      router.push(`/auctions/details/${auction.id}`);
    } else {
      router.push("/");
    }
  }
  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Make"
        name="make"
        control={control}
        rules={{ required: "Make is required" }}
      />
      <Input
        label="Model"
        name="model"
        control={control}
        rules={{ required: "Model is required" }}
      />
      <Input
        label="Color"
        name="color"
        control={control}
        rules={{ required: "Color is required" }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Year"
          name="year"
          control={control}
          rules={{ required: "Year is required" }}
          type="number"
        />
        <Input
          label="Mileage"
          name="mileage"
          control={control}
          rules={{ required: "Mileage is required" }}
          type="number"
        />
      </div>
      {pathname === "/auctions/create" && (
        <>
          <Input
            label="ImageUrl"
            name="imageUrl"
            control={control}
            rules={{ required: "Image Url is required" }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Reserve Price (enter 0 if no reverse)"
              name="reservePrice"
              control={control}
              rules={{ required: "Reserve price is required" }}
              type="number"
            />
            <DateInput
              label="Auction end date/time"
              name="auctionEnd"
              control={control}
              dateFormat={"dd MMMM yyyy h:mm a"}
              showTimeSelect
              rules={{ required: "Auction end date/time is required" }}
            />
          </div>
        </>
      )}
      <div className="flex justify-between">
        <Button outline color="gray" onClick={cancel}>
          Cancel
        </Button>
        <Button
          isProcessing={isSubmitting}
          disabled={!isValid}
          type="submit"
          outline
          color="success"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
