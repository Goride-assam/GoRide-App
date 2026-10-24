import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// डमी डेटा (ड्राइवर की पुरानी राइड्स)
const ridesData = [
  { id: '1', date: '24 Oct 2026, 10:30 AM', pickup: 'Beltola Tiniali', drop: 'Guwahati Railway Station', amount: '₹150', status: 'Completed' },
  { id: '2', date: '23 Oct 2026, 05:15 PM', pickup: 'Zoo Road', drop: 'GS Road', amount: '₹80', status: 'Completed' },
  { id: '3', date: '22 Oct 2026, 08:00 AM', pickup: 'Six Mile', drop: 'Ganeshguri', amount: '₹120', status: 'Cancelled by User' },
  { id: '4', date: '20 Oct 2026, 09:45 PM', pickup: 'Paltan Bazaar', drop: 'Lokhra', amount: '₹200', status: 'Completed' },
];

export default function DriverRidesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof ridesData[0] }) => (
    <View style={styles.card}>
      {/* Date and Status */}
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={[styles.statusBadge, item.status === 'Completed' ? styles.statusCompleted : styles.statusCancelled]}>
          <Text style={[styles.statusText, item.status === 'Completed' ? styles.textCompleted : styles.textCancelled]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Locations */}
      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.locationText}>{item.pickup}</Text>
        </View>
        <View style={styles.verticalLine} />
        <View style={styles.locationRow}>
          <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.locationText}>{item.drop}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Footer with Price */}
      <View style={styles.cardFooter}>
        <Text style={styles.priceLabel}>Earned</Text>
        <Text style={styles.priceValue}>{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚨 हेडर */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/driver')}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rides</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 🚨 राइड लिस्ट */}
      <FlatList
        data={ridesData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="car-off" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No rides completed yet!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // हेडर
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },

  // लिस्ट
  listContainer: { padding: 15 },
  
  // कार्ड
  card: { 
    backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  dateText: { fontSize: 12, color: '#666', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusCompleted: { backgroundColor: '#E8F5E9' },
  statusCancelled: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 11, fontWeight: '700' },
  textCompleted: { color: '#4CAF50' },
  textCancelled: { color: '#F44336' },

  // लोकेशन
  locationContainer: { marginBottom: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  locationText: { fontSize: 14, fontWeight: '600', color: '#333' },
  verticalLine: { width: 1, height: 15, backgroundColor: '#ccc', marginLeft: 4.5, marginVertical: 2 },

  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 10 },

  // प्राइस
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 13, color: '#666', fontWeight: '500' },
  priceValue: { fontSize: 18, fontWeight: '800', color: '#1B5E20' },

  // खाली लिस्ट
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888', fontWeight: '600', marginTop: 10 }
});
