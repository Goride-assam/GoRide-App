import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  
  // नीचे चलते हुए ऑटो का एनीमेशन
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -150,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [translateX]);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🚨 हेडर (कर्व के साथ) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>নমস্কাৰ স্বাগতম 👋</Text>
          <Text style={styles.title}>GoRide Booking</Text>
          <Text style={styles.tagline}>Safe Ride • Fast Ride • Always With You</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatar}><Text style={{fontSize: 18}}>👤</Text></View>
          <Text style={styles.headerAuto}>🛺</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* सर्च बार */}
        <View style={styles.searchContainer}>
          <View style={styles.searchLeft}>
            <Text style={{fontSize: 18, color: '#D32F2F'}}>📍</Text>
            <TextInput style={styles.searchInput} placeholder="Where to?" placeholderTextColor="#888" />
          </View>
          <View style={styles.searchRight}>
            <Text style={{fontSize: 14}}>📅</Text>
            <Text style={styles.nowText}>Now</Text>
            <Text style={{fontSize: 10}}>▼</Text>
          </View>
        </View>

        {/* 🚨 बैनर (जब इस पर क्लिक होगा, तो /ride वाले पेज पर जाएगा) */}
        <TouchableOpacity style={styles.banner} onPress={() => router.push('/ride')}>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>নিৰাপদ যাত্ৰা,{'\n'}সুন্দৰ আগামী</Text>
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>নগদবিহীন ১০০% নিৰাপত্তা!</Text>
            <View style={styles.bookNowBtn}>
              <Text style={styles.bookNowText}>BOOK NOW ➔</Text>
            </View>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerAuto}>🛺</Text>
          </View>
        </TouchableOpacity>
        
        {/* Dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* ग्रिड टाइटल */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Book A Ride Now</Text>
          <Text style={styles.seeAll}>See All ➔</Text>
        </View>
        
        {/* 🚨 ग्रिड (जब भी किसी कार्ड पर क्लिक होगा, /ride पेज खुलेगा) */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={[styles.gridItem, styles.cardAuto]} onPress={() => router.push('/ride')}>
            <Text style={styles.gridIcon}>🛺</Text>
            <Text style={styles.gridTitle}>Auto</Text>
            <Text style={styles.gridSub}>Quick & Comfortable</Text>
            <View style={[styles.arrowBtn, {backgroundColor: '#FFC107'}]}><Text style={styles.arrowText}>➔</Text></View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.gridItem, styles.cardBasic]} onPress={() => router.push('/ride')}>
            <Text style={styles.gridIcon}>🚗</Text>
            <Text style={styles.gridTitle}>Basic</Text>
            <Text style={styles.gridSub}>Affordable Rides</Text>
            <View style={[styles.arrowBtn, {backgroundColor: '#2196F3'}]}><Text style={styles.arrowText}>➔</Text></View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.gridItem, styles.cardBike]} onPress={() => router.push('/ride')}>
            <Text style={styles.gridIcon}>🏍️</Text>
            <Text style={styles.gridTitle}>Bike</Text>
            <Text style={styles.gridSub}>Fast & Economical</Text>
            <View style={[styles.arrowBtn, {backgroundColor: '#F44336'}]}><Text style={styles.arrowText}>➔</Text></View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.gridItem, styles.cardLater]} onPress={() => router.push('/ride')}>
            <Text style={styles.gridIcon}>📅</Text>
            <Text style={styles.gridTitle}>Book Later</Text>
            <Text style={styles.gridSub}>Plan Your Ride</Text>
            <View style={[styles.arrowBtn, {backgroundColor: '#4CAF50'}]}><Text style={styles.arrowText}>➔</Text></View>
          </TouchableOpacity>
        </View>

        {/* 🚨 पर्पल बैनर */}
        <TouchableOpacity style={styles.adBanner} onPress={() => router.push('/ride')}>
          <View>
            <Text style={styles.adTitle}>👑 GoRide Special</Text>
            <Text style={styles.adSub}>Fast, safe and affordable rides 24/7.</Text>
          </View>
          <Text style={{fontSize: 35}}>🛵</Text>
          <View style={styles.adArrow}><Text style={styles.arrowText}>➔</Text></View>
        </TouchableOpacity>
      </ScrollView>

      {/* 🚨 नीचे का एनीमेशन एरिया */}
      <View style={styles.animationArea}>
        <View style={styles.cityBg} />
        <View style={styles.road}><View style={styles.roadLine} /></View>
        <Animated.View style={[styles.movingAuto, { transform: [{ translateX }] }]}>
          <Text style={styles.driver}>🧑‍✈️</Text>
          <Text style={styles.autoEmoji}>🛺</Text>
        </Animated.View>
      </View>

      {/* 🚨 बॉटम नेविगेशन (अब ये सारे पेजों से कनेक्टेड हैं) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive} onPress={() => {}}>
          <View style={styles.navIconWrapperActive}><Text style={styles.navIconActive}>🏠</Text></View>
          <Text style={styles.navTextActive}>Book</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/track')}>
          <Text style={styles.navIcon}>📍</Text>
          <Text style={styles.navText}>Track</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/status')}>
          <Text style={styles.navIcon}>⏳</Text>
          <Text style={styles.navText}>Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/chat')}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  header: { 
    backgroundColor: '#FFD54F', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 5,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerLeft: { width: '70%', zIndex: 2 },
  greeting: { fontSize: 14, color: '#333', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: '#111', marginTop: 2 },
  tagline: { fontSize: 10, color: '#444', fontWeight: '600', marginTop: 5 },
  headerRight: { alignItems: 'center', width: '30%', zIndex: 2 },
  avatar: { backgroundColor: '#fff', width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginBottom: 5, elevation: 3, borderWidth: 2, borderColor: '#FFE082' },
  headerAuto: { fontSize: 65, marginRight: -10 },
  
  content: { padding: 15, paddingBottom: 10 },
  searchContainer: { 
    backgroundColor: '#fff', borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, marginBottom: 20, 
    marginTop: -25, elevation: 4 
  },
  searchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  searchInput: { fontSize: 14, flex: 1, color: '#333', fontWeight: '500' },
  searchRight: { flexDirection: 'row', alignItems: 'center', gap: 5, borderLeftWidth: 1, borderLeftColor: '#eee', paddingLeft: 10 },
  nowText: { fontSize: 13, fontWeight: '700', color: '#333' },

  banner: { 
    backgroundColor: '#FFFDE7', borderRadius: 20, padding: 20, flexDirection: 'row', 
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, 
    borderWidth: 1, borderColor: '#FFF59D' 
  },
  ribbon: { position: 'absolute', top: 15, left: -5, backgroundColor: '#E64A19', paddingVertical: 6, paddingHorizontal: 15, borderTopRightRadius: 4, borderBottomRightRadius: 4, zIndex: 2 },
  ribbonText: { color: '#fff', fontSize: 11, fontWeight: '700', lineHeight: 15 },
  bannerTextContainer: { zIndex: 2, marginTop: 25, width: '60%' },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#222', lineHeight: 20, marginBottom: 10 },
  bookNowBtn: { backgroundColor: '#FFB300', paddingVertical: 7, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  bookNowText: { color: '#111', fontWeight: '700', fontSize: 10 },
  bannerRight: { width: '40%', justifyContent: 'center', alignItems: 'center' },
  bannerAuto: { fontSize: 70 },

  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: -10, marginBottom: 15 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: '#FFB300' },

  sectionTitleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  seeAll: { fontSize: 12, color: '#666', fontWeight: '600' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', borderRadius: 15, padding: 15, marginBottom: 12, elevation: 2 },
  gridIcon: { fontSize: 35, marginBottom: 8 },
  gridTitle: { fontSize: 15, fontWeight: '800', color: '#111' },
  gridSub: { fontSize: 10, color: '#555', fontWeight: '500', marginTop: 2 },
  arrowBtn: { position: 'absolute', right: 12, bottom: 15, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  cardAuto: { backgroundColor: '#FFFDE7', borderWidth: 1, borderColor: '#FFF59D' },
  cardBasic: { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#90CAF9' },
  cardBike: { backgroundColor: '#FCE4EC', borderWidth: 1, borderColor: '#F48FB1' },
  cardLater: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#A5D6A7' },

  adBanner: { backgroundColor: '#F3E5F5', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, borderWidth: 1, borderColor: '#CE93D8' },
  adTitle: { fontSize: 15, color: '#4A148C', fontWeight: '800' },
  adSub: { fontSize: 10, color: '#555', fontWeight: '500', marginTop: 3 },
  adArrow: { position: 'absolute', right: 15, bottom: 15, width: 24, height: 24, backgroundColor: '#7B1FA2', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  animationArea: { height: 100, backgroundColor: '#FFE082', overflow: 'hidden', justifyContent: 'flex-end' },
  cityBg: { position: 'absolute', bottom: 30, width: '100%', height: 50, backgroundColor: '#A1887F', opacity: 0.3 },
  road: { height: 30, backgroundColor: '#424242', borderTopWidth: 3, borderTopColor: '#FFA000', justifyContent: 'center' },
  roadLine: { height: 2, backgroundColor: '#fff', width: '100%', opacity: 0.5 },
  movingAuto: { position: 'absolute', bottom: 5, flexDirection: 'row', alignItems: 'flex-end' },
  autoEmoji: { fontSize: 55 },
  driver: { fontSize: 18, position: 'absolute', bottom: 18, left: 15, zIndex: 2 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 10, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 10 },
  navItem: { alignItems: 'center', flex: 1, gap: 4 },
  navIcon: { fontSize: 20, color: '#888' },
  navText: { fontSize: 9, color: '#888', fontWeight: '600' },
  navItemActive: { alignItems: 'center', flex: 1, gap: 4 },
  navIconWrapperActive: { backgroundColor: '#FFC107', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginBottom: -2 },
  navIconActive: { fontSize: 20, color: '#111' },
  navTextActive: { fontSize: 9, color: '#111', fontWeight: '800' },
});
