import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorComponent = ({
  title = "Une erreur s'est produite",
  message = "Désolé, quelque chose s'est mal passé. Veuillez réessayer.",
  onRetry,
  className = "",
}: ErrorComponentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center min-h-[300px] p-8 text-center ${className}`}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className='mb-6'>
        <div className='relative'>
          <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <AlertTriangle className='w-10 h-10 text-red-600' />
          </div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className='absolute inset-0 w-20 h-20 border-2 border-red-300 rounded-full mx-auto'
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className='max-w-md'>
        <h2 className='text-2xl font-semibold text-gray-900 mb-3'>{title}</h2>
        <p className='text-gray-600 mb-6 leading-relaxed'>{message}</p>
      </motion.div>

      {onRetry && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className='inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl'>
          <RefreshCw className='w-4 h-4' />
          Réessayer
        </motion.button>
      )}
    </motion.div>
  );
};

// Variante simplifiée pour les erreurs inline
export const InlineError = ({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
      <AlertTriangle className='w-4 h-4 flex-shrink-0' />
      <span>{message}</span>
    </motion.div>
  );
};

// Variante pour les erreurs de réseau
export const NetworkError = ({
  onRetry,
  className = "",
}: {
  onRetry?: () => void;
  className?: string;
}) => {
  return (
    <ErrorComponent
      title='Problème de connexion'
      message='Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.'
      onRetry={onRetry}
      className={className}
    />
  );
};

// Variante pour les erreurs de chargement
export const LoadingError = ({
  onRetry,
  className = "",
}: {
  onRetry?: () => void;
  className?: string;
}) => {
  return (
    <ErrorComponent
      title='Erreur de chargement'
      message='Impossible de charger les données. Veuillez réessayer.'
      onRetry={onRetry}
      className={className}
    />
  );
};
