import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function CreateStoryScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      <View className="mb-6 mt-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Lancer un récit</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">Définissez vos règles et invitez des auteurs.</Text>
      </View>
      
      {/* Conteneur temporaire */}
      <View className="p-8 items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
        <Text className="text-gray-400 text-center">Le formulaire de création sera configuré à l'étape suivante.</Text>
      </View>
    </ScrollView>
  );
}