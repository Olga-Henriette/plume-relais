import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

interface ResolveTurnInput {
  storyId: string;
  currentTurnId: string;
  currentTurnNumber: number;
  maxContributions: number;
}

export const useResolveTurn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storyId, currentTurnId, currentTurnNumber, maxContributions }: ResolveTurnInput) => {
      // 1. Récupérer toutes les propositions du tour avec leurs scores de votes
      const { data: proposals, error: fetchError } = await supabase
        .from('proposals')
        .select(`
          id,
          proposal_votes (id)
        `)
        .eq('turn_id', currentTurnId);

      if (fetchError) throw new Error(fetchError.message);

      if (!proposals || proposals.length === 0) {
        throw new Error("Aucune proposition soumise pour ce tour. Impossible de le clôturer.");
      }

      // 2. Trouver la proposition gagnante (celle avec le plus de votes)
      const winningProposal = proposals.reduce((max, prop) => 
        (prop.proposal_votes.length > max.proposal_votes.length) ? prop : max
      , proposals[0]);

      // 3. Marquer la proposition gagnante comme Canonique (officielle)
      const { error: canonError } = await supabase
        .from('proposals')
        .update({ is_canon: true })
        .eq('id', winningProposal.id);

      if (canonError) throw new Error(canonError.message);

      // 4. Clôturer le tour actuel
      const { error: closeTurnError } = await supabase
        .from('turns')
        .update({ status: 'closed' })
        .eq('id', currentTurnId);

      if (closeTurnError) throw new Error(closeTurnError.message);

      // 5. Vérifier si l'histoire a atteint sa limite
      if (currentTurnNumber >= maxContributions) {
        // Clôturer définitivement l'histoire
        const { error: closeStoryError } = await supabase
          .from('stories')
          .update({ status: 'completed' })
          .eq('id', storyId);

        if (closeStoryError) throw new Error(closeStoryError.message);
        return { status: 'story_completed' };
      } else {
        // Sinon, ouvrir le tour suivant (Ex: 24h de plus)
        const nextEndsAt = new Date(Date.now() + 86400 * 1000).toISOString();
        const { error: nextTurnError } = await supabase
          .from('turns')
          .insert({
            story_id: storyId,
            turn_number: currentTurnNumber + 1,
            ends_at: nextEndsAt,
            status: 'writing'
          });

        if (nextTurnError) throw new Error(nextTurnError.message);
        return { status: 'next_turn_opened', nextTurn: currentTurnNumber + 1 };
      }
    },
    onSuccess: (_, variables) => {
      // Rafraîchir l'affichage global du flux et des détails de cette histoire
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', variables.storyId] });
    },
  });
};