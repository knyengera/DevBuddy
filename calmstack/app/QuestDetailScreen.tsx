import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';


// Mock data for a single quest
const mockQuestDetails = {
  id: '1',
  title: 'Take a 5-minute walk',
  description: 'Step away from your desk and take a quick walk to refresh your mind and body.',
  category: 'daily',
  xp: 50,
  status: 'new',
  progress: 0,
  objectives: [
    'Put on comfortable shoes',
    'Step outside or use a treadmill',
    'Walk at a moderate pace for 5 minutes',
    'Take deep breaths and enjoy the break',
  ],
  timeRemaining: 3600, // in seconds
  tips: 'Try to do this quest during your lunch break or between long coding sessions.',
};

// Define a type for the route parameters
type QuestDetailRouteProp = RouteProp<{ QuestDetail: { questId: string } }, 'QuestDetail'>;

// Define a type for the quest details
type QuestDetails = {
  id: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  status: string;
  progress: number;
  objectives: string[];
  timeRemaining: number;
  tips: string;
};

export default function QuestDetailScreen() {
  const route = useRoute<QuestDetailRouteProp>();
  const navigation = useNavigation();
  const { questId } = route.params;
  const [quest, setQuest] = useState<QuestDetails | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch the quest details based on the questId
    setQuest(mockQuestDetails);
    setTimeRemaining(mockQuestDetails.timeRemaining);
  }, [questId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!quest) {
    return <Text>Loading...</Text>;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const handleStartQuest = () => {
    // Implement quest start logic
    console.log('Quest started');
  };

  const handleCompleteQuest = () => {
    // Implement quest completion logic
    console.log('Quest completed');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/350x150' }} style={styles.questImage} />
      <View style={styles.content}>
        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.description}>{quest.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objectives:</Text>
          {quest.objectives.map((objective, index) => (
            <View key={index} style={styles.objectiveItem}>
              <Text style={styles.objectiveBullet}>•</Text>
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards:</Text>
          <Text style={styles.rewardText}>{quest.xp} XP</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Remaining:</Text>
          <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips:</Text>
          <Text style={styles.tipsText}>{quest.tips}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartQuest}>
            <Text style={styles.buttonText}>Start Quest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={handleCompleteQuest}>
            <Text style={styles.buttonText}>Complete Quest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  questImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  objectiveBullet: {
    fontSize: 18,
    marginRight: 10,
  },
  objectiveText: {
    fontSize: 16,
  },
  rewardText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});