import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatScreen = ({ route }: any) => {
  const { mode = 'quick' } = route.params || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
      setInput('');
      // TODO: Call API to get AI response
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.micButton} onPress={toggleRecording}>
          <Icon name={isRecording ? 'microphone' : 'microphone-outline'} size={24} color={isRecording ? '#ff0000' : '#6200ee'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messagesList: { padding: 15 },
  message: { padding: 12, borderRadius: 15, marginBottom: 10, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#6200ee' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  messageText: { color: '#333', fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  micButton: { padding: 10 },
  sendButton: { backgroundColor: '#6200ee', padding: 12, borderRadius: 25 },
});

export default ChatScreen;
