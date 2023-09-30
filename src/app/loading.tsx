'use client';

import { Spinner } from '@material-tailwind/react';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner color="amber" className="h-14 w-14" />
    </div>
  );
}
