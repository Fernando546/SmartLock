import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Show loading while checking authentication state
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3785a1" />
      </View>
    );
  }

  // If user is already logged in, redirect to home
  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  // User is not logged in, show auth screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}