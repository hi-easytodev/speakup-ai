import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SpeakUp AI</Text>
      <Text style={styles.subtitle}>Your AI companion for English learning</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6200ee', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  buttonText: { color: '#6200ee', fontSize: 18, fontWeight: 'bold' },
});

export default OnboardingScreen;
