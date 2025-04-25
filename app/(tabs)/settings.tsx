import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { logout } from '@/firebase/auth';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SettingsScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);

  useEffect(() => {
    // Load user settings
    const loadUserSettings = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            // Initialize settings from Firestore if they exist
            if (data.settings) {
              setNotificationsEnabled(data.settings.notifications ?? true);
              setBiometricEnabled(data.settings.biometricAuth ?? false);
              setAutoLockEnabled(data.settings.autoLock ?? true);
            }
          }
        } catch (error) {
          console.error('Error loading user settings:', error);
        }
      }
    };
    
    loadUserSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const updateSetting = async (setting: string, value: boolean) => {
    if (!auth.currentUser) return;
    
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        [`settings.${setting}`]: value
      });
    } catch (error) {
      console.error(`Error updating ${setting}:`, error);
      Alert.alert('Error', `Failed to update setting. Please try again.`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      
      {/* User Profile */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>User Account</ThemedText>
        
        <ThemedView style={styles.profileCard}>
          <ThemedView style={styles.profileIcon}>
            <Ionicons name="person" size={30} color="#A1CEDC" />
          </ThemedView>
          <ThemedView>
            <ThemedText style={styles.profileName}>{userData?.name || 'User'}</ThemedText>
            <ThemedText style={styles.profileEmail}>{auth.currentUser?.email}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      {/* App Settings */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>App Settings</ThemedText>
        
        <ThemedView style={styles.settingItem}>
          <ThemedText>Push Notifications</ThemedText>
          <Switch 
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value);
              updateSetting('notifications', value);
            }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notificationsEnabled ? "#3785a1" : "#f4f3f4"}
          />
        </ThemedView>
        
        <ThemedView style={styles.settingItem}>
          <ThemedText>Biometric Authentication</ThemedText>
          <Switch 
            value={biometricEnabled}
            onValueChange={(value) => {
              setBiometricEnabled(value);
              updateSetting('biometricAuth', value);
            }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={biometricEnabled ? "#3785a1" : "#f4f3f4"}
          />
        </ThemedView>
        
        <ThemedView style={styles.settingItem}>
          <ThemedText>Auto-Lock</ThemedText>
          <Switch 
            value={autoLockEnabled}
            onValueChange={(value) => {
              setAutoLockEnabled(value);
              updateSetting('autoLock', value);
            }}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={autoLockEnabled ? "#3785a1" : "#f4f3f4"}
          />
        </ThemedView>
      </ThemedView>
      
      {/* Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Actions</ThemedText>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#FF6B6B" style={styles.actionIcon} />
          <ThemedText style={styles.actionText}>Logout</ThemedText>
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
  header: {
    marginVertical: 16,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#A1CEDC',
  },
  profileCard: {
    backgroundColor: '#1D3D47',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    backgroundColor: '#0A1A1F',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1D3D47',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D3D47',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    color: '#FF6B6B',
  }
});