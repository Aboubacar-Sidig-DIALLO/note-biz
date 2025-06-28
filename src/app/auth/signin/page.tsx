"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const BackgroundShapes = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute'
          initial={{
            opacity: 0.1,
            scale: 0.8,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            borderRadius: "40%",
            background: `linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)`,
            filter: "blur(50px)",
            top: `${20 + i * 30}%`,
            left: `${20 + i * 20}%`,
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
};

const FloatingParticles = () => {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-1 h-1 bg-white/10 rounded-full'
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            y: [null, -1000],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function PinLogin() {
  const [mounted, setMounted] = useState(false);
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNumberClick = (number: number | string) => {
    console.log("Current PIN:", pin);
    if (pin.length < 6) {
      console.log("Adding number:", number);
      setPin((prev) => prev + number);
      console.log("PINS:", pin);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length < 6) {
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        pin: pin,
        redirect: false,
      });

      if (result?.error) {
        setError(true);
        setTimeout(() => setError(false), 1000);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 1000);
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      border: [
        "5px solid #e11d48",
        "5px solid transparent",
        "5px solid #e11d48",
        "5px solid transparent",
        "5px solid #e11d48",
      ],
      borderRadius: "1.2rem",
      transition: {
        duration: 0.5,
      },
    },
  };

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Animated background elements */}
      <div className='absolute inset-0 w-full h-full'>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-30"></div>
        <div className='absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-slate-900/30'></div>
        {mounted && (
          <>
            <BackgroundShapes />
            <FloatingParticles />
            <motion.div
              className='absolute inset-0'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5'></div>
            </motion.div>
            <motion.div
              className='absolute -inset-[100%] bg-gradient-to-r from-transparent via-slate-400/10 to-transparent'
              animate={{
                x: ["0%", "200%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </>
        )}
      </div>

      <motion.div
        animate={error ? "shake" : { borderRadius: "1.2rem" }}
        variants={shakeAnimation}
        className='w-full max-w-md relative z-10'>
        <Card className='w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-slate-200/20 shadow-xl'>
          <CardHeader className='text-center'>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className='text-2xl font-bold'>
              Entrez votre code PIN
            </motion.h1>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial='hidden'
              animate='show'
              className='space-y-8'>
              <div className='mb-8'>
                <div className='flex justify-center gap-3'>
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: pin.length > index ? 1 : 0.8,
                        opacity: pin.length > index ? 1 : 0.5,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                      className={`w-4 h-4 rounded-full ${
                        pin.length > index
                          ? "bg-primary shadow-lg"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "delete"].map(
                  (number, index) => (
                    <motion.div
                      key={index}
                      variants={itemAnimation}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='relative'>
                      {number === "delete" ? (
                        <Button
                          variant='outline'
                          onClick={handleDelete}
                          className='w-full h-10 relative overflow-hidden group'>
                          <motion.span
                            initial={{ x: 0 }}
                            whileHover={{ x: -5 }}
                            className='relative z-10'>
                            ←
                          </motion.span>
                          <motion.div
                            className='absolute inset-0 bg-primary/5 dark:bg-primary/10'
                            initial={{ x: "100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </Button>
                      ) : (
                        <Button
                          variant='outline'
                          onClick={() => handleNumberClick(number)}
                          className='w-full h-10 relative overflow-hidden group'>
                          <motion.span
                            initial={{ y: 0 }}
                            whileHover={{ y: -2 }}
                            className='relative z-10'>
                            {number}
                          </motion.span>
                          <motion.div
                            className='absolute inset-0 bg-primary/5 dark:bg-primary/10'
                            initial={{ y: "100%" }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </Button>
                      )}
                    </motion.div>
                  )
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <Button
                  className='w-full h-12 relative overflow-hidden'
                  onClick={handleSubmit}
                  disabled={pin.length < 6 || loading}>
                  <AnimatePresence mode='wait'>
                    <motion.span
                      key={loading ? "loading" : "static"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}>
                      {loading ? "Vérification..." : "Valider"}
                    </motion.span>
                  </AnimatePresence>
                  {loading && (
                    <motion.div
                      className='absolute inset-0 bg-primary/10'
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: 1,
                        transition: { duration: 1.5, repeat: Infinity },
                      }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
