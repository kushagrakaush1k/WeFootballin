import { createClient } from '@/lib/supabase/client';
import type { SignUpData, SignInData, AuthResponse } from './supabase/database.types';

export async function signUpUser(data: SignUpData): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      },
    });

    if (signUpError) {
      return { user: null, error: signUpError.message };
    }

    if (authData.user) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: 'An error occurred during sign up' };
  }
}

export async function signInUser(data: SignInData): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (signInError) {
      return { user: null, error: signInError.message };
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'An error occurred during sign in' };
  }
}

export async function verifyOTPAndLogin(email: string, otp: string): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    // Verify OTP with Supabase
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'signup',
    });

    if (verifyError) {
      return { user: null, error: verifyError.message };
    }

    if (data.user) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { user: data.user, error: null };
    }

    return { user: null, error: 'OTP verification failed' };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { user: null, error: 'An error occurred during OTP verification' };
  }
}

export async function signOutUser() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: 'An error occurred during sign out' };
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, error: error?.message || 'Not authenticated' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error: 'An error occurred' };
  }
}

export async function getProfile(userId: string) {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error: 'An error occurred' };
  }
}
