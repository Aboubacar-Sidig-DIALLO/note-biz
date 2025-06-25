const Loader = () => {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
    </div>
  );
};

export default Loader;
