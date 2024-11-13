import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../stores/index';

import WelcomeScreen from './WelcomeScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ChatbotScreen from './ChatbotScreen';
import QuestsScreen from './QuestsScreen';
import ProfileScreen from './ProfileScreen';
import QuestDetailScreen from './QuestDetailScreen'; // If needed

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header if desired
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Chatbot') {
            iconName = 'chatbubbles-outline';
          } else if (route.name === 'Quests') {
            iconName = 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else {
            iconName = 'default-icon'; // Provide a default icon name
          }

          // Return the icon component
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

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="LogIn" component={LogInScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Home" component={TabNavigator} /> 
            <Stack.Screen name="QuestDetail" component={QuestDetailScreen} /> 
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
