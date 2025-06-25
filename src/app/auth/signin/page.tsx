"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PinLogin() {
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

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

  return (
    <div className='min-h-screen flex items-center justify-center  p-4'>
      <motion.div
        animate={error ? "shake" : { borderRadius: "1.2rem" }}
        variants={shakeAnimation}
        className='w-full max-w-md'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-2xl font-bold'>
              Entrez votre code PIN
            </motion.h1>
          </CardHeader>
          <CardContent>
            <div className='mb-8'>
              <div className='flex justify-center gap-3'>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-4 h-4 rounded-full ${
                      pin.length > index ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "delete"].map((number, index) => (
                <motion.div key={index} whileTap={{ scale: 0.95 }}>
                  {number === "delete" ? (
                    <Button
                      variant='outline'
                      onClick={handleDelete}
                      className='w-full h-10'>
                      ←
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      onClick={() => handleNumberClick(number)}
                      className='w-full h-10'>
                      {number}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className='mt-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              <Button
                className='w-full'
                onClick={handleSubmit}
                disabled={pin.length < 6 || loading}>
                {loading ? "Vérification..." : "Valider"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
