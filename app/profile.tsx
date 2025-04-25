import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { auth, firestore } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { logout } from '@/firebase/auth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [safeOpen, setSafeOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };
    
    loadUserData();
  }, []);

  const handleOpenSafe = () => {
    setSafeOpen(true);
    // Simulate safe opening
    Alert.alert("Opening Safe", "Safe is now being opened...");
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSafeOpen(false);
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Profile header */}
      <ThemedView style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="#1D3D47" />
        </View>
        <ThemedText type="title" style={styles.userName}>
          {userData?.name || auth.currentUser?.displayName || 'User'}
        </ThemedText>
        <ThemedText style={styles.userEmail}>
          {auth.currentUser?.email || 'No email'}
        </ThemedText>
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
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/settings')}>
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

      {/* Logout button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
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
    backgroundColor: '#A1CEDC',
    justifyContent: 'center',
    alignItems: 'center',
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
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
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
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D3D47',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 16,
  }
});