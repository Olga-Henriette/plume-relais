import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function FeedScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      <View className="mb-6 mt-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Vos récits collaboratifs</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">Découvrez ou contribuez à une histoire en cours.</Text>
      </View>

      {/* Placeholder d'une carte d'histoire (Professionnelle et moderne) */}
      <View className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">En cours • Tour 3</Text>
          </View>
          <Text className="text-xs text-gray-400">Il reste 2h 45m</Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">Le Secret de Sarondrano</Text>
        <Text className="text-gray-600 dark:text-gray-300 text-sm numberOfLines={3}">
          L'eau de la grotte scintillait d'une lueur azur anormale. Personne n'osait s'y aventurer après le coucher du soleil, sauf les ombres...
        </Text>

        <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Text className="text-xs text-gray-500 dark:text-gray-400">4 participants</Text>
          <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-xl">
            <Text className="text-white text-xs font-bold">Rejoindre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}