import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Eye, EyeOff, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/dateUtils";

type BizCardProps = {
  title: string;
  activeItems: number;
  historyUrl: string;
  somme: number;
  setShowSecretConfirmation: (show: boolean) => void;
  canShowAmount: boolean;
  index: number;
  setCanShowAmount: (canShowAmount: boolean) => void;
  setActiveCard: (index: number) => void;
  activeCard: number;
};

const BizCard = ({
  title,
  activeItems,
  historyUrl,
  somme,
  setShowSecretConfirmation,
  canShowAmount,
  index,
  setCanShowAmount,
  setActiveCard,
  activeCard,
}: BizCardProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: Math.random() * 0.2,
        }}
        className='group relative'>
        <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl shadow-all-sides'>
          {/* Effet de particules flottantes */}
          <div className='absolute inset-0 overflow-hidden'>
            <motion.div
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              className='absolute top-4 right-6 w-3 h-3 bg-purple-400 rounded-full blur-[0.5px]'
            />
            <motion.div
              animate={{
                y: [0, 15, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              className='absolute bottom-8 left-4 w-2 h-2 bg-pink-400 rounded-full blur-[0.5px]'
            />
          </div>

          <CardHeader className='relative z-10'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <CardTitle className='text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500'>
                  {title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className='relative z-10'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {activeItems > 0 ? (
                    <motion.div
                      className='relative'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}>
                      <div className='w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50' />
                      <div className='absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75' />
                    </motion.div>
                  ) : (
                    <div className='relative'>
                      <div className='w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 shadow-sm' />
                    </div>
                  )}
                  <span className='text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300'>
                    Éléments actifs
                  </span>
                </div>
                <motion.div
                  className='flex items-center gap-2'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}>
                  <Sparkles className='w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  <span className='text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    {activeItems.toLocaleString()}
                  </span>
                  <Zap className='w-4 h-4 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                </motion.div>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3 ms-6'>
                <span className='text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300'>
                  Somme
                </span>
              </div>
              <motion.div
                className='flex items-center gap-2'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}>
                <Sparkles className='w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <span
                  className={cn(
                    "text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent select-none cursor-none",
                    activeCard !== index
                      ? "blur-sm"
                      : activeCard === index && !canShowAmount
                      ? "blur-sm"
                      : "blur-none"
                  )}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  {activeCard !== index ||
                  (activeCard === index && !canShowAmount)
                    ? "*****"
                    : somme.toLocaleString()}
                </span>
                <motion.button
                  onClick={() => {
                    setActiveCard(index);
                    if (canShowAmount) {
                      setCanShowAmount(false);
                      setShowSecretConfirmation(activeCard !== index);
                    } else {
                      setShowSecretConfirmation(!canShowAmount);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    rotate: activeCard === index && canShowAmount ? 0 : 180,
                  }}
                  transition={{ duration: 0.3 }}
                  className='p-1 rounded-full hover:bg-gray-100 transition-colors duration-200'>
                  {activeCard !== index || !canShowAmount ? (
                    <Eye className='w-4 h-4 text-gray-500 hover:text-gray-700' />
                  ) : (
                    <EyeOff className='w-4 h-4 text-gray-500 hover:text-gray-700' />
                  )}
                </motion.button>
                <Zap className='w-4 h-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </motion.div>
            </div>
          </CardContent>

          <CardFooter className='relative z-10'>
            <Button
              asChild
              variant='outline'
              size='sm'
              className='w-full group/btn relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/25 border-0 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-500 hover:to-pink-500 hover:text-white rounded-xl font-medium'>
              <Link
                href={historyUrl}
                className='flex items-center justify-center gap-3 py-3 shadow-lg shadow-purple-500/25'>
                <span className='relative z-10'>Voir l&apos;historique</span>
                <motion.div
                  className='relative z-10'
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}>
                  <ArrowRight className='w-4 h-4' />
                </motion.div>
                {/* Effet de brillance sur le bouton */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%]' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};

export default BizCard;
