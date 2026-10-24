import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StatusScreen() {
  const router = useRouter();

  // राइड के स्टेप्स
  const steps = [
    { id: 1, title: 'Booking Confirmed', desc: 'Your ride has been booked.', time: '10:30 AM', isCompleted: true, isActive: false },
    { id: 2, title: 'Driver Assigned', desc: 'Ramesh Kumar is on the way.', time: '10:31 AM', isCompleted: true, isActive: false },
    { id: 3, title: 'Driver Arrived', desc: 'Driver is at your pickup location.', time: '10:35 AM', isCompleted: false, isActive: true },
    { id: 4, title: 'Ride Started', desc: 'Enjoy your ride to the destination.', time: '--', isCompleted: false, isActive: false },
    { id: 5, title: 'Ride Completed', desc: 'You have reached your destination.', time: '--', isCompleted: false, isActive: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚨 हेडर */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/home')}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Status</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🚨 राइड की जानकारी कार्ड */}
        <View style={styles.rideInfoCard}>
          <Text style={styles.rideId}>Ride ID: #GR-84729</Text>
          <View style={styles.locationRow}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.locationText}>Beltola Tiniali</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.locationRow}>
            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.locationText}>Guwahati Railway Station</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareValue}>₹150</Text>
          </View>
        </View>

        {/* 🚨 स्टेटस टाइमलाइन */}
        <Text style={styles.sectionTitle}>Live Tracking</Text>
        
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepWrapper}>
              
              {/* लाइन (आखिरी स्टेप को छोड़कर) */}
              {index !== steps.length - 1 && (
                <View style={[styles.line, step.isCompleted && styles.lineCompleted]} />
              )}

              {/* आइकॉन */}
              <View style={[
                styles.iconCircle, 
                step.isCompleted ? styles.iconCompleted : 
                step.isActive ? styles.iconActive : styles.iconInactive
              ]}>
                {step.isCompleted ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : step.isActive ? (
                  <View style={styles.pulseDot} />
                ) : (
                  <View style={styles.emptyDot} />
                )}
              </View>

              {/* टेक्स्ट */}
              <View style={styles.textContainer}>
                <Text style={[
                  styles.stepTitle, 
                  step.isActive ? {color: '#E65100'} : 
                  step.isCompleted ? {color: '#111'} : {color: '#999'}
                ]}>
                  {step.title}
                </Text>
                <Text style={[styles.stepDesc, step.isActive && {color: '#E65100', fontWeight: '600'}]}>
                  {step.desc}
                </Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 🚨 इमरजेंसी हेल्प बटन */}
        <TouchableOpacity style={styles.helpBtn}>
          <Ionicons name="shield-checkmark" size={20} color="#F44336" />
          <Text style={styles.helpText}>Emergency SOS</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  
  // हेडर
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },

  scrollContent: { padding: 20 },

  // राइड कार्ड
  rideInfoCard: { 
    backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 25,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 
  },
  rideId: { fontSize: 14, fontWeight: '700', color: '#888', marginBottom: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  locationText: { fontSize: 15, fontWeight: '600', color: '#333' },
  verticalLine: { width: 1, height: 20, backgroundColor: '#ccc', marginLeft: 4.5, marginVertical: 4 },
  cardDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  fareValue: { fontSize: 18, fontWeight: '800', color: '#111' },

  // टाइमलाइन
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 20 },
  timelineContainer: { paddingLeft: 10, marginBottom: 30 },
  
  stepWrapper: { flexDirection: 'row', position: 'relative', paddingBottom: 30 },
  
  // वर्टिकल लाइन
  line: { 
    position: 'absolute', left: 13, top: 28, width: 2, height: '100%', backgroundColor: '#E0E0E0' 
  },
  lineCompleted: { backgroundColor: '#FFC107' },

  // आइकॉन सर्कल
  iconCircle: { 
    width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', 
    marginRight: 15, zIndex: 2 
  },
  iconCompleted: { backgroundColor: '#FFC107' },
  iconActive: { backgroundColor: '#FFC107', borderWidth: 4, borderColor: '#FFFDE7' },
  iconInactive: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#ddd' },
  
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  emptyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },

  // टेक्स्ट
  textContainer: { flex: 1, marginTop: -2 },
  stepTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  stepDesc: { fontSize: 13, color: '#666', fontWeight: '500', marginBottom: 4 },
  stepTime: { fontSize: 11, color: '#999', fontWeight: '600' },

  // इमरजेंसी बटन
  helpBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFEBEE', paddingVertical: 15, borderRadius: 15, 
    borderWidth: 1, borderColor: '#FFCDD2'
  },
  helpText: { fontSize: 15, fontWeight: '800', color: '#F44336' }
});
