import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const scenarios = [
  { id: 1, title: 'Job Interview', icon: 'briefcase', level: 'Intermediate', duration: '15 min' },
  { id: 2, title: 'Restaurant Order', icon: 'food', level: 'Beginner', duration: '10 min' },
  { id: 3, title: 'Business Meeting', icon: 'presentation', level: 'Advanced', duration: '20 min' },
  { id: 4, title: 'Travel Conversation', icon: 'airplane', level: 'Intermediate', duration: '12 min' },
];

const ScenariosScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Learning Scenarios</Text>
      {scenarios.map((scenario) => (
        <TouchableOpacity key={scenario.id} style={styles.card}>
          <Icon name={scenario.icon} size={32} color="#6200ee" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{scenario.title}</Text>
            <Text style={styles.cardMeta}>{scenario.level} • {scenario.duration}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardMeta: { fontSize: 14, color: '#666', marginTop: 5 },
});

export default ScenariosScreen;
