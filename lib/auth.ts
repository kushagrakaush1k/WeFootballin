// Re-export from auth.client
export {
  signUpUser,
  signInUser,
  signOutUser,
  getCurrentUser,
  isUserAuthenticated,
} from "@/lib/auth.client";

// Re-export from auth.server
export { requireAuth, getUserWithRole } from "@/lib/auth.server";
