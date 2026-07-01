import { Link, Stack } from 'expo-router';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View className="flex-1 items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops !</Text>
        <Text className="text-gray-500 text-center mb-6">Cet écran n'existe pas ou a été déplacé.</Text>

        <Link href="/" asChild>
          <TouchableOpacity className="bg-indigo-600 px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold">Retour à l'accueil</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}