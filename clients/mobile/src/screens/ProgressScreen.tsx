import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ProgressScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Score</Text>
        <Text style={styles.score}>85%</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Grammar</Text>
        <View style={styles.progressBar}><View style={[styles.progress, { width: '90%' }]} /></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pronunciation</Text>
        <View style={styles.progressBar}><View style={[styles.progress, { width: '75%' }]} /></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fluency</Text>
        <View style={styles.progressBar}><View style={[styles.progress, { width: '80%' }]} /></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 16, color: '#666', marginBottom: 10 },
  score: { fontSize: 48, fontWeight: 'bold', color: '#6200ee' },
  progressBar: { height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: '#6200ee' },
});

export default ProgressScreen;
