import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DriverMapScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');

  const startRide = () => {
    if (otp === '4582') {
      Alert.alert("Ride Started", "Have a safe journey with the customer!", [
        { text: "OK", onPress: () => {
            // राइड पूरी होने के बाद ड्राइवर वापस होम पेज पर आएगा
            router.replace('/driver');
        }}
      ]);
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct 4-digit OTP from the customer.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 मैप एरिया (डेमो) */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBg} />
        <Text style={{fontSize: 50}}>🗺️</Text>
        <Text style={styles.mapText}>Navigating to Pickup...</Text>
      </View>

      {/* 🚨 बॉटम शीट (OTP डालने के लिए) */}
      <KeyboardAvoidingView 
        style={styles.bottomSheet} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.dragHandle} />
        
        <Text style={styles.title}>Enter Customer OTP</Text>
        <Text style={styles.subtitle}>Ask the customer for the 4-digit PIN to start the ride.</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="----"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
          textAlign="center"
        />

        <TouchableOpacity style={styles.startBtn} onPress={startRide}>
          <Text style={styles.startBtnText}>Start Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.replace('/driver')}>
          <Text style={styles.cancelBtnText}>Cancel / Go Back</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0E0E0' },
  
  // मैप एरिया
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  mapBg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.1 },
  mapText: { fontSize: 16, fontWeight: '700', color: '#666', marginTop: 10 },

  // बॉटम शीट
  bottomSheet: { 
    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, 
    padding: 25, paddingBottom: 40, elevation: 10 
  },
  dragHandle: { width: 50, height: 5, backgroundColor: '#ddd', borderRadius: 5, alignSelf: 'center', marginBottom: 20 },
  
  title: { fontSize: 20, fontWeight: '800', color: '#111', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 5, marginBottom: 20 },

  otpInput: { 
    backgroundColor: '#F5F5F5', borderRadius: 15, fontSize: 30, fontWeight: '900', 
    letterSpacing: 10, paddingVertical: 15, marginBottom: 20, borderWidth: 2, borderColor: '#FFC107' 
  },

  startBtn: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  cancelBtn: { marginTop: 15, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#F44336' }
});
