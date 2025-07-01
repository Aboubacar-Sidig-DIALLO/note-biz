"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, FormEvent, useState } from "react";

interface ConfirmationSecretProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => Promise<boolean>;
  title?: string;
}

export function ConfirmationSecret({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation requise",
}: ConfirmationSecretProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length === 6 && /^\d+$/.test(code)) {
      setError(false);
      const isValid = await onConfirm(code);
      if (isValid) {
        setCode("");
      } else {
        setError(true);
        setErrorMessage("Code de confirmation incorrect");
      }
    } else {
      setError(true);
      setErrorMessage("Veuillez entrer un code à 6 chiffres valide");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setCode(value);
      setError(false);
      setErrorMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm'
          onClick={() => {
            setError(false);
            onClose();
            setCode("");
          }}
        />

        <motion.div
          animate={error ? "shake" : { borderRadius: "1.2rem" }}
          variants={shakeAnimation}
          exit={{ scale: 0.95, opacity: 0 }}
          className='relative z-50 max-w-md overflow-hidden rounded-lg bg-background p-6 shadow-all-sides'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>{title}</h2>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 bg-green-100 ms-2'
              onClick={() => {
                setError(false);
                onClose();
                setCode("");
              }}>
              <X className='h-4 w-4' />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='code'>Code de confirmation (6 chiffres)</Label>
              <Input
                id='code'
                type='password'
                inputMode='numeric'
                pattern='\d*'
                maxLength={6}
                value={code}
                onChange={handleChange}
                className={cn(
                  "text-center text-xl tracking-wider",
                  error &&
                    "border-destructive focus-visible:ring-destructive/50"
                )}
                placeholder='000000'
                autoComplete='off'
              />
              {error && (
                <p className='text-sm text-destructive'>{errorMessage}</p>
              )}
            </div>

            <div className='flex space-x-3'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={() => {
                  setError(false);
                  setCode("");
                  onClose();
                }}>
                Annuler
              </Button>
              <Button type='submit' className='flex-1'>
                Confirmer
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
