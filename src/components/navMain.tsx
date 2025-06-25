"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NavMain = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Avoirs",
      href: "/credits",
    },
    {
      label: "Monnaies",
      href: "/changes",
    },
    {
      label: "Avoir en Guinée",
      href: "/guinee-credits",
    },
    {
      label: "Investissements",
      href: "/investments",
    },
  ];

  return (
    <nav className='relative flex flex-row gap-5 p-2 bg-primary/10 backdrop-blur-sm rounded-full shadow-sm border-2 border-black'>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            href={item.href}
            key={item.label}
            className='relative px-4 py-2 rounded-full hover:bg-primary/20'>
            <div className='relative z-10 text-sm font-medium'>
              {item.label}
            </div>
            {isActive && (
              <motion.div
                layoutId='nav-indicator'
                className='absolute inset-0 bg-primary/30 rounded-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavMain;
