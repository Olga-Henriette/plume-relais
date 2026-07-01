import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { registerSchema, RegisterInput } from '@/features/auth/authSchema';
import { useSignUp } from '@/features/auth/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterInput) => {
    signUp(data, {
      onSuccess: () => {
        Alert.alert(
          'Compte créé !', 
          'Veuillez vérifier votre boîte de réception pour confirmer votre email avant de vous connecter.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)') }]
        );
      },
      onError: (error) => {
        Alert.alert('Erreur d\'inscription', error.message);
      },
    });
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Rejoindre l'aventure</Text>
        <Text className="text-gray-500 text-base">Créez un compte pour commencer à écrire vos lignes.</Text>
      </View>

      <View className="space-y-4 mb-6">
        {/* Champ Pseudo */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 mb-1">Nom d'utilisateur (Pseudo)</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-900"
                placeholder="Votre_Pseudo"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          {errors.username && <Text className="text-red-500 text-xs mt-1">{errors.username.message}</Text>}
        </View>

        {/* Champ Email */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 mb-1">Adresse Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-900"
                placeholder="exemple@email.com"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
        </View>

        {/* Champ Mot de passe */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 mb-1">Mot de passe</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-900"
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />
          {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
        </View>
      </View>

      {/* Bouton de soumission */}
      <TouchableOpacity
        className="w-full bg-indigo-600 p-4 rounded-xl items-center justify-center mb-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-base">Créer mon compte</Text>
        )}
      </TouchableOpacity>

      {/* Lien vers la connexion */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600">Déjà inscrit ? </Text>
        <Link href="/(auth)" asChild>
          <TouchableOpacity>
            <Text className="text-indigo-600 font-semibold">Se connecter</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}