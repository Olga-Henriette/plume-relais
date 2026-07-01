import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

interface SubmitProposalInput {
  turnId: string;
  authorId: string;
  paragraphText: string;
}

export const useSubmitProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ turnId, authorId, paragraphText }: SubmitProposalInput) => {
      const { data, error } = await supabase
        .from('proposals')
        .insert({
          turn_id: turnId,
          author_id: authorId,
          paragraph_text: paragraphText,
          is_canon: false, // Reste une simple proposition en attente de vote
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalide le cache des détails de cette histoire spécifique pour actualiser la liste des propositions
      queryClient.invalidateQueries({ queryKey: ['story'] });
    },
  });
};