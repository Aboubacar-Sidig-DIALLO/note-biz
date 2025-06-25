import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

const addButtonVariants = cva(
  "group relative overflow-hidden transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
        primary:
          "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
        secondary:
          "bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700",
        accent:
          "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
      },
      size: {
        sm: "h-8 w-8 rounded-lg",
        default: "h-10 w-10 rounded-xl",
        lg: "h-12 w-12 rounded-2xl",
        xl: "h-16 w-16 rounded-3xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-xl",
        pill: "rounded-full px-6 w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "circle",
    },
  }
);

interface AddButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof addButtonVariants> {
  label?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  showLabel?: boolean;
  pulse?: boolean;
  onAdd?: () => void | Promise<void>;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      label = "Ajouter",
      loading = false,
      icon,
      showLabel = false,
      pulse = false,
      onAdd,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onAdd) {
        await onAdd();
      }
      if (onClick) {
        onClick(e);
      }
    };

    const isDisabled = disabled || loading;

    return (
      <motion.div
        className={cn("relative inline-block", className)}
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}>
        <Button
          ref={ref}
          variant='ghost'
          className={cn(
            addButtonVariants({ variant, size, shape }),
            "relative z-10 border-0 shadow-lg hover:shadow-xl",
            pulse && !isDisabled && "animate-pulse",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleClick}
          disabled={isDisabled}
          {...props}>
          {/* Background gradient animation */}
          <motion.div
            className='absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent'
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className='relative z-20 flex items-center justify-center'>
            <AnimatePresence mode='wait'>
              {loading ? (
                <motion.div
                  key='loading'
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}>
                  <Loader2 className='h-4 w-4 animate-spin text-white' />
                </motion.div>
              ) : (
                <motion.div
                  key='icon'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    duration: 0.4,
                  }}
                  className='flex items-center gap-2'>
                  {icon || <Plus className='h-4 w-4 text-white' />}
                  {showLabel && shape === "pill" && (
                    <span className='text-sm font-medium text-white whitespace-nowrap'>
                      {label}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tooltip for circle/square variants */}
          {!showLabel && shape !== "pill" && (
            <motion.div
              className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none whitespace-nowrap z-30'
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}>
              {label}
            </motion.div>
          )}
        </Button>

        {/* Pulse ring for pulse variant */}
        {pulse && !isDisabled && (
          <motion.div
            className='absolute inset-0 rounded-full border-2 border-current opacity-20'
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    );
  }
);

AddButton.displayName = "AddButton";

export { AddButton, addButtonVariants };
export type { AddButtonProps };
