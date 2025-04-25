import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '@/firebase/auth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (isRegistering && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        // Register new user
        await registerWithEmail(email, password, name);
        Alert.alert('Success', 'Account created successfully');
      } else {
        // Login existing user
        await loginWithEmail(email, password);
      }
      router.replace('/auth/login');
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.replace('/auth/login');
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred with Google sign in';
      Alert.alert('Google Sign-In Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerSection}>
        <ThemedText type="title" style={styles.title}>Smart Lock</ThemedText>
        <ThemedText style={styles.subtitle}>
          {isRegistering ? 'Create a new account' : 'Sign in to your account'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.formSection}>
        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A1CEDC"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A1CEDC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A1CEDC"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.authButton} 
          onPress={handleEmailAuth}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.authButtonText}>
              {isRegistering ? 'Register' : 'Sign In'}
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleSignIn}
          disabled={isLoading}>
          <Ionicons name="logo-google" size={20} color="white" style={styles.googleIcon} />
          <ThemedText style={styles.authButtonText}>
            Sign in with Google
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.switchModeButton}>
          <ThemedText style={styles.switchModeText}>
            {isRegistering 
              ? 'Already have an account? Sign in' 
              : 'Need an account? Register'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  formSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#1D3D47',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    width: '100%',
    color: 'white',
  },
  authButton: {
    backgroundColor: '#3785a1',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchModeButton: {
    marginTop: 10,
  },
  switchModeText: {
    color: '#A1CEDC',
  },
});