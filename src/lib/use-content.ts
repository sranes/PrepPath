"use client";

import { useEffect, useState } from "react";
import { CONTENT_CHANGED } from "./content";

/**
 * Subscribe a component to content changes. Returns a version counter that
 * bumps whenever the content cache updates (cloud hydration, admin edits),
 * forcing a re-render so freshly-loaded questions appear without a reload.
 */
export function useContentVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const bump = () => setV((n) => n + 1);
    window.addEventListener(CONTENT_CHANGED, bump);
    return () => window.removeEventListener(CONTENT_CHANGED, bump);
  }, []);
  return v;
}
