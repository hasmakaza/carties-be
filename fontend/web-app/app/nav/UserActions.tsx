"use client";
import { Dropdown } from "flowbite-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from "react-icons/ai";
import { HiUser } from "react-icons/hi";
import { useParamsStore } from "../hooks/useParamsStore";

type Props = {
  user: Partial<User>;
};
export default function UserActions({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams);
  function setWinner() {
    setParams({winner: user.username, seller: undefined});
    if(pathname !== '/') return router.push('/');
  }
  function setSeller() {
    setParams({winner: undefined, seller: user.username});
    if(pathname !== '/') return router.push('/');
  }
  return (
    <Dropdown inline label={`Welcome ${user.name}`}>
      <Dropdown.Item icon={HiUser}>
        <Link href={"/"}>My Auctions</Link>
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillTrophy} onClick={setWinner}>
        <Link href={"/"}>Auctions won</Link>
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillCar} onClick={setSeller}>
        <Link href={"/auctions/create"}>Sell my car</Link>
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillTrophy}> 
        <Link href={"/session"}>Session (dev only)</Link>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        icon={AiOutlineLogout}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
}
