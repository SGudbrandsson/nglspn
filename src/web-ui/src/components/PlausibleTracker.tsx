"use client";

import { useEffect } from "react";
import { init } from "@plausible-analytics/tracker";

export function PlausibleTracker() {
  useEffect(() => {
    init({
      domain: "naglasupan.com",
    });
  }, []);

  return null;
}
