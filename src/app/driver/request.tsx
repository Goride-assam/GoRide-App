import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DriverRideRequestScreen() {
  const router = useRouter();

  const handleAccept = () => {
    router.replace('/driver/map'); // राइड स्वीकार करने पर मैप पर ले जाएं
  };

  const handleReject = () => {
    router.replace('/driver'); // रिजेक्ट करने पर वापस होम पर
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 ऊपर का मैप एरिया */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/city-map-navigation-concept_23-2148675956.jpg?w=740' }} 
          style={styles.mapImage} 
          resizeMode="cover"
        />
        
        {/* पिकअप पिन */}
        <View style={styles.pickupPin}>
          <Ionicons name="location" size={30} color="#4CAF50" />
        </View>

        {/* टाइमर */}
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>15s</Text>
        </View>
      </View>

      {/* 🚨 नीचे का कार्ड */}
      <View style={styles.requestCard}>
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={{fontSize: 24}}>👩</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Emma Sharma</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>Earn</Text>
            <Text style={styles.fareAmount}>₹150</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>PICKUP</Text>
              <Text style={styles.locationText}>Beltola Tiniali, Guwahati</Text>
            </View>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.locationRow}>
            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>DROP</Text>
              <Text style={styles.locationText}>Guwahati Railway Station</Text>
            </View>
          </View>
        </View>

        <View style={styles.tripStats}>
          <View style={styles.statItem}>
            <Ionicons name="map-outline" size={18} color="#666" />
            <Text style={styles.statText}>5.2 km trip</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.statText}>15 min</Text>
          </View>
        </View>

        {/* बटन्स */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptBtnText}>Accept Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%', opacity: 0.9 },
  pickupPin: { position: 'absolute', top: '40%', left: '45%', backgroundColor: '#fff', padding: 5, borderRadius: 20, elevation: 5 },
  timerBadge: { position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: '#111', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  timerText: { color: '#FFC107', fontSize: 16, fontWeight: '800' },
  requestCard: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, marginTop: -40, elevation: 10 },
  customerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '800', color: '#111' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#333' },
  fareContainer: { alignItems: 'flex-end' },
  fareLabel: { fontSize: 12, color: '#666', fontWeight: '600' },
  fareAmount: { fontSize: 22, fontWeight: '900', color: '#E65100' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  locationContainer: { marginBottom: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, marginRight: 10 },
  locationTextContainer: { flex: 1 },
  locationLabel: { fontSize: 10, color: '#888', fontWeight: '700', marginBottom: 2 },
  locationText: { fontSize: 14, fontWeight: '600', color: '#333' },
  verticalLine: { width: 1, height: 20, backgroundColor: '#ccc', marginLeft: 5.5, marginVertical: 4 },
  tripStats: { flexDirection: 'row', backgroundColor: '#F5F5F5', padding: 12, borderRadius: 12, justifyContent: 'space-around', marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, fontWeight: '600', color: '#333' },
  actionButtons: { flexDirection: 'row', gap: 15 },
  rejectBtn: { flex: 1, backgroundColor: '#FFEBEE', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  rejectBtnText: { fontSize: 16, fontWeight: '800', color: '#F44336' },
  acceptBtn: { flex: 2, backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  acceptBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' }
});
