import React from 'react';

import { Typography } from '@material-tailwind/react';

export const Toast = ({ variant, children, className }: { variant: string; children: React.ReactNode; className: string }) => {
  return (
    <Typography variant={variant} className={className}>
      {children}
    </Typography>
  );
};
