import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { startQuest, completeQuest } from '../stores/slices/questSlice';

// Mock data for quests
const mockQuests = [
  { id: '1', title: 'Take a 5-minute walk', category: 'daily', xp: 50, status: 'new', progress: 0 },
  { id: '2', title: 'Meditate for 10 minutes', category: 'daily', xp: 100, status: 'in_progress', progress: 0.5 },
  { id: '3', title: 'Complete a coding challenge', category: 'weekly', xp: 200, status: 'new', progress: 0 },
  { id: '4', title: 'Read a tech article', category: 'daily', xp: 75, status: 'completed', progress: 1 },
];

// Define the Quest type
interface Quest {
  id: string;
  title: string;
  category: string;
  xp: number;
  status: string;
  progress: number;
}

// Define the type for your stack's parameters
type RootStackParamList = {
  QuestDetail: { questId: string };
  // Add other routes here if needed
};

// Define the type for the navigation prop
type QuestListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuestDetail'>;

// Define the type for the route prop (if needed)
type QuestListScreenRouteProp = RouteProp<RootStackParamList, 'QuestDetail'>;

const QuestItem = ({ quest, onPress }: { quest: Quest; onPress: () => void }) => (
  <TouchableOpacity style={styles.questItem} onPress={onPress}>
    <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.questIcon} />
    <View style={styles.questInfo}>
      <Text style={styles.questTitle}>{quest.title}</Text>
      <Text style={styles.questDescription}>Complete this quest to earn XP</Text>
      <View style={styles.questMeta}>
        <Text style={styles.xpText}>{quest.xp} XP</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${quest.progress * 100}%` }]} />
        </View>
        <Text style={styles.statusText}>{quest.status.replace('_', ' ')}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function QuestListScreen() {
  const [activeTab, setActiveTab] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<QuestListScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { quests, activeQuestId } = useAppSelector((state) => state.quests);

  const filteredQuests = mockQuests.filter(quest => 
    quest.category === activeTab && 
    quest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderQuestItem = ({ item }: { item: Quest }) => (
    <QuestItem 
      quest={item} 
      onPress={() => navigation.navigate('QuestDetail', { questId: item.id })}
    />
  );

  const handleStartQuest = (questId: string) => {
    dispatch(startQuest(questId));
  };

  const handleCompleteQuest = (questId: string) => {
    dispatch(completeQuest(questId));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search quests..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]} 
          onPress={() => setActiveTab('daily')}
        >
          <Text style={styles.tabText}>Daily Quests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]} 
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={styles.tabText}>Weekly Challenges</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredQuests}
        renderItem={renderQuestItem}
        keyExtractor={item => item.id}
        style={styles.questList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  questList: {
    flex: 1,
  },
  questItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  questIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  questMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressContainer: {
    flex: 1,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
});