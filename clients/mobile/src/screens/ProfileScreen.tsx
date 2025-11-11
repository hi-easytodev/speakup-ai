import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const settings = [
    { id: 1, title: 'Learning Level', value: 'Intermediate', icon: 'school' },
    { id: 2, title: 'Native Language', value: 'Russian', icon: 'translate' },
    { id: 3, title: 'Daily Goal', value: '30 minutes', icon: 'target' },
    { id: 4, title: 'Notifications', value: 'Enabled', icon: 'bell' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>
      {settings.map((setting) => (
        <TouchableOpacity key={setting.id} style={styles.settingCard}>
          <Icon name={setting.icon} size={24} color="#6200ee" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingValue}>{setting.value}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6200ee', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  email: { fontSize: 14, color: '#666', marginTop: 5 },
  settingCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 10, alignItems: 'center' },
  settingContent: { flex: 1, marginLeft: 15 },
  settingTitle: { fontSize: 16, fontWeight: '600' },
  settingValue: { fontSize: 14, color: '#666', marginTop: 5 },
});

export default ProfileScreen;
