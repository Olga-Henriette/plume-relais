import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

export interface StoryDetails {
  id: string;
  title: string;
  is_blind_mode: boolean;
  status: string;
  creator_id: string;
  turns: {
    id: string;
    turn_number: number;
    status: string;
    ends_at: string;
    proposals: {
      id: string;
      paragraph_text: string;
      is_canon: boolean;
      author_id: string;
      profiles: { username: string } | null;
      proposal_votes: { profile_id: string }[]; // Liste des votes reçus
    }[];
  }[];
}

export const useStoryDetails = (storyId: string) => {
  return useQuery<StoryDetails | null>({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          is_blind_mode,
          status,
          creator_id,
          turns (
            id,
            turn_number,
            status,
            ends_at,
            proposals (
              id,
              paragraph_text,
              is_canon,
              author_id,
              profiles:author_id (username),
              proposal_votes (profile_id)
            )
          )
        `)
        .eq('id', storyId)
        .single();

      if (error) throw new Error(error.message);
      return data as unknown as StoryDetails;
    },
    enabled: !!storyId,
  });
};