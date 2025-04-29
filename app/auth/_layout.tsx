import { useEffect, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const [user, setUser] = useState<null | { uid: string }>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3785a1" />
      </View>
    );
  }

  // If user is already authenticated, redirect to the main app
  if (user) {
    return <Redirect href="/" />;
  }

  // User is not authenticated, show login/register screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}