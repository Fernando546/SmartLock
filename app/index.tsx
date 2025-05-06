import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IndexScreen() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockStatus, setLockStatus] = useState('locked');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleUnlock = async (method: 'remote' | 'nfc') => {
    // Don't allow remote unlock if not logged in
    if (method === 'remote' && !isLoggedIn) {
      Alert.alert('Access Denied', 'You need to be logged in as admin to use remote unlock');
      return;
    }

    setIsUnlocking(true);
    
    try {
      // Here you would communicate with your lock API or Firebase
      setLockStatus('unlocking');
      
      // Simulate unlock process
      setTimeout(() => {
        setLockStatus('unlocked');
        
        // Add unlock event to history (this would be Firebase in a real app)
        const unlockEvent = {
          method,
          user: method === 'remote' ? (auth.currentUser?.email || 'admin') : 'NFC User',
          timestamp: new Date().toISOString(),
        };
        console.log('Unlock event:', unlockEvent);
        
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
      {/* Main unlock buttons section */}
      <ThemedView style={styles.unlockSection}>
        <ThemedText style={styles.titleText}>Safe Unlock</ThemedText>
        
        <ThemedView style={styles.buttonsContainer}>
          {/* Remote unlock button */}
          <TouchableOpacity 
            style={[
              styles.unlockButton, 
              getButtonColor(),
              !isLoggedIn && styles.disabledButton
            ]} 
            onPress={() => handleUnlock('remote')}
            disabled={isUnlocking || !isLoggedIn}>
            <Ionicons 
              name="wifi" 
              size={40} 
              color={isLoggedIn ? "white" : "#888888"} />
            <ThemedText style={[styles.unlockButtonText, !isLoggedIn && styles.disabledText]}>
              {!isLoggedIn ? "Login Required" : 
                lockStatus === 'unlocking' ? "Opening..." : 
                lockStatus === 'unlocked' ? "Unlocked" : "Remote Unlock"}
            </ThemedText>
          </TouchableOpacity>

          {/* NFC unlock button */}
          <TouchableOpacity 
            style={[styles.unlockButton, getButtonColor()]} 
            onPress={() => handleUnlock('nfc')}
            disabled={isUnlocking}>
            <Ionicons 
              name="radio-outline" 
              size={40} 
              color="white" />
            <ThemedText style={styles.unlockButtonText}>
              {lockStatus === 'unlocking' ? "Opening..." : 
                lockStatus === 'unlocked' ? "Unlocked" : "NFC Unlock"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Lock status indicator */}
        <ThemedView style={styles.statusContainer}>
          <Ionicons 
            name={getLockIcon()} 
            size={44} 
            color={lockStatus === 'unlocked' ? "#4CAF50" : "#A1CEDC"} />
          <ThemedText style={styles.statusText}>
            {lockStatus === 'unlocking' ? "Opening safe..." : 
             lockStatus === 'unlocked' ? "Safe unlocked" : "Safe locked"}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Navigation buttons */}
      <ThemedView style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/history')}>
          <Ionicons name="time-outline" size={30} color="#A1CEDC" />
          <ThemedText style={styles.navButtonText}>History</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={isLoggedIn ? handleLogout : () => router.push('/auth/login')}>
          <Ionicons name={isLoggedIn ? "log-out-outline" : "person-outline"} size={30} color="#A1CEDC" />
          <ThemedText style={styles.navButtonText}>{isLoggedIn ? "Logout" : "Login"}</ThemedText>
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
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  unlockButton: {
    backgroundColor: '#1D3D47',
    borderRadius: 20,
    height: 160,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    padding: 15,
  },
  unlockButtonActive: {
    backgroundColor: '#4CAF50',
  },
  unlockButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#37474F',
    opacity: 0.7,
  },
  unlockButtonText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledText: {
    color: '#BBBBBB',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#1D3D47',
    padding: 15,
    borderRadius: 15,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 18,
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