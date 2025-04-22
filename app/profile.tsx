import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  const [safeOpen, setSafeOpen] = useState(false);

  const handleOpenSafe = () => {
    setSafeOpen(true);
    // Simulate safe opening
    Alert.alert("Opening Safe", "Safe is now being opened...");
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSafeOpen(false);
    }, 3000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Profile header */}
      <ThemedView style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          
        </View>
        <ThemedText type="title" style={styles.userName}>John Doe</ThemedText>
        <ThemedText style={styles.userEmail}>john.doe@example.com</ThemedText>
      </ThemedView>

      {/* Safe opening button */}
      <ThemedView style={styles.safeSection}>
        <TouchableOpacity 
          style={[styles.safeButton, safeOpen && styles.safeButtonActive]} 
          onPress={handleOpenSafe}
          disabled={safeOpen}
        >
          <Ionicons 
            name={safeOpen ? "lock-open" : "lock-closed"} 
            size={64} 
            color="white" 
          />
        </TouchableOpacity>
        <ThemedText style={styles.safeButtonText}>
          {safeOpen ? "Opening Safe..." : "Tap to Open Safe"}
        </ThemedText>
      </ThemedView>

      {/* Quick actions */}
      <ThemedView style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>Settings</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="key-outline" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>Access Codes</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time-outline" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>History</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
  },
  safeSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  safeButton: {
    backgroundColor: '#1D3D47',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  safeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  safeButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
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