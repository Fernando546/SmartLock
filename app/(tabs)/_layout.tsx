import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase/config';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';

export default function TabsLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // User will either be null (not logged in) or the admin user
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3785a1" />
      </View>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // User is authenticated as admin, show tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3785a1',
        tabBarInactiveTintColor: '#607D8B',
        tabBarStyle: {
          backgroundColor: '#0A1A1F',
          borderTopColor: '#1D3D47',
        },
        headerStyle: {
          backgroundColor: '#0A1A1F',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
