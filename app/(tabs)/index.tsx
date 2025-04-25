import { Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { logout } from '@/firebase/auth';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IndexScreen() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockStatus, setLockStatus] = useState('locked');
  const [userData, setUserData] = useState<{ name?: string } | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user data from Firestore
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });
    
    return () => unsubscribe();
  }, []);
  
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
      
      // Example of writing to Firestore (access log)
      if (auth.currentUser) {
        // You can uncomment this when ready to write to Firestore
        /*
        const accessRef = collection(firestore, 'accessLogs');
        await addDoc(accessRef, {
          userId: auth.currentUser.uid,
          timestamp: new Date(),
          action: 'unlock',
          success: true
        });
        */
      }
    } catch (error) {
      console.error('Error unlocking:', error);
      setIsUnlocking(false);
      setLockStatus('locked');
    }
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
      {/* Welcome section */}
      <ThemedView style={styles.welcomeSection}>
        <ThemedText type="title" style={styles.title}>Smart Lock</ThemedText>
        <ThemedText style={styles.subtitle}>
          {userData ? `Welcome back, ${userData.name || 'User'}!` : 'Welcome back!'}
        </ThemedText>
      </ThemedView>

      {/* Main unlock button */}
      <ThemedView style={styles.unlockSection}>
        <TouchableOpacity 
          style={[styles.unlockButton, getButtonColor()]} 
          onPress={handleUnlock}
          disabled={isUnlocking}>
          <Ionicons 
            name={getLockIcon()} 
            size={48} 
            color="white" />
          <ThemedText style={styles.unlockButtonText}>
            {lockStatus === 'unlocking' ? "Opening..." : 
             lockStatus === 'unlocked' ? "Unlocked" : "Unlock"}
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
        
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#A1CEDC" />
          <ThemedText style={styles.actionText}>Logout</ThemedText>
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
