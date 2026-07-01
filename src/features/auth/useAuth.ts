import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { LoginInput, RegisterInput } from './authSchema';

export const useSignIn = () => {
  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ email, password, username }: RegisterInput) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
  });
};