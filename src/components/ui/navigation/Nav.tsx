import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiOutlineHome } from "react-icons/hi";

interface NavProps {
  cta: string;
  ensName?: string;
}

export default function Nav({ cta, ensName }: NavProps) {
  const router = useRouter();
  const handleClick = (cta: string) => {
    if (cta.toLowerCase() === "profile" && ensName) {
      router.push(`/profile/${ensName}`);
    } else {
      router.push(`/${cta.toLowerCase()}`);
    }
  };
  return (
    <Link
      className="flex flex-col items-center justify-center text-[10px] flex-grow-0 h-12 gap-2 pl-5 pr-6 text-xs font-semibold transition-colors duration-150 rounded-full md:justify-start md:flex-row md:text-md lg:text-lg hover:bg-slate-100"
      href={`/${cta.toLowerCase()}`}
      onClick={() => handleClick(cta)}
    >
      <HiOutlineHome size={20} />
      {cta}
    </Link>
  );
}
