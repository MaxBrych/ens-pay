import { Button, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiOutlineHome } from "react-icons/hi";

interface NavProps {
  cta: string;
  ensName?: string;
  Icon: React.ElementType;
  onClick?: () => void;
}

export default function Nav({ cta, Icon, ensName, onClick }: NavProps) {
  const router = useRouter();
  const handleClick = (cta: string) => {
    if (cta.toLowerCase() === "profile" && ensName) {
      router.push(`/profile/${ensName}`);
    } else {
      router.push(`/${cta.toLowerCase()}`);
    }
  };
  const iconSize = useBreakpointValue({ base: "24px", md: "24px" });

  return (
    <Link
      className="flex flex-col items-center justify-center text-[10px] md:flex-grow-0 h-12 gap-0 md:gap-2 px-1 md:pl-5 md:pr-6 md:text-[0px] font-semibold transition-colors duration-150 md:rounded-full md:justify-start md:flex-row md:text-md lg:text-base hover:bg-slate-100"
      href={`/${cta.toLowerCase()}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick(cta);
        if (onClick) onClick();
      }}
    >
      <Icon size={iconSize} />
      {cta}
    </Link>
  );
}
