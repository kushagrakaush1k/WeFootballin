import { createClient } from '@/lib/supabase/client';
import type { SignUpData, SignInData, AuthResponse } from './supabase/database.types';

export async function signUpUser(data: SignUpData): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      },
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      
      // Handle rate limit error gracefully
      if (signUpError.message?.toLowerCase().includes('rate limit')) {
        return { 
          user: null, 
          error: 'Too many signup attempts. Please wait a moment and try again.' 
        };
      }
      
      return { user: null, error: signUpError.message };
    }

    console.log('User signed up successfully:', authData?.user?.email);
    
    return { 
      user: authData?.user || null, 
      error: null 
    };
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
      console.error('Sign in error:', signInError);
      return { user: null, error: signInError.message };
    }

    return { 
      user: authData?.user || null, 
      error: null 
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'An error occurred during sign in' };
  }
}

export async function verifyOTPAndLogin(
  email: string,
  otp: string
): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'signup',
    });

    if (verifyError) {
      console.error('OTP verification error:', verifyError);
      return { user: null, error: verifyError.message };
    }

    if (data?.user) {
      return { 
        user: data.user, 
        error: null 
      };
    }

    return { user: null, error: 'OTP verification failed' };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { user: null, error: 'An error occurred during OTP verification' };
  }
}

export async function resendOTP(email: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Resend OTP error:', error);
      
      // Handle rate limit error gracefully
      if (error.message?.toLowerCase().includes('rate limit')) {
        return { error: 'Please wait 60 seconds before requesting another code.' };
      }
      
      return { error: error.message };
    }

    console.log('OTP resent successfully to:', email);
    return { error: null };
  } catch (error) {
    console.error('Resend OTP error:', error);
    return { error: 'Failed to resend OTP. Please try again.' };
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
