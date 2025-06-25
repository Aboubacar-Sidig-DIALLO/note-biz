"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { prenomNom: string; montant: number }) => void;
  title?: string;
}

export const AddModal = ({
  isOpen,
  onClose,
  onAdd,
  title = "Ajouter un élément",
}: AddModalProps) => {
  const [prenomNom, setPrenomNom] = useState("");
  const [montant, setMontant] = useState("");
  const [errors, setErrors] = useState<{
    prenomNom?: string;
    montant?: string;
  }>({});

  const validateFields = () => {
    const newErrors: { prenomNom?: string; montant?: string } = {};

    if (!prenomNom.trim()) {
      newErrors.prenomNom = "Le nom ne peut pas être vide";
    }

    const montantValue = parseFloat(montant);
    if (isNaN(montantValue) || montantValue <= 0) {
      newErrors.montant = "Le montant doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    onAdd({
      prenomNom: prenomNom.trim(),
      montant: parseFloat(montant),
    });

    // Reset form
    setPrenomNom("");
    setMontant("");
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setPrenomNom("");
    setMontant("");
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay flouté */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0 bg-black/30 backdrop-blur-sm z-40'
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'>
              {/* Header */}
              <div className='flex items-center justify-between p-6 border-b border-gray-100'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-100 rounded-lg'>
                    <Plus className='w-5 h-5 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    {title}
                  </h2>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleClose}
                  className='hover:bg-gray-100'>
                  <X className='w-5 h-5' />
                </Button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                {/* Nom et Prénom */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='prenomNom'
                    className='text-sm font-medium text-gray-700'>
                    Nom et Prénom
                  </Label>
                  <div className='relative'>
                    <Input
                      id='prenomNom'
                      type='text'
                      value={prenomNom}
                      onChange={(e) => {
                        setPrenomNom(e.target.value);
                        if (errors.prenomNom) {
                          setErrors((prev) => ({
                            ...prev,
                            prenomNom: undefined,
                          }));
                        }
                      }}
                      className={`pr-10 ${
                        errors.prenomNom
                          ? "border-red-500 focus-visible:ring-red-500/20"
                          : ""
                      }`}
                      placeholder='Entrez le nom et prénom'
                    />
                    {errors.prenomNom && (
                      <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                        <AlertCircle className='w-4 h-4 text-red-500' />
                      </div>
                    )}
                  </div>
                  {errors.prenomNom && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' />
                      {errors.prenomNom}
                    </p>
                  )}
                </div>

                {/* Montant */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='montant'
                    className='text-sm font-medium text-gray-700'>
                    Montant (€)
                  </Label>
                  <div className='relative'>
                    <Input
                      id='montant'
                      type='number'
                      value={montant}
                      onChange={(e) => {
                        setMontant(e.target.value);
                        if (errors.montant) {
                          setErrors((prev) => ({
                            ...prev,
                            montant: undefined,
                          }));
                        }
                      }}
                      className={`pr-10 ${
                        errors.montant
                          ? "border-red-500 focus-visible:ring-red-500/20"
                          : ""
                      }`}
                      placeholder='0.00'
                      min='0'
                      step='0.01'
                    />
                    {errors.montant && (
                      <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                        <AlertCircle className='w-4 h-4 text-red-500' />
                      </div>
                    )}
                  </div>
                  {errors.montant && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' />
                      {errors.montant}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className='flex gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleClose}
                    className='flex-1'>
                    Annuler
                  </Button>
                  <Button
                    type='submit'
                    className='flex-1 bg-blue-600 hover:bg-blue-700'>
                    <Plus className='w-4 h-4 mr-2' />
                    Ajouter
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
