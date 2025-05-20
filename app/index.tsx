import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth, database } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, set, push } from 'firebase/database';

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
  const saveUnlockEvent = async (method: 'remote' | 'nfc') => {
    try {
      // Create a new unique ID for this unlock event
      const newEventRef = push(ref(database, 'openings'));
      
      // Save the unlock event data
      const unlockEvent = {
        method: method,
        user: method === 'remote' ? (auth.currentUser?.email || 'admin') : 'NFC User',
        timestamp: new Date().toISOString(),
      };
      
      await set(newEventRef, unlockEvent);
      console.log('Unlock event saved to database:', unlockEvent);
      
      // Update the locker lastOpen information
      await set(ref(database, 'lockers/A085E3E76DA0/lastOpen'), {
        method: method,
        user: method === 'remote' ? (auth.currentUser?.email || 'admin') : 'NFC User',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving unlock event:', error);
      Alert.alert('Error', 'Failed to save unlock event to database');
    }
  };

  const handleUnlock = async (method: 'remote' | 'nfc') => {
    // Don't allow remote unlock if not logged in
    if (method === 'remote' && !isLoggedIn) {
      Alert.alert('Access Denied', 'You need to be logged in as admin to use remote unlock');
      return;
    }

    setIsUnlocking(true);
    setLockStatus('unlocking');
    
    if (method === 'nfc') {
      try {
        // Make sure we have the correct path
        console.log('Updating Firebase: setting open to 1...');
        console.log('Database reference:', database ? 'Available' : 'Not available');
        
        try {
          await set(ref(database, 'lockers/A085E3E76DA0/open'), "1");
          console.log('Firebase database updated: open = 1');
          
          // Simulate unlock process
          setTimeout(() => {
            setLockStatus('unlocked');
            console.log('Lock status set to unlocked');
            
            // Save unlock event to database
            saveUnlockEvent(method);
            
            // After 3 seconds, reset lock state
            setTimeout(() => {
              // Reset the Firebase value back to "0"
              set(ref(database, 'lockers/A085E3E76DA0/open'), "0")
                .then(() => {
                  console.log('Firebase database reset: open = 0');
                  setLockStatus('locked');
                  setIsUnlocking(false);
                })
                .catch(error => {
                  console.error('Error resetting lock in Firebase:', error);
                  setLockStatus('locked');
                  setIsUnlocking(false);
                });
            }, 3000);
          }, 2000);
        } catch (writeError) {
          console.error('Firebase write error:', writeError);
          Alert.alert('Database Write Error', 'Could not write to Firebase. Check your connection and permissions.');
          setIsUnlocking(false);
          setLockStatus('locked');
        }
      } catch (error) {
        console.error('Firebase setup error:', error);
        Alert.alert('Database Error', 'Failed to setup database connection');
        setIsUnlocking(false);
        setLockStatus('locked');
      }
    } else {
      // Handle remote unlock
      try {
        console.log('Remote unlock: setting open to 1...');
        
        try {
          await set(ref(database, 'lockers/A085E3E76DA0/open'), "1");
          console.log('Firebase database updated: open = 1');
          
          setTimeout(() => {
            setLockStatus('unlocked');
            
            // Save unlock event to database
            saveUnlockEvent(method);
            
            setTimeout(() => {
              set(ref(database, 'lockers/A085E3E76DA0/open'), "0")
                .then(() => {
                  console.log('Firebase database reset: open = 0');
                  setLockStatus('locked');
                  setIsUnlocking(false);
                })
                .catch(error => {
                  console.error('Error resetting lock in Firebase:', error);
                  setLockStatus('locked');
                  setIsUnlocking(false);
                });
            }, 3000);
          }, 2000);
        } catch (writeError) {
          console.error('Firebase write error:', writeError);
          Alert.alert('Database Write Error', 'Could not write to Firebase. Check your connection and permissions.');
          setIsUnlocking(false);
          setLockStatus('locked');
        }
      } catch (error) {
        console.error('Firebase setup error:', error);
        Alert.alert('Database Error', 'Failed to setup database connection');
        setIsUnlocking(false);
        setLockStatus('locked');
      }
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