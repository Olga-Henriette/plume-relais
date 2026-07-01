import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

export const useStoryRealtime = (storyId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!storyId) return;

    // Écouter les changements en temps réel sur l'histoire
    const channel = supabase
      .channel(`story-changes-${storyId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Inserts, Updates, Deletes
          schema: 'public',
          table: 'proposals',
        },
        () => {
          // Rafraîchit le cache React Query automatiquement
          queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes', 
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storyId, queryClient]);
};