// Export client-side functions
export { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  getCurrentUser, 
  getProfile 
} from '@/lib/auth.client';

// Export server-side functions
export { 
  requireAuth, 
  getUserWithRole, 
  requireAdmin 
} from '@/lib/auth.server';
