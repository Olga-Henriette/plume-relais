import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useStoryDetails } from '@/features/stories/useStoryDetails';

export default function StoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: story, isLoading, error } = useStoryDetails(id || '');

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

  // Extraction propre des paragraphes Canon avec typage explicite
  const canonParagraphs = story.turns
    .flatMap((turn) => turn.proposals)
    .filter((proposal) => proposal.is_canon);

  // Règle du mode à l'aveugle
  const displayedParagraphs = story.is_blind_mode && story.status !== 'completed'
    ? canonParagraphs.slice(-1)
    : canonParagraphs;

  const activeTurn = story.turns.find((turn) => turn.status !== 'closed');

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: story.title,
          headerBackTitle: "Retour"
        }} 
      />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView className="flex-1 p-4">
          
          {story.is_blind_mode && story.status !== 'completed' && (
            <View className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4">
              <Text className="text-amber-800 text-xs font-semibold text-center">
                🔒 Mode à l'aveugle actif : Seul le dernier paragraphe est visible !
              </Text>
            </View>
          )}

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
        </ScrollView>

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