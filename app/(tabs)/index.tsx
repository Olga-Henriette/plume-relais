import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useStories } from '@/features/stories/useStories';
import { useRouter } from 'expo-router';

export default function FeedScreen() {
  const router = useRouter();
  const { data: stories, isLoading, error, refetch, isFetching } = useStories();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
        <Text className="text-red-500 text-center">Impossible de charger les histoires.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-gray-900 p-4"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#4F46E5" />}
    >
      <View className="mb-6 mt-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Vos récits collaboratifs</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">Découvrez ou contribuez à une histoire en cours.</Text>
      </View>

      {isFetching && !isLoading && (
        <View className="w-full bg-indigo-50 dark:bg-indigo-950/30 py-1 px-3 rounded-md mb-2 flex-row justify-center items-center">
          <Text className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Mise à jour du récit en cours...
          </Text>
        </View>
      )}

      {stories && stories.length === 0 ? (
        <View className="p-8 items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <Text className="text-gray-400 text-center">Aucune histoire en cours. Lancez la première !</Text>
        </View>
      ) : (
        stories?.map((story) => {
          const activeTurn = story.turns[0];
          const turnLabel = activeTurn ? `Tour ${activeTurn.turn_number}` : 'Terminé';
          
          return (
            <TouchableOpacity 
              key={story.id} 
              onPress={() => router.push(`/story/${story.id}`)}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4 active:opacity-70"
            >
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {story.status === 'completed' ? 'Complété' : `En cours • ${turnLabel}`}
                  </Text>
                </View>
                {story.is_blind_mode && (
                  <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                    <Text className="text-[10px] text-gray-500 dark:text-gray-300 font-medium">À l'aveugle</Text>
                  </View>
                )}
              </View>

              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">{story.title}</Text>
              <Text className="text-xs text-gray-400 mb-3">Initié par @{story.profiles?.username || 'Anonyme'}</Text>

              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-50 dark:border-gray-700">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Limite : {story.max_contributions} paragraphes
                </Text>
                
                <View className="bg-indigo-600 px-4 py-2 rounded-xl">
                  <Text className="text-white text-xs font-bold">
                    {story.status === 'completed' ? 'Lire' : 'Rejoindre'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}