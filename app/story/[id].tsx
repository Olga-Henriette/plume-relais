import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Lock, ThumbsUp, CheckCircle2 } from 'lucide-react-native';
import { useStoryDetails } from '@/features/stories/useStoryDetails';
import { useVote } from '@/features/stories/useVote';
import { supabase } from '@/services/supabaseClient';
import { useResolveTurn } from '@/features/stories/useResolveTurn';
import { useStoryRealtime } from '@/features/stories/useStoryRealtime';

export default function StoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useStoryRealtime(id || '');

  const { data: story, isLoading, error } = useStoryDetails(id || '');
  const { mutate: toggleVote } = useVote(id || '');
  const { mutate: resolveTurn, isPending: isResolving } = useResolveTurn();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error || !story) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
        <Text className="text-red-500 text-center">Impossible de charger les détails du récit.</Text>
      </View>
    );
  }

  const canonParagraphs = story.turns
    .flatMap((turn) => turn.proposals)
    .filter((proposal) => proposal.is_canon);

  const activeTurn = story.turns.find((turn) => turn.status !== 'closed');
  const activeProposals = activeTurn 
    ? activeTurn.proposals.filter((p) => !p.is_canon)
    : [];

  const displayedParagraphs = story.is_blind_mode && story.status !== 'completed'
    ? canonParagraphs.slice(-1)
    : canonParagraphs;

  const handleVote = (proposalId: string) => {
    if (!userId) return;
    toggleVote({ proposalId, profileId: userId });
  };

  const handleResolveTurn = () => {
    if (!activeTurn) return;
    resolveTurn({
        storyId: story.id,
        currentTurnId: activeTurn.id,
        currentTurnNumber: activeTurn.turn_number,
        maxContributions: 20 // Reprend la limite ou injecte story.max_contributions si présent
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: story.title, headerBackTitle: "Retour" }} />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView className="flex-1 p-4">
          {story.status !== 'completed' && activeTurn && story.creator_id === userId && (
            <TouchableOpacity 
                disabled={isResolving}
                onPress={handleResolveTurn}
                className="bg-gray-800 dark:bg-gray-700 p-3 rounded-xl mb-4 items-center justify-center border border-gray-600"
            >
                <Text className="text-white text-xs font-bold">
                {isResolving ? 'Clôture du tour en cours...' : '🔧 Clôturer le tour (Simuler Admin)'}
                </Text>
            </TouchableOpacity>
          )}
          
          {/* Alerte Mode à l'aveugle avec icône vectorielle */}
          {story.is_blind_mode && story.status !== 'completed' && (
            <View className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl mb-4 flex-row items-center justify-center space-x-2">
              <Lock size={16} color="#B45309" />
              <Text className="text-amber-800 dark:text-amber-400 text-xs font-semibold">
                Mode à l'aveugle actif : Seul le dernier paragraphe est visible !
              </Text>
            </View>
          )}

          {/* Section Récit Canon */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 mb-6">
            {displayedParagraphs.map((para) => (
              <View key={para.id} className="mb-4">
                <Text className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                  {para.paragraph_text}
                </Text>
                <Text className="text-[11px] text-gray-400 mt-1">
                  — Écrit par @{para.profiles?.username || 'Anonyme'}
                </Text>
              </View>
            ))}
          </View>

          {/* Section Propositions avec boutons de vote professionnels */}
          {story.status !== 'completed' && activeProposals.length > 0 && (
            <View className="mb-8">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Suites proposées (Tour {activeTurn?.turn_number})
              </Text>
              
              {activeProposals.map((prop) => {
                const hasVoted = prop.proposal_votes.some((v) => v.profile_id === userId);
                return (
                  <View key={prop.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 mb-3 shadow-sm">
                    <Text className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {prop.paragraph_text}
                    </Text>
                    <View className="flex-row justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-700">
                      <Text className="text-xs text-gray-400">Par @{prop.profiles?.username}</Text>
                      
                      <TouchableOpacity 
                        onPress={() => handleVote(prop.id)}
                        className={`flex-row items-center px-3 py-1.5 rounded-lg border ${
                          hasVoted 
                            ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900' 
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                        }`}
                      >
                        <View className="mr-1.5">
                          {hasVoted ? (
                            <CheckCircle2 size={14} color="#4F46E5" />
                          ) : (
                            <ThumbsUp size={14} color="#6B7280" />
                          )}
                        </View>
                        <Text className={`text-xs font-bold mr-1.5 ${hasVoted ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {hasVoted ? 'Voté' : 'Voter'}
                        </Text>
                        <Text className={`text-xs font-semibold ${hasVoted ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                          {prop.proposal_votes.length}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Barre d'action basse */}
        {story.status !== 'completed' && activeTurn && (
          <View className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-8">
            <TouchableOpacity 
              className="w-full bg-indigo-600 p-4 rounded-xl items-center"
              onPress={() => router.push(`/story/contribute?turnId=${activeTurn.id}&storyId=${story.id}`)}
            >
              <Text className="text-white font-bold text-base">Ajouter un paragraphe</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}