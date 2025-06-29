import Link from "next/link";
import { motion } from "framer-motion";

type NavButtonMainProps = {
  href: string;
  label: string;
  isActive: boolean;
};

const NavButtonMain = ({ href, label, isActive }: NavButtonMainProps) => {
  return (
    <Link
      href={href}
      key={label}
      className='relative px-4 py-2 rounded-full hover:bg-primary/20'>
      <div className='relative z-10 text-sm font-medium whitespace-nowrap'>
        {label}
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
};

export default NavButtonMain;
