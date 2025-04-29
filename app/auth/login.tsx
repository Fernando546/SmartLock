import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginWithEmail, registerWithEmail } from '@/firebase/auth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
  
  };



  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerSection}>
        <ThemedText type="title" style={styles.title}>Smart Lock</ThemedText>
        <ThemedText style={styles.subtitle}>
          
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.formSection}>
   
        
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
              Login
            </ThemedText>
          )}
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