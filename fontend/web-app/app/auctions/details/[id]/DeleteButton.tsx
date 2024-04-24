"use client";
import { deleteAuction } from "@/app/actions/auctionAction";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function doDelete() {
    setLoading(true);
    deleteAuction(id)
      .then((res) => {
        if (res.error) throw res.error;
        router.push("/");
        toast.success("Delete Successfully");
      })
      .catch((error) => {
        toast.error(error.status + " " + error.message, );
      })
      .finally(() => setLoading(false));
  }
  return (
    <Button onClick={doDelete} color="failure" isProcessing={loading}>
      Delete Auction
    </Button>
  );
}
