import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

export interface StoryItem {
  id: string;
  title: string;
  max_contributions: number;
  is_blind_mode: boolean;
  status: string;
  created_at: string;
  profiles: {
    username: string;
  } | null;
  turns: {
    id: string;
    turn_number: number;
    ends_at: string;
    status: string;
  }[];
}

export const useStories = () => {
  return useQuery<StoryItem[]>({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          max_contributions,
          is_blind_mode,
          status,
          created_at,
          profiles:creator_id (username),
          turns (id, turn_number, ends_at, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Filtrer pour obtenir le tour actif de chaque histoire
      return (data as any[]).map(story => ({
        ...story,
        turns: story.turns.filter((t: any) => t.status !== 'closed')
      })) as StoryItem[];
    },
  });
};