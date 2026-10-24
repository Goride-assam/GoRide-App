import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function DriverWalletScreen() {
  const router = useRouter();

  // डमी ट्रांजैक्शन हिस्ट्री
  const transactions = [
    { id: '1', title: 'Ride Earnings (#GR-84729)', date: 'Today, 10:30 AM', amount: '+ ₹150', type: 'credit' },
    { id: '2', title: 'Withdrawn to Bank', date: 'Yesterday, 05:00 PM', amount: '- ₹500', type: 'debit' },
    { id: '3', title: 'Ride Earnings (#GR-84725)', date: 'Yesterday, 08:15 AM', amount: '+ ₹80', type: 'credit' },
    { id: '4', title: 'Ride Earnings (#GR-84720)', date: '22 Oct, 09:45 PM', amount: '+ ₹200', type: 'credit' },
  ];

  const handleWithdraw = () => {
    Alert.alert("Withdrawal Requested", "₹1,250 will be transferred to your bank account within 24 hours.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚨 हेडर */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/driver')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Earnings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🚨 मुख्य बैलेंस कार्ड (डार्क ग्रीन/ब्लैक) */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Available Balance</Text>
          <Text style={styles.balanceAmount}>₹ 1,250</Text>
          
          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
            <Ionicons name="cash-outline" size={20} color="#111" />
            <Text style={styles.withdrawText}>Withdraw to Bank</Text>
          </TouchableOpacity>
        </View>

        {/* 🚨 क्विक स्टैट्स (आज की कमाई और राइड्स) */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, {backgroundColor: '#E8F5E9'}]}>
              <FontAwesome5 name="rupee-sign" size={16} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.statLabel}>Today's Earning</Text>
              <Text style={styles.statValue}>₹ 450</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, {backgroundColor: '#E3F2FD'}]}>
              <Ionicons name="car" size={18} color="#2196F3" />
            </View>
            <View>
              <Text style={styles.statLabel}>Today's Rides</Text>
              <Text style={styles.statValue}>5</Text>
            </View>
          </View>
        </View>

        {/* 🚨 ट्रांजैक्शन हिस्ट्री */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        <View style={styles.listContainer}>
          {transactions.map((item, index) => (
            <View key={item.id}>
              <View style={styles.transactionRow}>
                <View style={[styles.iconBox, { backgroundColor: item.type === 'credit' ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Ionicons 
                    name={item.type === 'credit' ? 'arrow-down' : 'arrow-up'} 
                    size={20} 
                    color={item.type === 'credit' ? '#4CAF50' : '#F44336'} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
                <Text style={[styles.transactionAmount, { color: item.type === 'credit' ? '#4CAF50' : '#111' }]}>
                  {item.amount}
                </Text>
              </View>
              {index !== transactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // हेडर
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  
  scrollContent: { padding: 20 },
  
  // बैलेंस कार्ड
  balanceCard: { 
    backgroundColor: '#1B5E20', borderRadius: 20, padding: 25, alignItems: 'center', 
    marginBottom: 20, elevation: 5, shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 
  },
  balanceLabel: { fontSize: 14, color: '#A5D6A7', fontWeight: '600' },
  balanceAmount: { fontSize: 42, fontWeight: '900', color: '#FFC107', marginVertical: 10 },
  withdrawBtn: { 
    backgroundColor: '#FFC107', flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginTop: 10 
  },
  withdrawText: { fontSize: 14, fontWeight: '800', color: '#111' },

  // स्टैट्स रो
  statsRow: { 
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, 
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, elevation: 2 
  },
  statBox: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' },
  statIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#666', fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: '800', color: '#111' },
  statDivider: { width: 1, height: 30, backgroundColor: '#eee' },

  // ट्रांजैक्शन लिस्ट
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 15 },
  listContainer: { backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 2 },
  
  transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  transactionDate: { fontSize: 11, color: '#888', marginTop: 2 },
  transactionAmount: { fontSize: 16, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 5 }
});
