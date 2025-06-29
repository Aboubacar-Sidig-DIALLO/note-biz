"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { AlignCenter } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { NavButtonMobile } from "./navButtonMobile";

const NavMainMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className='bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-400 hover:to-purple-400 rounded-full shadow-lg p-3'>
        <AlignCenter className='w-8 h-8 text-white' />
      </DrawerTrigger>
      <DrawerContent className='bg-primary/10 backdrop-blur-sm'>
        <DrawerHeader>
          <DrawerTitle className='text-center text-xl font-semibold text-gray-900'>
            Navigation
          </DrawerTitle>
        </DrawerHeader>

        <div className='p-6 space-y-4'>
          {NAV_ITEMS.map((item) => (
            <NavButtonMobile
              key={item.href}
              item={item}
              onClick={handleNavigation}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavMainMobile;
