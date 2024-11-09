import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define a type for your navigation routes
type RootStackParamList = {
  ChatbotScreen: undefined;
  QuestsScreen: undefined;
  ProfileScreen: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Developer!</Text>
        <Text style={styles.stats}>Level 5 | 1200 XP</Text>
      </View>
      <View style={styles.quickAccess}>
        <TouchableOpacity 
          style={styles.quickAccessButton} 
          onPress={() => navigation.navigate('ChatbotScreen')}
        >
          <Text style={styles.quickAccessText}>Chatbot</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAccessButton} 
          onPress={() => navigation.navigate('QuestsScreen')}
        >
          <Text style={styles.quickAccessText}>Quests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAccessButton} 
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.quickAccessText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {/* Add your recent activity feed items here */}
        <Text style={styles.activityItem}>Completed daily meditation quest</Text>
        <Text style={styles.activityItem}>Earned 'Early Bird' badge</Text>
        <Text style={styles.activityItem}>Started a new coding streak</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  stats: {
    fontSize: 16,
    color: '#fff',
  },
  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  quickAccessButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAccessText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  recentActivity: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  activityItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    color: '#333',
  },
});