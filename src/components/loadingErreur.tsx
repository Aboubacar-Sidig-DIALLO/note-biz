const LoadingErreur = ({ error }: { error: string }) => {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='text-red-600 text-center'>
        <p className='text-lg font-semibold'>Erreur de chargement</p>
        <p className='text-sm mt-2'>{error}</p>
      </div>
    </div>
  );
};

export default LoadingErreur;
