import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { setOnlineStatus } from '../stores/slices/connectivitySlice';
import { checkConnectivity } from '../services/apiService';
import OfflineScreen from './components/OfflineScreen';

import WelcomeScreen from './WelcomeScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import TabNavigator from './TabNavigator';
import QuestDetailScreen from './QuestDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { isOnline } = useAppSelector((state) => state.connectivity);

  const checkConnection = async () => {
    const online = await checkConnectivity();
    dispatch(setOnlineStatus(online));
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isOnline) {
    return <OfflineScreen onRetry={checkConnection} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="QuestDetail" component={QuestDetailScreen} />
    </Stack.Navigator>
  );
} 