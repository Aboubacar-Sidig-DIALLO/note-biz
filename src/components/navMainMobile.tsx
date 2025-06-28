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

const NavMainMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const current = usePathname();
  const isDashboardActive = current === "/dashboard";

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
          {/* Section Dashboard */}
          {Boolean(!isDashboardActive) && (
            <div className='flex justify-content-center items-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-200 transition-all duration-200'>
              <button
                onClick={() => handleNavigation("/dashboard")}
                className='w-full flex justify-center items-center py-4'>
                <span className='text-sm font-medium text-gray-700'>
                  Dashboard
                </span>
              </button>
            </div>
          )}

          {/* Section Avoirs */}
          <div className='flex justify-content-center items-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-200 transition-all duration-200'>
            <button
              onClick={() => handleNavigation("/credits")}
              className='w-full flex justify-center items-center py-4'>
              <span className='text-sm font-medium text-gray-700'>Avoirs</span>
            </button>
          </div>

          {/* Section Monnaie */}
          <div className='flex justify-content-center items-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-200 transition-all duration-200'>
            <button
              onClick={() => handleNavigation("/changes")}
              className='w-full flex justify-center items-center py-4'>
              <span className='text-sm font-medium text-gray-700'>Monnaie</span>
            </button>
          </div>

          {/* Section Avoirs en Guinée */}
          <div className='flex justify-content-center items-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-200 transition-all duration-200'>
            <button
              onClick={() => handleNavigation("/guinee-credits")}
              className='w-full flex justify-center items-center py-4'>
              <span className='text-sm font-medium text-gray-700'>
                Avoirs en Guinée
              </span>
            </button>
          </div>

          {/* Section Investissements */}
          <div className='flex justify-content-center items-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-200 transition-all duration-200'>
            <button
              onClick={() => handleNavigation("/investments")}
              className='w-full flex justify-center items-center py-4'>
              <span className='text-sm font-medium text-gray-700'>
                Investissements
              </span>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavMainMobile;
