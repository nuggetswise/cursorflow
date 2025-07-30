import { supabase } from '../config/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: Session | null;
  error?: AuthError | null;
}

export class AuthService {
  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }
      
      return user ? this.transformUser(user) : null;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      return {
        user: data.user ? this.transformUser(data.user) : null,
        session: data.session,
        error
      };
    } catch (error) {
      console.error('Error in signUp:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        user: data.user ? this.transformUser(data.user) : null,
        session: data.session,
        error
      };
    } catch (error) {
      console.error('Error in signIn:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  // Sign in with magic link
  async signInWithMagicLink(email: string): Promise<{ error?: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
        }
      });

      return { error };
    } catch (error) {
      console.error('Error in signInWithMagicLink:', error);
      return { error: error as AuthError };
    }
  }

  // Sign in with OAuth provider
  async signInWithOAuth(provider: 'google' | 'github' | 'discord'): Promise<{ error?: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
        }
      });

      return { error };
    } catch (error) {
      console.error('Error in signInWithOAuth:', error);
      return { error: error as AuthError };
    }
  }

  // Sign out
  async signOut(): Promise<{ error?: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error: error as AuthError };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error?: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`
      });

      return { error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error: error as AuthError };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ error?: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { error };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return { error: error as AuthError };
    }
  }

  // Update user profile
  async updateProfile(updates: { email?: string; data?: any }): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);

      return {
        user: data.user ? this.transformUser(data.user) : null,
        session: data.session,
        error
      };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  // Get session
  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error in getSession:', error);
      return null;
    }
  }

  // Refresh session
  async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      return {
        user: data.user ? this.transformUser(data.user) : null,
        session: data.session,
        error
      };
    } catch (error) {
      console.error('Error in refreshSession:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Transform Supabase User to our AuthUser format
  private transformUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email || '',
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  // Verify JWT token (for API routes)
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }
      
      return this.transformUser(user);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  // Create admin user (for development)
  async createAdminUser(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });

      return {
        user: data.user ? this.transformUser(data.user) : null,
        session: data.session,
        error
      };
    } catch (error) {
      console.error('Error in createAdminUser:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService(); 