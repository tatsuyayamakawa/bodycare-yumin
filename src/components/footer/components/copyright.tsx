"use client";

import { useConfig } from "@/contexts/config-context";

export default function Copyright() {
  const { APP_NAME } = useConfig();
  const thisYear = new Date().getFullYear();
  const copyrightText = `© 2012 - ${thisYear} ${APP_NAME}`;

  return (
    <div className="text-center">
      <small className="text-muted-foreground text-sm/normal">
        {copyrightText}
      </small>
    </div>
  );
}
