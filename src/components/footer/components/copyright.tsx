"use client";

import { memo } from "react";

import { useConfig } from "@/contexts/config-context";

export const Copyright = memo(function Copyright() {
  const { APP_NAME } = useConfig();
  const thisYear = new Date().getFullYear();
  const copyrightText = `© 2012 - ${thisYear} ${APP_NAME}`;

  return (
    <div className="text-center">
      <small className="text-muted-foreground text-sm">{copyrightText}</small>
    </div>
  );
});
