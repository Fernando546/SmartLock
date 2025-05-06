import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Reset fields after successful login
      setEmail('');
      setPassword('');
      // Navigate back to main screen
      router.replace('/');
    } catch (error: any) {
      // Show error message
      Alert.alert('Login Failed', 'Invalid email or password. Only admin can login.');
      console.error('Login error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A1CEDC" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Admin Login</ThemedText>
      </ThemedView>

      <ThemedView style={styles.formContainer}>
        <Ionicons name="lock-closed" size={60} color="#A1CEDC" style={styles.lockIcon} />
        <ThemedText style={styles.subtitle}>Login to access admin features</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#A1CEDC" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Admin Email"
            placeholderTextColor="#607D8B"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <Ionicons name="key" size={24} color="#A1CEDC" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#607D8B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#607D8B" 
            />
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="log-in" size={24} color="white" />
              <ThemedText style={styles.loginText}>Login</ThemedText>
            </>
          )}
        </TouchableOpacity>

        <ThemedText style={styles.adminNote}>
          Note: Only admin users can login to this portal
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  formContainer: {
    alignItems: 'center',
    padding: 20,
  },
  lockIcon: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 60,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 60,
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3785a1',
    borderRadius: 10,
    width: '100%',
    height: 60,
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  adminNote: {
    marginTop: 30,
    opacity: 0.7,
    textAlign: 'center',
  },
});