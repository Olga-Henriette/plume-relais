import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { CreateStoryInput } from './storiesSchema';

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ input, creatorId }: { input: CreateStoryInput; creatorId: string }) => {
      // 1. Insérer l'histoire
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert({
          creator_id: creatorId,
          title: input.title,
          max_contributions: input.maxContributions,
          turn_duration_seconds: input.turnDurationSeconds,
          is_blind_mode: input.isBlindMode,
          is_private: input.isPrivate,
          status: 'ongoing', // Passe directement en cours car le premier paragraphe est écrit
        })
        .select()
        .single();

      if (storyError) throw new Error(storyError.message);

      // 2. Créer automatiquement le membre créateur dans l'histoire
      await supabase.from('story_members').insert({
        story_id: story.id,
        profile_id: creatorId,
      });

      // 3. Créer le premier tour (Turn 1)
      const endsAt = new Date(Date.now() + input.turnDurationSeconds * 1000).toISOString();
      const { data: turn, error: turnError } = await supabase
        .from('turns')
        .insert({
          story_id: story.id,
          turn_number: 1,
          ends_at: endsAt,
          status: 'writing',
        })
        .select()
        .single();

      if (turnError) throw new Error(turnError.message);

      // 4. Insérer le paragraphe d'ouverture comme la première proposition validée (Canon)
      const { error: proposalError } = await supabase
        .from('proposals')
        .insert({
          turn_id: turn.id,
          author_id: creatorId,
          paragraph_text: input.firstParagraph,
          is_canon: true,
        });

      if (proposalError) throw new Error(proposalError.message);

      return story;
    },
    onSuccess: () => {
      // Invalider le cache pour forcer le rafraîchissement du fil d'actualité
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
};