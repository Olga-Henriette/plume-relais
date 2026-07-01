import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { loginSchema, LoginInput } from '@/features/auth/authSchema';
import { useSignIn } from '@/features/auth/useAuth';

export default function SignInScreen() {
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginInput) => {
    signIn(data, {
      onSuccess: () => {
        // Redirection vers l'application principale après succès
        router.replace('/(tabs)');
      },
      onError: (error) => {
        Alert.alert('Erreur de connexion', error.message);
      },
    });
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Plume Relais</Text>
        <Text className="text-gray-500 text-base">Connectez-vous pour co-écrire des histoires uniques.</Text>
      </View>

      <View className="space-y-4 mb-6">
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
          <Text className="text-white font-bold text-base">Se connecter</Text>
        )}
      </TouchableOpacity>

      {/* Lien vers l'inscription */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600">Pas encore de compte ? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text className="text-indigo-600 font-semibold">S'inscrire</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}