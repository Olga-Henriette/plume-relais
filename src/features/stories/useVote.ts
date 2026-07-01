import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

interface VoteInput {
  proposalId: string;
  profileId: string;
}

export const useVote = (storyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, profileId }: VoteInput) => {
      // 1. Vérifier si le vote existe déjà pour éviter les doublons (Toggle vote)
      const { data: existingVote, error: checkError } = await supabase
        .from('proposal_votes')
        .select('id')
        .eq('proposal_id', proposalId)
        .eq('profile_id', profileId)
        .maybeSingle();

      if (checkError) throw new Error(checkError.message);

      if (existingVote) {
        // Si le vote existe, on le retire
        const { error: deleteError } = await supabase
          .from('proposal_votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) throw new Error(deleteError.message);
        return { action: 'removed' };
      } else {
        // Sinon, on ajoute le vote
        const { error: insertError } = await supabase
          .from('proposal_votes')
          .insert({
            proposal_id: proposalId,
            profile_id: profileId,
          });

        if (insertError) throw new Error(insertError.message);
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      // Rafraîchir les détails du récit pour mettre à jour les comptes de votes à l'écran
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
    },
  });
};