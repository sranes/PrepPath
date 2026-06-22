"use client";

import { useEffect } from "react";
import { hydrateCloudContent } from "@/lib/content";

/** Loads the shared cloud question bank once on app start (no-op if Supabase
 *  isn't configured). Mounted in the root layout. */
export function ContentSync() {
  useEffect(() => {
    void hydrateCloudContent();
  }, []);
  return null;
}
