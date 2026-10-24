import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // आइकॉन के लिए

export default function RideScreen() {
  const router = useRouter();
  const [selectedRide, setSelectedRide] = useState('Auto');

  const rides = [
    { id: '1', name: 'Auto', price: '₹50', time: '3 min', icon: '🛺', color: '#FFFDE7' },
    { id: '2', name: 'Bike', price: '₹30', time: '2 min', icon: '🏍️', color: '#FCE4EC' },
    { id: '3', name: 'Basic Car', price: '₹120', time: '5 min', icon: '🚗', color: '#E3F2FD' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 ऊपर का मैप (Map Placeholder) */}
      <View style={styles.mapContainer}>
        {/* बैक बटन */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* मैप की इमेज (एक सुंदर सा मैप बैकग्राउंड) */}
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/city-map-navigation-concept_23-2148675956.jpg?w=740&t=st=1700000000~exp=1700000600~hmac=123456789' }} 
          style={styles.mapImage} 
          resizeMode="cover"
        />
      </View>

      {/* 🚨 नीचे का बुकिंग सेक्शन */}
      <View style={styles.bookingContainer}>
        
        <Text style={styles.heading}>Where do you want to go?</Text>

        {/* लोकेशन इनपुट्स */}
        <View style={styles.locationBox}>
          <View style={styles.locationRow}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <TextInput style={styles.input} placeholder="Pickup Location" placeholderTextColor="#888" />
          </View>
          <View style={styles.divider} />
          <View style={styles.locationRow}>
            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
            <TextInput style={styles.input} placeholder="Drop Location" placeholderTextColor="#888" />
          </View>
        </View>

        {/* गाड़ी चुनने के ऑप्शन */}
        <Text style={styles.subHeading}>Choose your ride</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rideOptions}>
          {rides.map((ride) => (
            <TouchableOpacity 
              key={ride.id} 
              style={[
                styles.rideCard, 
                { backgroundColor: ride.color },
                selectedRide === ride.name && styles.rideCardSelected
              ]}
              onPress={() => setSelectedRide(ride.name)}
            >
              <Text style={styles.rideIcon}>{ride.icon}</Text>
              <Text style={styles.rideName}>{ride.name}</Text>
              <Text style={styles.ridePrice}>{ride.price}</Text>
              <Text style={styles.rideTime}>{ride.time} away</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* कन्फर्म बटन */}
        <TouchableOpacity 
          style={styles.confirmBtn} 
          onPress={() => {
            Alert.alert("Ride Confirmed", `${selectedRide} is on the way!`);
            router.push('/track'); // कन्फर्म होने के बाद सीधा ट्रैक पेज पर भेज देगा
          }}
        >
          <Text style={styles.confirmBtnText}>Confirm {selectedRide}</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  // मैप सेक्शन
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  backBtn: { 
    position: 'absolute', top: 40, left: 20, zIndex: 10, 
    backgroundColor: '#fff', width: 45, height: 45, borderRadius: 22.5, 
    justifyContent: 'center', alignItems: 'center', elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3
  },

  // बुकिंग सेक्शन
  bookingContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20,
    marginTop: -30, // मैप के ऊपर चढ़ाने के लिए
    elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5
  },
  heading: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 15 },
  
  // लोकेशन बॉक्स
  locationBox: { 
    backgroundColor: '#F5F5F5', borderRadius: 15, padding: 15, marginBottom: 20 
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  input: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500', paddingVertical: 10 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 5, marginLeft: 22 },

  // गाड़ियों के ऑप्शन
  subHeading: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  rideOptions: { flexDirection: 'row', marginBottom: 20 },
  rideCard: { 
    width: 100, borderRadius: 15, padding: 12, marginRight: 10, 
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent' 
  },
  rideCardSelected: { borderColor: '#FFB300', backgroundColor: '#FFFDE7' },
  rideIcon: { fontSize: 35, marginBottom: 5 },
  rideName: { fontSize: 14, fontWeight: '700', color: '#333' },
  ridePrice: { fontSize: 15, fontWeight: '800', color: '#111', marginTop: 2 },
  rideTime: { fontSize: 10, color: '#666', marginTop: 2 },

  // कन्फर्म बटन
  confirmBtn: { 
    backgroundColor: '#FFB300', paddingVertical: 15, borderRadius: 15, 
    alignItems: 'center', marginBottom: 10 
  },
  confirmBtnText: { fontSize: 16, fontWeight: '800', color: '#111' }
});
