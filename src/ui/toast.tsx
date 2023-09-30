import React from 'react';

import { Alert } from '@material-tailwind/react';

export const Toast = ({ children, className }: { className?: string; children: React.ReactNode }) => {
  return (
    <Alert variant="outlined" className={`${className} font-notojp text-base font-normal leading-6 tracking-wide`}>
      {children}
    </Alert>
  );
};
