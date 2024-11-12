import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerUser } from '../services/apiService'; // Ensure this import is correct

// Define a type for your navigation routes
type RootStackParamList = {
  Home: undefined;
  LogIn: undefined;
};

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    console.log('SignUp button pressed');
    console.log('Agree to terms:', agreeToTerms);
    if (!agreeToTerms) {
      Alert.alert('Error', 'You must agree to the terms and conditions.');
      return;
    }
  
    console.log('Passwords:', password, confirmPassword);
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    try {
      console.log('Calling registerUser');
      const response = await registerUser(username, email, password);
      console.log('registerUser response:', response);
      Alert.alert('Success', 'User registered successfully.');
      navigation.navigate('LogIn');
    } catch (error) {
      console.log('registerUser error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.termsContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
        <View style={[styles.checkbox, agreeToTerms && styles.checked]} />
         <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.logInContainer}>
        <Text style={styles.logInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
          <Text style={styles.logInLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logInContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logInText: {
    color: '#333',
  },
  logInLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});