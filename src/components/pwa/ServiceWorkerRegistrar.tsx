"use client";

import { useEffect } from "react";

import { withBasePath } from "@/lib/base-path";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV === "development") {
      return;
    }

    const swUrl = withBasePath("/sw.js");
    navigator.serviceWorker.register(swUrl).catch(() => {
      // The app is fully usable without the service worker.
    });
  }, []);

  return null;
}
