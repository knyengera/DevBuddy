import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatbotScreen from './ChatbotScreen';
import QuestsScreen from './QuestsScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Chatbot') {
            iconName = 'chatbubbles-outline';
          } else if (route.name === 'Quests') {
            iconName = 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else {
            iconName = 'default-icon';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 