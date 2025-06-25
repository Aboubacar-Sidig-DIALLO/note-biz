import React from "react";

interface AlerteBizProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlerteBiz: React.FC<AlerteBizProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Overlay avec effet de flou */}
      <div
        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
        onClick={onClose}></div>

      {/* Card de confirmation */}
      <div className='relative bg-white rounded-lg shadow-xl px-5 py-4 transform transition-all'>
        <h2 className='text-md font-semibold text-gray-800  text-center'>
          Êtes-vous sûr ?
        </h2>

        <div className='flex justify-center space-x-4 mt-2'>
          <button
            onClick={onClose}
            className='px-4 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors'>
            Non
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'>
            Oui
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlerteBiz;
