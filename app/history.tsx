import { StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for history entries
// In a real app, you would fetch this from Firebase or your backend
const mockHistoryData = [
  { id: '1', method: 'remote', user: 'dupagowno@example.com', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', method: 'nfc', user: 'dupagowno', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: '3', method: 'remote', user: 'dupagowno', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: '4', method: 'nfc', user: 'dupagowno', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '5', method: 'remote', user: 'dupagowno', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
];

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
};

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState<{ id: string; method: string; user: string; timestamp: string }[]>([]);

  useEffect(() => {
    // In a real app, you would fetch data from Firebase
    // For now, we'll use the mock data
    setHistoryData(mockHistoryData);
  }, []);

  const renderHistoryItem = ({ item }: { item: { id: string; method: string; user: string; timestamp: string } }) => (
    <ThemedView style={styles.historyItem}>
      <ThemedView style={styles.iconContainer}>
        <Ionicons 
          name={item.method === 'remote' ? 'wifi' : 'radio-outline'} 
          size={24} 
          color="#A1CEDC" 
        />
      </ThemedView>
      <ThemedView style={styles.historyDetails}>
        <ThemedText style={styles.methodText}>
          {item.method === 'remote' ? 'Remote Unlock' : 'NFC Unlock'}
        </ThemedText>
        <ThemedText style={styles.userText}>{item.user}</ThemedText>
        <ThemedText style={styles.timeText}>{formatDate(item.timestamp)}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A1CEDC" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Unlock History</ThemedText>
      </ThemedView>

      {historyData.length > 0 ? (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="timer-outline" size={60} color="#A1CEDC" />
          <ThemedText style={styles.emptyText}>No history entries yet</ThemedText>
        </ThemedView>
      )}
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
    marginBottom: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 5,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#1D3D47',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A4853',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  historyDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  methodText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  userText: {
    fontSize: 15,
    opacity: 0.8,
    marginBottom: 3,
  },
  timeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    opacity: 0.7,
  }
});