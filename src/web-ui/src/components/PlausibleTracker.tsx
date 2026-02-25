"use client";

import { useEffect } from "react";

export function PlausibleTracker() {
  useEffect(() => {
    import("@plausible-analytics/tracker").then(({ init }) => {
      init({
        domain: "naglasupan.is",
      });
    });
  }, []);

  return null;
}
