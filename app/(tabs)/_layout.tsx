import { Tabs } from "expo-router";
import { useColorScheme, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5', // Indigo brand
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: isDark ? '#FFFFFF' : '#111827',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Histoires",
          headerTitle: "Plume Relais",
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Créer",
          headerTitle: "Nouvelle Histoire",
        }}
      />
    </Tabs>
  );
}