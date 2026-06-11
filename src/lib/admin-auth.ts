import type { User } from "@supabase/supabase-js";

export function getConfiguredAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function userHasAdminAccess(user: User | null | undefined) {
  if (!user) {
    return false;
  }

  const hasAdminRole = user.app_metadata?.role === "admin";

  if (!hasAdminRole) {
    return false;
  }

  const adminEmails = getConfiguredAdminEmails();

  if (adminEmails.length === 0) {
    return true;
  }

  return adminEmails.includes((user.email || "").toLowerCase());
}
