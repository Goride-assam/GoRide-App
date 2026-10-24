import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function TrackScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 ऊपर का मैप सेक्शन */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/city-map-navigation-concept_23-2148675956.jpg?w=740' }} 
          style={styles.mapImage} 
          resizeMode="cover"
        />
        
        {/* बैक बटन (राइड कैंसिल करने के लिए) */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>

        {/* मैप पर ड्राइवर की लोकेशन (एक छोटा सा आइकॉन) */}
        <View style={styles.driverLocationPin}>
          <Text style={{fontSize: 24}}>🛺</Text>
        </View>
      </View>

      {/* 🚨 नीचे का ड्राइवर डिटेल्स कार्ड */}
      <View style={styles.driverCard}>
        
        {/* ऊपर का हेडर: कितना समय बचा है */}
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>Driver is on the way</Text>
          <Text style={styles.etaTime}>3 min away</Text>
        </View>

        {/* ड्राइवर की जानकारी */}
        <View style={styles.driverInfoRow}>
          <View style={styles.avatarContainer}>
            <Text style={{fontSize: 40}}>🧑‍✈️</Text>
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>Ramesh Kumar</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.vehicleText}> • Auto (AS-01-1234)</Text>
            </View>
          </View>

          {/* कॉल और चैट बटन */}
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="call" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="chatbubble" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 🚨 OTP सेक्शन (सबसे ज़रूरी) */}
        <View style={styles.otpContainer}>
          <View>
            <Text style={styles.otpLabel}>Share this OTP with driver</Text>
            <Text style={styles.otpCode}>4 5 8 2</Text>
          </View>
          <View style={styles.otpBadge}>
            <Text style={styles.otpBadgeText}>PIN</Text>
          </View>
        </View>

        {/* कैंसिल बटन */}
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.replace('/home')}>
          <Text style={styles.cancelBtnText}>Cancel Ride</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  // मैप सेक्शन
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%', opacity: 0.8 },
  backBtn: { 
    position: 'absolute', top: 40, left: 20, zIndex: 10, 
    backgroundColor: '#fff', width: 45, height: 45, borderRadius: 22.5, 
    justifyContent: 'center', alignItems: 'center', elevation: 5 
  },
  driverLocationPin: {
    position: 'absolute', top: '40%', left: '45%',
    backgroundColor: '#FFFDE7', padding: 10, borderRadius: 30,
    elevation: 5, borderWidth: 2, borderColor: '#FFC107'
  },

  // ड्राइवर कार्ड
  driverCard: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20,
    marginTop: -40, // मैप के ऊपर चढ़ाने के लिए
    elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5
  },
  
  etaContainer: { alignItems: 'center', marginBottom: 20 },
  etaText: { fontSize: 14, color: '#666', fontWeight: '600' },
  etaTime: { fontSize: 22, fontWeight: '800', color: '#111', marginTop: 2 },

  driverInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarContainer: { 
    backgroundColor: '#F5F5F5', width: 60, height: 60, borderRadius: 30, 
    justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  driverDetails: { flex: 1 },
  driverName: { fontSize: 18, fontWeight: '800', color: '#111' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 3 },
  vehicleText: { fontSize: 13, color: '#666', fontWeight: '500' },

  contactButtons: { flexDirection: 'row', gap: 10 },
  iconBtn: { 
    backgroundColor: '#F5F5F5', width: 45, height: 45, borderRadius: 22.5, 
    justifyContent: 'center', alignItems: 'center' 
  },

  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },

  // OTP सेक्शन
  otpContainer: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#FFFDE7', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#FFE082' 
  },
  otpLabel: { fontSize: 13, color: '#555', fontWeight: '600' },
  otpCode: { fontSize: 26, fontWeight: '900', color: '#E65100', letterSpacing: 5, marginTop: 5 },
  otpBadge: { backgroundColor: '#FFC107', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  otpBadgeText: { fontSize: 14, fontWeight: '800', color: '#111' },

  // कैंसिल बटन
  cancelBtn: { 
    marginTop: 20, paddingVertical: 15, borderRadius: 15, 
    alignItems: 'center', borderWidth: 2, borderColor: '#F44336' 
  },
  cancelBtnText: { fontSize: 16, fontWeight: '800', color: '#F44336' }
});
