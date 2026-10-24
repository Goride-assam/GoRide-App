import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function DriverProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚨 हेडर */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/driver')}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="pencil" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🚨 ड्राइवर कार्ड */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={{fontSize: 50}}>🧑‍✈️</Text>
          </View>
          <Text style={styles.userName}>Ramesh Kumar</Text>
          <Text style={styles.userPhone}>+91 98765 43210</Text>
          
          {/* वाहन की जानकारी */}
          <View style={styles.vehicleBadge}>
            <Ionicons name="car" size={16} color="#1B5E20" />
            <Text style={styles.vehicleText}>Auto • AS-01-1234</Text>
          </View>

          {/* स्टैट्स */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>120</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Text style={styles.statValue}>4.8</Text>
                <Ionicons name="star" size={14} color="#FFC107" />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>1 Yr</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* 🚨 मेनू ऑप्शन्स */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}>
              <Ionicons name="document-text" size={22} color="#2196F3" />
            </View>
            <Text style={styles.menuText}>My Documents</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}>
              <Ionicons name="business" size={22} color="#4CAF50" />
            </View>
            <Text style={styles.menuText}>Bank Details</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, {backgroundColor: '#FFFDE7'}]}>
              <Ionicons name="settings" size={22} color="#FFC107" />
            </View>
            <Text style={styles.menuText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}>
              <Ionicons name="help-circle" size={22} color="#9C27B0" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* 🚨 लॉगआउट बटन */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/login')}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // हेडर
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  editBtn: { backgroundColor: '#F5F5F5', padding: 8, borderRadius: 20 },

  scrollContent: { padding: 20 },

  // प्रोफाइल कार्ड
  profileCard: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', 
    marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 
  },
  avatarContainer: { 
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8F5E9', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    borderWidth: 3, borderColor: '#1B5E20'
  },
  userName: { fontSize: 20, fontWeight: '800', color: '#111' },
  userPhone: { fontSize: 14, color: '#666', fontWeight: '500', marginTop: 2 },
  
  vehicleBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#C8E6C9', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10 
  },
  vehicleText: { fontSize: 12, fontWeight: '700', color: '#1B5E20' },

  // स्टैट्स
  statsContainer: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', marginTop: 20, backgroundColor: '#FAFAFA', padding: 15, borderRadius: 15
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#111' },
  statLabel: { fontSize: 11, color: '#888', fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#ddd' },

  // मेनू
  menuContainer: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 5, elevation: 2, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 70 },

  // लॉगआउट
  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFEBEE', paddingVertical: 15, borderRadius: 15, marginTop: 20 
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#F44336' }
});
