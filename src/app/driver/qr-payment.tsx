import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DriverQRPaymentScreen() {
  const router = useRouter();

  // असली ऐप में यहाँ Razorpay या UPI का डायनामिक QR कोड आएगा
  // अभी हम एक डेमो QR कोड इमेज दिखा रहे हैं
  const upiString = "upi://pay?pa=goride@upi&pn=GoRide&am=150&cu=INR";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

  const handlePaymentSuccess = () => {
    Alert.alert("Payment Received", "₹150 has been credited to your GoRide Wallet.", [
      { text: "OK", onPress: () => router.replace('/driver') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan to Pay</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>₹150</Text>
          
          <View style={styles.qrWrapper}>
             {/* यहाँ QR कोड रेंडर हो रहा है */}
             <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
          </View>

          <Text style={styles.instructions}>
            Ask the customer to scan this QR code using any UPI app (GPay, PhonePe, Paytm).
          </Text>
        </View>

        {/* डेमो के लिए बटन (असली ऐप में यह अपने आप हो जाएगा) */}
        <TouchableOpacity style={styles.checkBtn} onPress={handlePaymentSuccess}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.checkBtnText}>Check Payment Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  
  qrCard: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', 
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 
  },
  amountLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  amountValue: { fontSize: 36, fontWeight: '900', color: '#111', marginBottom: 20 },
  
  qrWrapper: { padding: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 2 },
  qrImage: { width: 200, height: 200 },
  
  instructions: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 20, lineHeight: 20 },

  checkBtn: { 
    backgroundColor: '#4CAF50', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 15, borderRadius: 15, marginTop: 30, gap: 10
  },
  checkBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
