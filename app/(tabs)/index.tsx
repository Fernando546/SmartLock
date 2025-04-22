import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IndexScreen() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  const handleUnlock = () => {
    setIsUnlocking(true);
    // Simulate unlock process
    setTimeout(() => {
      setIsUnlocking(false);
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Welcome section */}
      <ThemedView style={styles.welcomeSection}>
        <ThemedText type="title" style={styles.title}>Smart Lock</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome back!</ThemedText>
      </ThemedView>

      {/* Main unlock button */}
      <ThemedView style={styles.unlockSection}>
        <TouchableOpacity 
          style={[styles.unlockButton, isUnlocking && styles.unlockButtonActive]} 
          onPress={handleUnlock}
          disabled={isUnlocking}>
          <Ionicons 
            name={isUnlocking ? "lock-open" : "lock-closed"} 
            size={48} 
            color="white" />
          <ThemedText style={styles.unlockButtonText}>
            {isUnlocking ? "Opening..." : "Unlock"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Quick action shortcuts */}
      <ThemedView style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="person" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>Profile</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>History</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>Settings</ThemedText>
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
  welcomeSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  unlockSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  unlockButton: {
    backgroundColor: '#1D3D47',
    borderRadius: 75,
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  unlockButtonActive: {
    backgroundColor: '#4CAF50',
  },
  unlockButtonText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    width: '30%',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  }
});
