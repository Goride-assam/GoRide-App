import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 हेडर */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="pencil" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🚨 यूज़र कार्ड */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={{fontSize: 50}}>👨‍💼</Text>
          </View>
          <Text style={styles.userName}>Emma Sharma</Text>
          <Text style={styles.userPhone}>+91 98765 43210</Text>
          
          {/* स्टैट्स (राइड्स और रेटिंग) */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹250</Text>
              <Text style={styles.statLabel}>Wallet Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Text style={styles.statValue}>4.8</Text>
                <Ionicons name="star" size={14} color="#FFC107" />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* 🚨 मेनू ऑप्शन्स */}
        <View style={styles.menuContainer}>
          
          {/* My Rides (History) */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/history')}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}>
              <Ionicons name="time" size={22} color="#2196F3" />
            </View>
            <Text style={styles.menuText}>My Rides</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Payment Methods */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, {backgroundColor: '#FFFDE7'}]}>
              <Ionicons name="wallet" size={22} color="#FFC107" />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Offers */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, {backgroundColor: '#FCE4EC'}]}>
              <Ionicons name="pricetag" size={22} color="#F44336" />
            </View>
            <Text style={styles.menuText}>Offers & Promos</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Settings (Links to settings page) */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}>
              <Ionicons name="settings" size={22} color="#4CAF50" />
            </View>
            <Text style={styles.menuText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Help & Support */}
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

        <Text style={styles.versionText}>App Version 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  
  // हेडर
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15 
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  editBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 2 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },

  // यूज़र कार्ड
  userCard: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', 
    marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 
  },
  avatarContainer: { 
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFFDE7', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    borderWidth: 3, borderColor: '#FFC107'
  },
  userName: { fontSize: 20, fontWeight: '800', color: '#111' },
  userPhone: { fontSize: 14, color: '#666', fontWeight: '500', marginTop: 2 },
  
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
  logoutText: { fontSize: 16, fontWeight: '800', color: '#F44336' },

  versionText: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 20, fontWeight: '500' }
});
