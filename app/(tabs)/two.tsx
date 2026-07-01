import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabaseClient';
import { createStorySchema, CreateStoryInput } from '@/features/stories/storiesSchema';
import { useCreateStory } from '@/features/stories/useCreateStory';

export default function CreateStoryScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { mutate: createStory, isPending } = useCreateStory();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<CreateStoryInput>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      title: '',
      firstParagraph: '',
      maxContributions: 20,
      turnDurationSeconds: 86400, // 24h par défaut
      isBlindMode: true,
      isPrivate: false,
    },
  });

  const onSubmit = (data: CreateStoryInput) => {
    if (!userId) return;

    createStory({ input: data, creatorId: userId }, {
      onSuccess: () => {
        Alert.alert('Succès !', 'Votre histoire collaborative a été créée avec succès.', [
          { text: 'Super', onPress: () => { reset(); router.replace('/(tabs)'); } }
        ]);
      },
      onError: (error) => {
        Alert.alert('Erreur', error.message);
      }
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      <View className="mb-6 mt-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Lancer un nouveau récit</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">Posez les bases et écrivez les premières lignes de l'aventure.</Text>
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 mb-8">
        {/* Titre */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Titre de l'histoire</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Ex: Le Secret de Sarondrano"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>}
        </View>

        {/* Premier Paragraphe */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Paragraphe d'ouverture (Amorce)</Text>
          <Controller
            control={control}
            name="firstParagraph"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-32"
                placeholder="Commencez à écrire ici pour guider les prochains auteurs..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.firstParagraph && <Text className="text-red-500 text-xs mt-1">{errors.firstParagraph.message}</Text>}
        </View>

        {/* Mode à l'aveugle Switch */}
        <View className="flex-row justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <View className="pr-4 flex-1">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">Relais à l'aveugle</Text>
            <Text className="text-xs text-gray-400">Les auteurs ne voient que le dernier paragraphe écrit.</Text>
          </View>
          <Controller
            control={control}
            name="isBlindMode"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} trackColor={{ true: '#6366F1' }} />
            )}
          />
        </View>

        {/* Bouton Soumettre */}
        <TouchableOpacity
          className="w-full bg-indigo-600 p-4 rounded-xl items-center justify-center mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base">Publier et lancer le récit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}