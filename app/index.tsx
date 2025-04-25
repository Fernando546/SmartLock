import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IndexScreen() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockStatus, setLockStatus] = useState('locked');
  
  const handleUnlock = async () => {
    setIsUnlocking(true);
    
    try {
      // Here you would typically communicate with your lock API or Firebase
      // For now, we're just simulating it with a timeout
      setLockStatus('unlocking');
      
      // Simulate unlock process
      setTimeout(() => {
        setLockStatus('unlocked');
        setTimeout(() => {
          setLockStatus('locked');
          setIsUnlocking(false);
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Error unlocking:', error);
      setIsUnlocking(false);
      setLockStatus('locked');
    }
  };

  // Helper function to determine which lock icon to show
  const getLockIcon = () => {
    switch(lockStatus) {
      case 'unlocked':
        return "lock-open";
      case 'unlocking':
        return "hourglass";
      default:
        return "lock-closed";
    }
  }

  // Helper function to determine button color
  const getButtonColor = () => {
    switch(lockStatus) {
      case 'unlocked':
        return styles.unlockButtonSuccess;
      case 'unlocking':
        return styles.unlockButtonActive;
      default:
        return {};
    }
  }

  return (
    <ThemedView style={styles.container}>
      {/* Main unlock button section */}
      <ThemedView style={styles.unlockSection}>
        <TouchableOpacity 
          style={[styles.unlockButton, getButtonColor()]} 
          onPress={handleUnlock}
          disabled={isUnlocking}>
          <Ionicons 
            name={getLockIcon()} 
            size={64} 
            color="white" />
          <ThemedText style={styles.unlockButtonText}>
            {lockStatus === 'unlocking' ? "Opening..." : 
             lockStatus === 'unlocked' ? "Unlocked" : "Unlock"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Navigation buttons */}
      <ThemedView style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={30} color="#A1CEDC" />
          <ThemedText style={styles.navButtonText}>Settings</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={30} color="#A1CEDC" />
          <ThemedText style={styles.navButtonText}>Profile</ThemedText>
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
  unlockSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  unlockButton: {
    backgroundColor: '#1D3D47',
    borderRadius: 100,
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  unlockButtonActive: {
    backgroundColor: '#4CAF50',
  },
  unlockButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  unlockButtonText: {
    color: 'white',
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  navButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1D3D47',
    borderRadius: 15,
    width: '45%',
  },
  navButtonText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  }
});