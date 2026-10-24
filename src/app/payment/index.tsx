import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('cash');

  // डमी बिल डिटेल्स
  const fareDetails = [
    { label: 'Base Fare', amount: '₹50' },
    { label: 'Distance Charge (5 km)', amount: '₹80' },
    { label: 'Taxes & Fees', amount: '₹20' },
  ];

  const totalFare = '₹150';

  const handlePayment = () => {
    if (selectedMethod === 'cash') {
      Alert.alert("Booking Successful", "Please pay ₹150 in cash to the driver.", [
        { text: "OK", onPress: () => router.push('/rating') } // पेमेंट के बाद सीधा रेटिंग पेज पर
      ]);
    } else {
      Alert.alert("Processing Payment", `Redirecting to ${selectedMethod.toUpperCase()}...`, [
        { text: "Cancel", style: "cancel" },
        { text: "Pay Now", onPress: () => {
            // यहाँ असली पेमेंट गेटवे (Razorpay) लगेगा
            setTimeout(() => {
              Alert.alert("Payment Successful", "₹150 has been paid.");
              router.push('/rating');
            }, 1000);
        }}
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚨 हेडर */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🚨 किराये का बड़ा डिस्प्ले */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount to Pay</Text>
          <Text style={styles.totalAmount}>{totalFare}</Text>
          <View style={styles.rideIdBadge}>
            <Text style={styles.rideIdText}>Ride ID: #GR-84729</Text>
          </View>
        </View>

        {/* 🚨 बिल का हिसाब (Breakdown) */}
        <Text style={styles.sectionTitle}>Fare Breakdown</Text>
        <View style={styles.billCard}>
          {fareDetails.map((item, index) => (
            <View key={index} style={styles.billRow}>
              <Text style={styles.billLabel}>{item.label}</Text>
              <Text style={styles.billAmount}>{item.amount}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalAmount}>{totalFare}</Text>
          </View>
        </View>

        {/* 🚨 पेमेंट के तरीके */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        
        {/* Cash */}
        <TouchableOpacity 
          style={[styles.paymentMethod, selectedMethod === 'cash' && styles.methodSelected]} 
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={styles.methodLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}>
              <FontAwesome5 name="money-bill-wave" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.methodText}>Cash</Text>
          </View>
          <View style={[styles.radioBtn, selectedMethod === 'cash' && styles.radioBtnActive]}>
            {selectedMethod === 'cash' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* UPI */}
        <TouchableOpacity 
          style={[styles.paymentMethod, selectedMethod === 'upi' && styles.methodSelected]} 
          onPress={() => setSelectedMethod('upi')}
        >
          <View style={styles.methodLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}>
              <MaterialCommunityIcons name="qrcode-scan" size={20} color="#2196F3" />
            </View>
            <Text style={styles.methodText}>UPI (GPay / PhonePe)</Text>
          </View>
          <View style={[styles.radioBtn, selectedMethod === 'upi' && styles.radioBtnActive]}>
            {selectedMethod === 'upi' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Wallet */}
        <TouchableOpacity 
          style={[styles.paymentMethod, selectedMethod === 'wallet' && styles.methodSelected]} 
          onPress={() => setSelectedMethod('wallet')}
        >
          <View style={styles.methodLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#FFFDE7'}]}>
              <Ionicons name="wallet" size={20} color="#FFC107" />
            </View>
            <Text style={styles.methodText}>GoRide Wallet</Text>
          </View>
          <View style={[styles.radioBtn, selectedMethod === 'wallet' && styles.radioBtnActive]}>
            {selectedMethod === 'wallet' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* 🚨 नीचे का पे बटन */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>Pay {totalFare}</Text>
        </TouchableOpacity>
      </View>
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

  scrollContent: { padding: 20, paddingBottom: 100 }, // नीचे पे बटन के लिए जगह

  // टोटल कार्ड
  totalCard: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', 
    marginBottom: 25, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5 
  },
  totalLabel: { fontSize: 14, color: '#666', fontWeight: '600', marginBottom: 5 },
  totalAmount: { fontSize: 40, fontWeight: '900', color: '#111', marginBottom: 10 },
  rideIdBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  rideIdText: { fontSize: 12, color: '#888', fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 15 },

  // बिल कार्ड
  billCard: { 
    backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 25,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { fontSize: 14, color: '#555', fontWeight: '500' },
  billAmount: { fontSize: 14, color: '#111', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  grandTotalLabel: { fontSize: 16, fontWeight: '800', color: '#111' },
  grandTotalAmount: { fontSize: 18, fontWeight: '900', color: '#E65100' },

  // पेमेंट मेथड
  paymentMethod: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12,
    borderWidth: 2, borderColor: 'transparent' 
  },
  methodSelected: { borderColor: '#FFC107', backgroundColor: '#FFFDE7' },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  methodText: { fontSize: 15, fontWeight: '700', color: '#333' },
  
  // रेडियो बटन
  radioBtn: { 
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', 
    justifyContent: 'center', alignItems: 'center' 
  },
  radioBtnActive: { borderColor: '#FFC107' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFC107' },

  // नीचे का फुटर
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#fff', padding: 20, 
    borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 10 
  },
  payBtn: { 
    backgroundColor: '#FFC107', paddingVertical: 16, borderRadius: 15, alignItems: 'center' 
  },
  payBtnText: { fontSize: 18, fontWeight: '800', color: '#111' }
});
