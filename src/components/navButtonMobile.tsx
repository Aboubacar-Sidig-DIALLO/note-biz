import { type NavItem } from "@/constants/navigation";

interface NavButtonProps {
  item: NavItem;
  onClick: (href: string) => void;
  isActive?: boolean;
}

export const NavButtonMobile = ({
  item,
  onClick,
  isActive = false,
}: NavButtonProps) => {
  if (isActive) return null;

  return (
    <div className='flex justify-content-center items-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-200 transition-all duration-200'>
      <button
        onClick={() => onClick(item.href)}
        className='w-full flex justify-center items-center py-2'>
        <span className='text-sm font-medium text-gray-700 whitespace-nowrap'>
          {item.label}
        </span>
      </button>
    </div>
  );
};
