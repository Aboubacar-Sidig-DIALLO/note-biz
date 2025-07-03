"use client";

import { useState } from "react";
import { Edit2, Check, AlertCircle, EyeOff, Eye } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { motion } from "framer-motion";
import { cn } from "@/utils/dateUtils";
import AlerteBiz from "./alerteBiz";
import { ConfirmationSecret } from "./ConfirmationSecret";

interface BizInputProps {
  prenomNom: string;
  montant: number;
  onUpdate?: (data: { prenomNom: string; montant: number }) => void;
  onMoveToHistory?: () => void;
}

type ConfirmDialogActionType = "SAVE" | "MOVE_TO_HISTORY";

export const BizInput = ({
  prenomNom,
  montant,
  onUpdate,
  onMoveToHistory,
}: BizInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrenomNom, setEditedPrenomNom] = useState(prenomNom);
  const [editedMontant, setEditedMontant] = useState(montant);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] =
    useState<ConfirmDialogActionType | null>(null);

  const [errors, setErrors] = useState<{
    prenomNom?: string;
    montant?: string;
  }>({});
  const [isAmountVisible, setIsAmountVisible] = useState(false);
  const [showAmountConfirmation, setShowAmountConfirmation] = useState(false);
  const [caller, setCaller] = useState<string>("");

  const validateFields = () => {
    const newErrors: { prenomNom?: string; montant?: string } = {};

    if (!editedPrenomNom.trim()) {
      newErrors.prenomNom = "Le nom ne peut pas être vide";
    }

    if (editedMontant <= 0 || isNaN(editedMontant)) {
      newErrors.montant = "Le montant doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Réinitialiser les valeurs éditées avec les valeurs actuelles
    setEditedPrenomNom(prenomNom);
    setEditedMontant(montant);
    setErrors({});
  };

  const handleCheckClick = (action: ConfirmDialogActionType) => {
    if (!validateFields()) {
      return;
    }
    // Afficher la boîte de dialogue de confirmation sans sauvegarder
    setShowConfirmDialog(true);
    setConfirmDialogAction(action);
  };

  const handleConfirmSave = (action: ConfirmDialogActionType) => {
    if (action === "SAVE") {
      // Sauvegarder les données et sortir du mode édition
      onUpdate?.({
        prenomNom: editedPrenomNom.trim(),
        montant: editedMontant,
      });
      setEditedPrenomNom(editedPrenomNom.trim());
      setEditedMontant(editedMontant);
      setIsEditing(false);
      setShowConfirmDialog(false);
    } else if (action === "MOVE_TO_HISTORY") {
      // Déplacer les données vers l'historique
      setIsEditing(false);
      setShowConfirmDialog(false);
      onMoveToHistory?.();
    }
  };

  const handleCancelSave = () => {
    // Annuler et sortir du mode édition sans sauvegarder
    setEditedPrenomNom(prenomNom);
    setEditedMontant(montant);
    setIsEditing(false);
    setShowConfirmDialog(false);
    setErrors({});
  };

  const handleAmountConfirmation = async (
    secret: string,
    caller: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/secret", {
        method: "POST",
        body: JSON.stringify({ secret }),
        headers: {
          "Content-Type": "application/json",
          "x-internal-auth": process.env.INTERNAL_AUTH_SECRET || "secret-auth",
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (caller === "show") {
          setIsAmountVisible(true);
        } else {
          handleEditClick();
        }
        setShowAmountConfirmation(false);
        return true;
      } else {
        console.log("Erreur lors de la vérification du secret:", data);
        // Réinitialiser isSecretValid après l'animation
        return false;
      }
    } catch (error) {
      console.log("Erreur lors de la vérification du secret:", error);
      return false;
    }
  };

  return (
    <>
      <div className='relative flex flex-row items-center justify-between bg-white rounded-lg shadow-lg px-3 py-1 border-primary border-[0.5px] hover:shadow-2xl w-full md:w-[70%]'>
        <div className='flex flex-row flex-1'>
          {isEditing ? (
            <div className='flex flex-row flex-1 justify-between gap-3'>
              <div className='relative'>
                <input
                  type='text'
                  value={editedPrenomNom}
                  onChange={(e) => {
                    setEditedPrenomNom(e.target.value);
                    if (errors.prenomNom) {
                      setErrors((prev) => ({ ...prev, prenomNom: undefined }));
                    }
                  }}
                  className={`w-full px-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.prenomNom
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder='Nom'
                />
                {errors.prenomNom && (
                  <div className='absolute -bottom-10 left-0 flex items-center text-red-500 text-sm'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.prenomNom}
                  </div>
                )}
              </div>
              <div className='relative'>
                <input
                  type='number'
                  value={editedMontant}
                  onChange={(e) => {
                    setEditedMontant(Number(e.target.value));
                    if (errors.montant) {
                      setErrors((prev) => ({ ...prev, montant: undefined }));
                    }
                  }}
                  className={`w-25 px-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.montant
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder='Montant'
                  min='0'
                  step='0.01'
                />
                {errors.montant && (
                  <div className='absolute -bottom-10 left-0 w-100 flex items-center text-red-500 text-sm'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.montant}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
              className='flex flex-row flex-1 justify-between gap-3'>
              <h3 className='text-lg px-2 text-gray-800'>{editedPrenomNom}</h3>
              <div className='relative flex flex-row items-center text-lg text-end px-2 font-medium'>
                <div
                  className={cn(
                    "relative mr-2 select-none cursor-none",
                    !isAmountVisible ? "blur-sm" : "blur-none"
                  )}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  {isAmountVisible
                    ? editedMontant.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })
                    : // Utiliser des caractères de remplacement quand le montant est masqué
                      "*****"}
                </div>
                <button
                  onClick={() => {
                    if (!isAmountVisible) {
                      setShowAmountConfirmation(true);
                      setCaller("show");
                    } else {
                      setIsAmountVisible(!isAmountVisible);
                    }
                  }}
                  className='p-1 text-gray-500 hover:text-gray-700'
                  aria-label={
                    !isAmountVisible
                      ? "Masquer le montant"
                      : "Afficher le montant"
                  }>
                  <motion.div
                    animate={{ rotate: isAmountVisible ? 0 : 180 }}
                    transition={{ duration: 0.3 }}>
                    {!isAmountVisible ? (
                      <Eye className='w-4 h-4' />
                    ) : (
                      <EyeOff className='w-4 h-4' />
                    )}
                  </motion.div>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div>
          {!isEditing && (
            <div className='flex items-center flex-row ml-2 gap-2'>
              <button
                onClick={() => {
                  if (!isAmountVisible) {
                    setCaller("edit");
                    setShowAmountConfirmation(true);
                  } else {
                    setIsAmountVisible(!isAmountVisible);
                  }
                }}
                className='p-2 text-gray-600 hover:text-blue-600'
                aria-label='Modifier'>
                <Edit2 className='w-3 h-3' />
              </button>
              <Checkbox
                checked={false}
                className='border-primary-50 border-2'
                onCheckedChange={() => handleCheckClick("MOVE_TO_HISTORY")}
              />
            </div>
          )}

          {isEditing && (
            <button
              onClick={() => handleCheckClick("SAVE")}
              className='p-2 ml-2 rounded-full transition-colors bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
              aria-label='Valider'>
              <Check className='w-3 h-3' />
            </button>
          )}
        </div>
      </div>
      <ConfirmationSecret
        isOpen={showAmountConfirmation}
        onClose={() => setShowAmountConfirmation(false)}
        onConfirm={(value) => handleAmountConfirmation(value, caller as string)}
        title="Confirmation d'accès au montant"
      />
      <AlerteBiz
        isOpen={showConfirmDialog}
        onClose={handleCancelSave}
        onConfirm={() =>
          handleConfirmSave(confirmDialogAction as ConfirmDialogActionType)
        }
      />
    </>
  );
};
