import { SplashScreen, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Mark as initialized once we have the auth state
      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Hide the splash screen once we're initialized
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  // Just render the slot regardless of auth state
  // We'll handle redirects in the child layouts/screens
  return <Slot />;
}
