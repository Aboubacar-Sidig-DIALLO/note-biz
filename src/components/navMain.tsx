"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import NavButtonMain from "./navButtonMain";

const NavMain = () => {
  const pathname = usePathname();
  return (
    <nav className='relative flex flex-row gap-5 p-2 bg-primary/10 backdrop-blur-sm rounded-full shadow-sm border-2 border-black z-50'>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <NavButtonMain
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
};

export default NavMain;
