"use client";

import { useEffect, useState } from "react";
import { checkIsAdmin } from "./content";
import { isSupabaseConfigured } from "./supabase";
import { useAuth } from "./auth";

export interface AdminState {
  /** Supabase env vars present */
  enabled: boolean;
  /** signed in */
  signedIn: boolean;
  /** signed in AND in the admins table */
  isAdmin: boolean;
  /** writes should target the shared cloud bank (configured + signed in + admin) */
  cloud: boolean;
}

/** Shared admin/cloud state for the /admin pages. */
export function useAdmin(): AdminState {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && user) checkIsAdmin().then(setIsAdmin);
    else setIsAdmin(false);
  }, [user]);

  return {
    enabled: isSupabaseConfigured,
    signedIn: Boolean(user),
    isAdmin,
    cloud: isSupabaseConfigured && Boolean(user) && isAdmin,
  };
}
