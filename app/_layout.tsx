import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </ThemeProvider>
  );
}
