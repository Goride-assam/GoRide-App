import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

export default function DriverHomeScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  // इंटरनेट कटने पर ऑटोमैटिक ऑफलाइन होने का लॉजिक
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected && isOnline) {
        setIsOnline(false);
        Alert.alert("Internet Disconnected", "You have been automatically set to Offline.");
      }
    });
    return () => unsubscribe();
  }, [isOnline]);

  const toggleStatus = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Alert.alert("No Internet", "Please turn on your internet/data to go online.");
        return;
      }
      setIsOnline(!isOnline);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 1. हेडर */}
      <View style={styles.headerContainer}>
        <View style={styles.headerCurveBg} />
        <View style={styles.headerDarkCurve} />
        
        <View style={styles.headerContent}>
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIconBg}>
                <Ionicons name="car-sport" size={24} color="#E65100" />
              </View>
              <View>
                <Text style={styles.logoText}>GoRide</Text>
                <Text style={styles.logoSubText}>Driver</Text>
              </View>
            </View>
            
            <View style={styles.bellContainer}>
              <Ionicons name="notifications" size={24} color="#111" />
              <View style={styles.bellDot} />
            </View>
          </View>

          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hello, Driver 👋</Text>
            <Text style={styles.taglineText}>Safe Ride • Happy Customers • Better Earnings</Text>
          </View>
        </View>

        <View style={styles.illustrationArea}>
          <Text style={styles.illustrationAuto}>🛺</Text>
          <Text style={styles.illustrationDriver}>🧑‍✈️</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🚨 2. ड्राइवर स्टेटस कार्ड */}
        <View style={[styles.statusCard, !isOnline && styles.statusCardOffline]}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusAvatar, !isOnline && {backgroundColor: '#E0E0E0'}]}>
              <Ionicons name="person" size={30} color={isOnline ? "#1B5E20" : "#757575"} />
            </View>
            <View>
              <Text style={[styles.statusLabel, !isOnline && {color: '#E0E0E0'}]}>Driver Status</Text>
              <Text style={styles.statusValue}>{isOnline ? 'Online' : 'Offline'}</Text>
              <Text style={[styles.statusSub, !isOnline && {color: '#BDBDBD'}]}>
                {isOnline ? 'You are ready for rides' : 'Go online to start receiving rides'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.goOnlineBtn} onPress={toggleStatus}>
            <View style={[styles.powerIconBg, !isOnline && {backgroundColor: '#9E9E9E'}]}>
              <Ionicons name="power" size={16} color="#fff" />
            </View>
            <Text style={styles.goOnlineText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
            <Ionicons name="chevron-forward" size={16} color="#1B5E20" />
          </TouchableOpacity>
        </View>

        {/* 🚨 3. स्टैट्स रो (वॉलेट क्लिक करने पर खुलेगा) */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, {backgroundColor: '#E8F5E9'}]}>
              <Ionicons name="car" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statLabel}>Today's Rides</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, {backgroundColor: '#F3E5F5'}]}>
              <FontAwesome5 name="rupee-sign" size={18} color="#9C27B0" />
            </View>
            <Text style={styles.statLabel}>Today's Earning</Text>
            <Text style={styles.statValue}>₹ 0</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <View style={[styles.statIconBg, {backgroundColor: '#E3F2FD'}]}>
              <Ionicons name="star" size={20} color="#2196F3" />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>0.0 <Ionicons name="star" size={12} color="#FFC107" /></Text>
          </View>

          <View style={styles.statDivider} />

          <TouchableOpacity style={styles.statBox} onPress={() => router.push('/driver/wallet')}>
            <View style={[styles.statIconBg, {backgroundColor: '#FFF3E0'}]}>
              <Ionicons name="wallet" size={20} color="#FF9800" />
            </View>
            <Text style={styles.statLabel}>Wallet Balance</Text>
            <Text style={styles.statValue}>₹ 0 <Ionicons name="chevron-forward" size={12} color="#666" /></Text>
          </TouchableOpacity>
        </View>

        {/* 🚨 4. प्रोमो बैनर */}
        <View style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoIcon}>📢</Text>
            <View>
              <Text style={styles.promoTitle}>More Rides = More Earnings</Text>
              <Text style={styles.promoSub}>Stay online, get more ride requests,{'\n'}and increase your income.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>View Tips ➔</Text>
          </TouchableOpacity>
          <Text style={styles.promoBgAuto}>🛺</Text>
        </View>

        {/* 🚨 5. रीसेंट राइड्स */}
        <View style={styles.recentHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Ionicons name="time" size={20} color="#111" />
            <Text style={styles.recentTitle}>Recent Rides</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/driver/rides')}>
            <Text style={styles.viewAllText}>View All ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentCard}>
          <View style={styles.recentCardLeft}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#4CAF50" />
              <View>
                <Text style={styles.locLabel}>Pickup</Text>
                <Text style={styles.locValue}>Guwahati, Assam</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#F44336" />
              <View>
                <Text style={styles.locLabel}>Drop</Text>
                <Text style={styles.locValue}>Dispur, Guwahati</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.recentCardDivider} />
          
          <View style={styles.recentCardRight}>
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
            <Text style={styles.amountText}>₹ 42</Text>
            <Text style={styles.dateText}>12 Oct 2026 • 8.4 km</Text>
          </View>
        </View>

        <View style={{height: 60}} />
      </ScrollView>

      {/* 🚨 6. बॉटम नेविगेशन */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons name="home" size={24} color="#FFC107" />
          <Text style={styles.navTextActive}>Home</Text>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        
        {/* Rides बटन (अब कनेक्टेड) */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver/rides')}>
          <MaterialCommunityIcons name="car" size={24} color="#888" />
          <Text style={styles.navText}>Rides</Text>
        </TouchableOpacity>
        
        <View style={{width: 60}} />

        {/* Earnings बटन (अब कनेक्टेड) */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver/wallet')}>
          <Ionicons name="wallet-outline" size={24} color="#888" />
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>
        
        {/* Account बटन (अब कनेक्टेड) */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver/profile')}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>

      {/* 🚨 7. फ्लोटिंग FAB बटन */}
      <TouchableOpacity style={[styles.fabBtn, !isOnline && styles.fabBtnOffline]} onPress={toggleStatus}>
        <MaterialCommunityIcons name="steering" size={32} color={isOnline ? "#111" : "#757575"} />
        <Text style={styles.fabText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  headerContainer: { height: 220, position: 'relative', overflow: 'hidden' },
  headerCurveBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 200, backgroundColor: '#FFC107', borderBottomLeftRadius: 60, borderBottomRightRadius: 60 },
  headerDarkCurve: { position: 'absolute', top: 0, left: 0, right: 0, height: 180, backgroundColor: '#1B5E20', borderBottomLeftRadius: 80, borderBottomRightRadius: 80, opacity: 0.9 },
  headerContent: { padding: 20, zIndex: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIconBg: { backgroundColor: '#fff', padding: 6, borderRadius: 20 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#FFC107' },
  logoSubText: { fontSize: 14, fontWeight: '800', color: '#fff', marginTop: -5 },
  bellContainer: { backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  bellDot: { position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#F44336' },
  greetingContainer: { marginTop: 25 },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#fff' },
  taglineText: { fontSize: 11, color: '#ddd', fontWeight: '500', marginTop: 2 },
  illustrationArea: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'flex-end', zIndex: 5 },
  illustrationAuto: { fontSize: 80, marginRight: -20 },
  illustrationDriver: { fontSize: 90, marginBottom: -10 },

  scrollContent: { padding: 15 },

  statusCard: { backgroundColor: '#388E3C', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, marginBottom: 15, elevation: 4 },
  statusCardOffline: { backgroundColor: '#757575', elevation: 2 },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusAvatar: { backgroundColor: '#C8E6C9', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  statusLabel: { fontSize: 12, color: '#C8E6C9', fontWeight: '600' },
  statusValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statusSub: { fontSize: 10, color: '#A5D6A7', fontWeight: '500' },
  goOnlineBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 25 },
  powerIconBg: { backgroundColor: '#4CAF50', padding: 4, borderRadius: 12 },
  goOnlineText: { fontSize: 12, fontWeight: '800', color: '#1B5E20' },

  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, elevation: 2 },
  statBox: { alignItems: 'center', flex: 1 },
  statIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  statLabel: { fontSize: 9, color: '#666', fontWeight: '600', marginBottom: 2 },
  statValue: { fontSize: 15, fontWeight: '800', color: '#111' },
  statDivider: { width: 1, height: 40, backgroundColor: '#eee' },

  promoBanner: { backgroundColor: '#FFFDE7', borderRadius: 15, padding: 15, marginBottom: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#FFF59D', overflow: 'hidden' },
  promoLeft: { flexDirection: 'row', gap: 10, zIndex: 2, width: '75%' },
  promoIcon: { fontSize: 24 },
  promoTitle: { fontSize: 14, fontWeight: '800', color: '#111' },
  promoSub: { fontSize: 10, color: '#666', fontWeight: '500', marginTop: 2 },
  promoBtn: { backgroundColor: '#FFC107', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, marginTop: 10, zIndex: 2 },
  promoBtnText: { fontSize: 10, fontWeight: '800', color: '#111' },
  promoBgAuto: { position: 'absolute', right: -10, bottom: -10, fontSize: 70, opacity: 0.5, zIndex: 1 },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  recentTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#666' },
  recentCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 12, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
  recentCardLeft: { flex: 1, gap: 10 },
  locationRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  locLabel: { fontSize: 9, color: '#888', fontWeight: '700' },
  locValue: { fontSize: 11, fontWeight: '700', color: '#333' },
  recentCardDivider: { width: 1, backgroundColor: '#C8E6C9', marginHorizontal: 10 },
  recentCardRight: { flex: 1, justifyContent: 'center', position: 'relative' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#C8E6C9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 5 },
  completedText: { fontSize: 9, color: '#2E7D32', fontWeight: '800' },
  amountText: { fontSize: 16, fontWeight: '900', color: '#111' },
  dateText: { fontSize: 9, color: '#666', fontWeight: '500' },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingBottom: 15, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 15 },
  navItem: { alignItems: 'center', gap: 4 },
  navItemActive: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, color: '#888', fontWeight: '600' },
  navTextActive: { fontSize: 10, color: '#FFC107', fontWeight: '800' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFC107', marginTop: 2 },

  fabBtn: { position: 'absolute', bottom: 15, alignSelf: 'center', backgroundColor: '#FFC107', width: 75, height: 75, borderRadius: 37.5, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 4, borderColor: '#fff' },
  fabBtnOffline: { backgroundColor: '#E0E0E0' },
  fabText: { fontSize: 10, fontWeight: '900', color: '#111', marginTop: -2 }
});
