"use client";

import { memo } from "react";

import { useConfig } from "@/contexts/config-context";

export const Copyright = memo(function Copyright() {
  const { APP_NAME } = useConfig();
  const thisYear = new Date().getFullYear();

  return (
    <div className="flex flex-row items-center justify-between">
      <small className="text-muted-foreground text-sm">
        &copy; 2012 - {thisYear} {APP_NAME}
      </small>
    </div>
  );
});
