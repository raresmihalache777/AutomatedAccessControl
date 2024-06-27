import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed z-50 bg-white/90 flex flex-col justify-center	items-center min-h-screen w-screen">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white">
      </div>
      <span className="mt-4 text-blue-600 text-3xl font-bold">
        Loading
      </span>
    </div>
  );
};

export default LoadingOverlay;