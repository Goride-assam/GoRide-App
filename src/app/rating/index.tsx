import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RatingScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  // टैग्स की लिस्ट
  const tags = ['Safe Ride', 'Clean Vehicle', 'Polite Driver', 'Smooth Driving'];

  // टैग सेलेक्ट करने का फंक्शन
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const submitRating = () => {
    Alert.alert(
      "Thank You!",
      "Your feedback helps us improve GoRide.",
      [{ text: "OK", onPress: () => router.replace('/home') }] // सबमिट करने के बाद सीधा होम पेज पर वापस
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          
          {/* ड्राइवर का प्रोफाइल */}
          <View style={styles.driverAvatar}>
            <Text style={{fontSize: 50}}>🧑‍✈️</Text>
          </View>
          
          <Text style={styles.heading}>How was your ride?</Text>
          <Text style={styles.subHeading}>with Ramesh Kumar (Auto)</Text>

          {/* 🚨 5 स्टार रेटिंग */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={45} 
                  color={star <= rating ? "#FFC107" : "#E0E0E0"} 
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* 🚨 टैग्स (क्या अच्छा लगा?) */}
          <Text style={styles.tagTitle}>What went well?</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TouchableOpacity 
                key={tag} 
                style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🚨 कमेंट बॉक्स (Optional) */}
          <Text style={styles.tagTitle}>Any additional comments?</Text>
          <TextInput
            style={styles.input}
            placeholder="Tell us more about your experience..."
            placeholderTextColor="#888"
            multiline
            numberOfLines={3}
            value={feedback}
            onChangeText={setFeedback}
          />

        </View>

        {/* 🚨 सबमिट बटन */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={submitRating}>
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  content: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 40 },
  
  driverAvatar: { 
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFDE7', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    borderWidth: 3, borderColor: '#FFC107'
  },
  
  heading: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 5 },
  subHeading: { fontSize: 14, color: '#666', fontWeight: '500', marginBottom: 25 },

  // स्टार्स
  starsContainer: { flexDirection: 'row', marginBottom: 30 },

  // टैग्स
  tagTitle: { fontSize: 16, fontWeight: '700', color: '#333', alignSelf: 'flex-start', marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25, width: '100%' },
  tag: { 
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, 
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' 
  },
  tagSelected: { backgroundColor: '#FFFDE7', borderColor: '#FFC107' },
  tagText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tagTextSelected: { color: '#E65100', fontWeight: '700' },

  // इनपुट
  input: { 
    width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 15, 
    fontSize: 14, color: '#333', textAlignVertical: 'top', minHeight: 100,
    borderWidth: 1, borderColor: '#eee' 
  },

  // फुटर
  footer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  submitBtn: { backgroundColor: '#FFC107', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#111' }
});
