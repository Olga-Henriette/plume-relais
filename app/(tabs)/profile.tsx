import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { supabase } from '@/services/supabaseClient';
import { useProfile } from '@/features/auth/useProfile';
import { useSignOut } from '@/features/auth/useAuth';

export default function ProfileScreen() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { mutate: signOut, isPending: isLoggingOut } = useSignOut();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { data: profile, isLoading, error } = useProfile(userId);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Me déconnecter', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  if (isLoading || isLoggingOut) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
        <Text className="text-red-500 text-center mb-4">Erreur lors du chargement du profil.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      {/* En-tête Profil */}
      <View className="items-center my-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        {/* Avatar Placeholder Professionnel */}
        <View className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950 rounded-full justify-center items-center mb-4">
          <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {profile?.username?.substring(0, 2).toUpperCase() || 'PR'}
          </Text>
        </View>

        <Text className="text-xl font-bold text-gray-900 dark:text-white">@{profile?.username}</Text>
        
        {/* Score de réputation / Badges */}
        <View className="mt-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/60">
          <Text className="text-amber-700 dark:text-amber-400 text-xs font-semibold">
            ⭐ Score de réputation : {profile?.reputation_score || 0}
          </Text>
        </View>
      </View>

      {/* Bouton d'action de Déconnexion */}
      <TouchableOpacity
        className="w-full bg-red-50 dark:bg-red-950/30 p-4 rounded-xl items-center justify-center border border-red-200 dark:border-red-900/50 mt-4"
        onPress={handleLogout}
      >
        <Text className="text-red-600 dark:text-red-400 font-bold text-base">Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}