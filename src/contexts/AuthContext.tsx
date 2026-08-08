import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'buyer' | 'seller';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  accountType: 'buyer' | 'seller';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(sbUser: SupabaseUser): User {
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    firstName: sbUser.user_metadata?.first_name ?? '',
    lastName: sbUser.user_metadata?.last_name ?? '',
    accountType: sbUser.user_metadata?.account_type ?? 'buyer',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }

    toast({ title: 'Login successful!', description: 'Welcome back to VMK Store' });
    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          account_type: userData.accountType,
        },
      },
    });

    if (error) {
      setLoading(false);
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
      return false;
    }

    // Create the public.users profile row immediately after auth signup
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        account_type: userData.accountType,
      });

      if (profileError) {
        console.error('Profile creation failed:', profileError.message);
      }
    }

    setLoading(false);
    toast({ title: 'Registration successful!', description: 'Welcome to VMK Store' });
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out', description: 'You have been successfully logged out' });
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoggedIn: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
