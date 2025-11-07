import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Exception in getUser:', error);
    return null;
  }
}

export async function getUserWithRole() {
  try {
    const supabaseUser = await getUser();
    if (!supabaseUser) return null;

    const supabase = await createClient();
    
    const { data: dbUser, error } = await supabase
      .from('users')
      .select(`
        *,
        player_stats (*)
      `)
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user with role:', error);
      return null;
    }

    return dbUser;
  } catch (error) {
    console.error('Exception in getUserWithRole:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// For page components (server components)
export async function requireAuthPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getUserWithRole();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized - Admin access required');
  }
  return user;
}

// For page components (server components)
export async function requireAdminPage() {
  const user = await getUserWithRole();
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }
  return user;
}

export async function isAdmin() {
  const user = await getUserWithRole();
  return user?.role === 'ADMIN';
}