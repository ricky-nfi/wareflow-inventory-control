
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseProfile } from '@/types/supabase';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: SupabaseProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  clearAllAndReload: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions: Record<string, string[]> = {
  admin: ['all'],
  warehouse_manager: ['inventory', 'orders', 'layout', 'reports', 'workers'],
  warehouse_staff: ['inventory_update', 'order_processing'],
  finance: ['reports', 'inventory_view']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Force clear all sessions on app load
    const clearSessionsOnLoad = async () => {
      console.log('Clearing all sessions on app load...');
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Reset all state
      if (mounted) {
        setUser(null);
        setProfile(null);
        setSession(null);
        setLoading(false);
      }
    };

    // Clear sessions immediately on mount
    clearSessionsOnLoad();

    // Set up auth state listener for future login attempts
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && mounted) {
            setProfile({
              ...profileData,
              role: profileData.role as 'admin' | 'warehouse_manager' | 'warehouse_staff' | 'finance'
            } as SupabaseProfile);
          }
        } else {
          if (mounted) {
            setProfile(null);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const logout = async () => {
    console.log('Logging out...');
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  const clearAllAndReload = async () => {
    console.log('Clearing all session data and reloading...');
    
    localStorage.clear();
    sessionStorage.clear();
    await supabase.auth.signOut();
    
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
    
    window.location.reload();
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    const userPermissions = rolePermissions[profile.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      login, 
      signup, 
      logout, 
      clearAllAndReload,
      hasPermission, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
