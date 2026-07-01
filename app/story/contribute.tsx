import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { supabase } from '@/services/supabaseClient';
import { useSubmitProposal } from '@/features/stories/useSubmitProposal';

export default function ContributeScreen() {
  const { turnId, storyId } = useLocalSearchParams<{ turnId: string; storyId: string }>();
  const router = useRouter();
  
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [paragraphText, setParagraphText] = useState('');
  
  const { mutate: submitProposal, isPending } = useSubmitProposal();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const handleSubmit = () => {
    if (!userId || !turnId) return;

    const textLength = paragraphText.trim().length;
    if (textLength < 10) {
      Alert.alert('Texte trop court', 'Votre paragraphe doit faire au moins 10 caractères.');
      return;
    }
    if (textLength > 1000) {
      Alert.alert('Texte trop long', 'Votre paragraphe ne doit pas dépasser 1000 caractères.');
      return;
    }

    submitProposal(
      { turnId, authorId: userId, paragraphText: paragraphText.trim() },
      {
        onSuccess: () => {
          Alert.alert('Merci !', 'Votre proposition de paragraphe a été soumise avec succès pour ce tour.', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        },
        onError: (error) => {
          Alert.alert('Erreur', error.message);
        }
      }
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Rédiger une suite', headerBackTitle: 'Retour' }} />
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        <View className="mb-6 mt-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Votre contribution</Text>
          <Text className="text-gray-500 dark:text-gray-400 mt-1">
            Ajoutez un paragraphe captivant. Les autres auteurs voteront pour la meilleure suite !
          </Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <View>
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contenu du paragraphe</Text>
            <TextInput
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-48"
              placeholder="Continuez l'intrigue avec inspiration..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={paragraphText}
              onChangeText={setParagraphText}
            />
            <Text className="text-right text-xs text-gray-400 mt-2">
              {paragraphText.length} / 1000 caractères
            </Text>
          </View>

          <TouchableOpacity
            className="w-full bg-indigo-600 p-4 rounded-xl items-center justify-center mt-2"
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-base">Soumettre ma proposition</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}