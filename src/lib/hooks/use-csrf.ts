"use client";

import { useEffect, useState } from "react";

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    // サーバーからCSRFトークンを取得
    fetch(window.location.href, { method: "HEAD" })
      .then((response) => {
        const token = response.headers.get("x-csrf-token");
        setCsrfToken(token);
      })
      .catch((error) => {
        console.error("Failed to fetch CSRF token:", error);
      });
  }, []);

  return csrfToken;
}