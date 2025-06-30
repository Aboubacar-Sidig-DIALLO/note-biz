import { AddButton } from "@/components/addButton";

interface HeaderProps {
  title: string;
  buttonLabel: string;
  onAddClick: () => void;
  className?: string;
}

export function Header({
  title,
  buttonLabel,
  onAddClick,
  className = "",
}: HeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-2 px-4 py-2 ${className}`}>
      <h1 className='text-2xl font-bold'>{title}</h1>
      <AddButton
        label={buttonLabel}
        variant='primary'
        shape='pill'
        showLabel={true}
        onClick={onAddClick}
      />
    </div>
  );
}
