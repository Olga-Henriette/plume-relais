import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  reputation_score: number;
  created_at: string;
}

export const useProfile = (userId: string | undefined) => {
  return useQuery<UserProfile | null>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!userId, // Exécute la requête uniquement si l'ID utilisateur est disponible
  });
};