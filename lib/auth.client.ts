import { createClient } from "@/lib/supabase/client";

interface SignUpUserParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface SignUpUserResponse {
  user: any | null;
  error: string | null;
}

interface SignInUserParams {
  email: string;
  password: string;
}

interface SignInUserResponse {
  user: any | null;
  error: string | null;
}

export async function signUpUser({
  email,
  password,
  fullName,
  phone,
}: SignUpUserParams): Promise<SignUpUserResponse> {
  try {
    const supabase = createClient();

    if (!email || !password || !fullName || !phone) {
      return {
        user: null,
        error: "Missing required fields",
      };
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (signUpError) {
      return {
        user: null,
        error:
          signUpError.message ||
          "Failed to sign up. Please try again later.",
      };
    }

    if (!authData.user) {
      return {
        user: null,
        error: "Sign up failed. Please try again.",
      };
    }

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

    if (signInError || !signInData.user) {
      return {
        user: authData.user,
        error: null,
      };
    }

    return {
      user: signInData.user,
      error: null,
    };
  } catch (err: any) {
    console.error("Sign up error:", err);
    return {
      user: null,
      error:
        err?.message ||
        "An unexpected error occurred during sign up. Please try again.",
    };
  }
}

export async function signInUser({
  email,
  password,
}: SignInUserParams): Promise<SignInUserResponse> {
  try {
    const supabase = createClient();

    if (!email || !password) {
      return {
        user: null,
        error: "Email and password are required",
      };
    }

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

    if (signInError) {
      if (
        signInError.message.includes("Invalid login credentials") ||
        signInError.message.includes("invalid") ||
        signInError.message.includes("Invalid")
      ) {
        return {
          user: null,
          error: "Invalid email or password. Please try again.",
        };
      }

      if (signInError.message.toLowerCase().includes("confirm")) {
        return {
          user: null,
          error: "There was an issue. Please try again or contact support.",
        };
      }

      return {
        user: null,
        error:
          signInError.message ||
          "Failed to sign in. Please try again.",
      };
    }

    if (!authData.user || !authData.session) {
      return {
        user: null,
        error: "Sign in failed. Please try again.",
      };
    }

    return {
      user: authData.user,
      error: null,
    };
  } catch (err: any) {
    console.error("Sign in error:", err);
    return {
      user: null,
      error:
        err?.message ||
        "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    return user;
  } catch (err) {
    console.error("Get current user error:", err);
    return null;
  }
}

export async function signOutUser() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Sign out error:", err);
    return false;
  }
}

export async function isUserAuthenticated() {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return !!session;
  } catch (err) {
    console.error("Auth check error:", err);
    return false;
  }
}
