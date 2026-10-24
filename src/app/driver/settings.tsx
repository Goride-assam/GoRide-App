import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Share, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export default function DriverSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'profile', 'vehicle', 'docs', 'help', 'about', 'privacy', 'terms'

  // भाषा बदलने का फंक्शन
  const changeLanguage = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => { i18n.changeLanguage('en'); Alert.alert("Success", "Language changed to English"); } },
        { text: "हिंदी", onPress: () => { i18n.changeLanguage('hi'); Alert.alert("Success", "भाषा हिंदी में बदल गई"); } },
        { text: "অসমীয়া", onPress: () => { i18n.changeLanguage('as'); Alert.alert("Success", "ভাষা অসমীয়ালৈ সলনি হ'ল"); } },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // ऐप शेयर करने का फंक्शन
  const onShare = async () => {
    try {
      await Share.share({
        message: 'Join GoRide! Book or drive safe and affordable rides in Guwahati. Download now: https://goride.app',
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  // 🚨 मुख्य सेटिंग्स पेज
  const renderMainSettings = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* Account Section */}
      <View style={styles.sectionTitleRow}>
        <Ionicons name="person" size={20} color="#111" />
        <Text style={styles.sectionTitle}>Account</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.listItem} onPress={() => setCurrentPage('profile')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}><Ionicons name="person" size={20} color="#2196F3" /></View>
            <View><Text style={styles.itemTitle}>My Profile</Text><Text style={styles.itemSub}>View and edit your personal info</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.listItem} onPress={() => setCurrentPage('vehicle')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}><Ionicons name="car" size={20} color="#4CAF50" /></View>
            <View><Text style={styles.itemTitle}>Vehicle Details</Text><Text style={styles.itemSub}>Update your vehicle information</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, {borderBottomWidth: 0}]} onPress={() => setCurrentPage('docs')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}><Ionicons name="document-text" size={20} color="#9C27B0" /></View>
            <View><Text style={styles.itemTitle}>Driver Documents</Text><Text style={styles.itemSub}>Manage your license, RC & more</Text></View>
          </View>
          <View style={styles.rightAlign}>
            <Text style={styles.verifiedBadge}>✔ Verified</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>
      </View>

      {/* App & Support Section */}
      <View style={styles.sectionTitleRow}>
        <Ionicons name="settings" size={20} color="#111" />
        <Text style={styles.sectionTitle}>App & Support</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.listItem} onPress={() => Alert.alert('Notifications', 'Notification settings will open here.')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#FFFDE7'}]}><Ionicons name="notifications" size={20} color="#FFC107" /></View>
            <View><Text style={styles.itemTitle}>Notifications</Text><Text style={styles.itemSub}>Manage ride and app notifications</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.listItem} onPress={changeLanguage}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}><Ionicons name="globe" size={20} color="#2196F3" /></View>
            <View><Text style={styles.itemTitle}>Language</Text><Text style={styles.itemSub}>Change app language</Text></View>
          </View>
          <View style={styles.rightAlign}>
            <Text style={styles.langBadge}>{i18n.language.toUpperCase()}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => setCurrentPage('help')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}><Ionicons name="headset" size={20} color="#9C27B0" /></View>
            <View><Text style={styles.itemTitle}>Help & Support</Text><Text style={styles.itemSub}>Get help or contact support team</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Alert.alert('Rate Us', 'Thank you for rating GoRide!')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#FFEBEE'}]}><Ionicons name="star" size={20} color="#F44336" /></View>
            <View><Text style={styles.itemTitle}>Rate Us</Text><Text style={styles.itemSub}>Share your feedback</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, {borderBottomWidth: 0}]} onPress={() => setCurrentPage('about')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E0F2F1'}]}><Ionicons name="information-circle" size={20} color="#009688" /></View>
            <View><Text style={styles.itemTitle}>About App</Text><Text style={styles.itemSub}>App version, terms and policies</Text></View>
          </View>
          <View style={styles.rightAlign}>
            <Text style={styles.langBadge}>v1.0.0</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>
      </View>

      {/* More Options Section */}
      <View style={styles.sectionTitleRow}>
        <Ionicons name="grid" size={20} color="#111" />
        <Text style={styles.sectionTitle}>More Options</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.listItem} onPress={onShare}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}><Ionicons name="share-social" size={20} color="#2196F3" /></View>
            <View><Text style={styles.itemTitle}>Share App</Text><Text style={styles.itemSub}>Invite your friends to GoRide</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => setCurrentPage('privacy')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}><Ionicons name="shield-checkmark" size={20} color="#4CAF50" /></View>
            <View><Text style={styles.itemTitle}>Privacy Policy</Text><Text style={styles.itemSub}>Read our privacy policy</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => setCurrentPage('terms')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}><Ionicons name="document" size={20} color="#9C27B0" /></View>
            <View><Text style={styles.itemTitle}>Terms & Conditions</Text><Text style={styles.itemSub}>Read terms and conditions</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, {borderBottomWidth: 0}]} onPress={() => router.replace('/login')}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#FFEBEE'}]}><Ionicons name="log-out" size={20} color="#F44336" /></View>
            <View><Text style={[styles.itemTitle, {color: '#F44336'}]}>Log Out</Text><Text style={styles.itemSub}>Sign out from your account</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bigLogoutBtn} onPress={() => router.replace('/login')}>
        <View style={styles.itemLeft}>
          <View style={[styles.iconBox, {backgroundColor: '#F44336'}]}><Ionicons name="log-out" size={20} color="#fff" /></View>
          <View><Text style={[styles.itemTitle, {color: '#F44336'}]}>Log Out</Text><Text style={styles.itemSub}>Are you sure you want to logout?</Text></View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#F44336" />
      </TouchableOpacity>

      <View style={{height: 20}} />
    </ScrollView>
  );

  // 🚨 सब-पेज (Next Pages) रेंडर करने का फंक्शन
  const renderSubPage = (title: string, content: React.ReactNode) => (
    <View style={{flex: 1, backgroundColor: '#F8F9FA'}}>
      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentPage('main')}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.subTitle}>{title}</Text>
      </View>
      <ScrollView style={{padding: 20}}>
        {content}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* अगर मुख्य पेज है, तो हेडर दिखाओ */}
      {currentPage === 'main' && (
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Text style={styles.logoText}>GoRide</Text>
            <Text style={styles.logoSub}>Driver</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}><Text style={{fontSize: 40}}>🧑‍✈️</Text></View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Text style={styles.driverName}>Raj Kumar</Text>
                <View style={styles.verifiedBadgeHeader}><Text style={{fontSize: 8, color: '#fff', fontWeight: 'bold'}}>✔ Verified</Text></View>
              </View>
              <Text style={styles.infoText}>📞 +91 98765 43210</Text>
              <Text style={styles.infoText}>🚗 Swift Dzire • KA 01 AB 1234</Text>
            </View>
          </View>
          <Text style={styles.headerAuto}>🛺</Text>
        </View>
      )}

      {/* कंटेंट (मुख्य या सब-पेज) */}
      {currentPage === 'main' && renderMainSettings()}
      
      {currentPage === 'profile' && renderSubPage('My Profile', (
        <View>
          <Text style={styles.formLabel}>Full Name</Text>
          <Text style={styles.formInput}>Raj Kumar</Text>
          <Text style={styles.formLabel}>Phone Number</Text>
          <Text style={styles.formInput}>+91 98765 43210</Text>
          <Text style={styles.formLabel}>Email Address</Text>
          <Text style={styles.formInput}>raj.kumar@example.com</Text>
        </View>
      ))}

      {currentPage === 'vehicle' && renderSubPage('Vehicle Details', (
        <View>
          <Text style={styles.formLabel}>Vehicle Model</Text>
          <Text style={styles.formInput}>Swift Dzire</Text>
          <Text style={styles.formLabel}>Registration Number</Text>
          <Text style={styles.formInput}>KA 01 AB 1234</Text>
        </View>
      ))}

      {currentPage === 'docs' && renderSubPage('Driver Documents', (
        <View>
          <View style={styles.docCard}><Text style={styles.docTitle}>✔️ Driving License</Text><Text style={styles.docSub}>Verified on 12 Oct 2026</Text></View>
          <View style={styles.docCard}><Text style={styles.docTitle}>✔️ RC Book</Text><Text style={styles.docSub}>Verified on 12 Oct 2026</Text></View>
          <View style={styles.docCard}><Text style={styles.docTitle}>✔️ Insurance</Text><Text style={styles.docSub}>Verified on 12 Oct 2026</Text></View>
        </View>
      ))}

      {currentPage === 'help' && renderSubPage('Help & Support', (
        <View>
          <TouchableOpacity style={styles.docCard} onPress={() => Linking.openURL('tel:18001234567')}>
            <Text style={styles.docTitle}>📞 Call Support</Text><Text style={styles.docSub}>1800-123-4567</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.docCard} onPress={() => Linking.openURL('mailto:support@goride.com')}>
            <Text style={styles.docTitle}>✉️ Email Us</Text><Text style={styles.docSub}>support@goride.com</Text>
          </TouchableOpacity>
        </View>
      ))}

      {currentPage === 'about' && renderSubPage('About App', (
        <View>
          <Text style={styles.aboutText}>GoRide Driver App{'\n'}Version 1.0.0{'\n\n'}GoRide is a premium ride-booking app designed to provide safe, fast, and affordable transportation. This driver app helps you manage your rides, track earnings, and provide excellent service to customers.</Text>
        </View>
      ))}

      {currentPage === 'privacy' && renderSubPage('Privacy Policy', (
        <Text style={styles.aboutText}>Your privacy is important to us. We collect location data to match you with nearby customers and process payments securely. We do not share your personal data with third parties without your consent.</Text>
      ))}

      {currentPage === 'terms' && renderSubPage('Terms & Conditions', (
        <Text style={styles.aboutText}>By using the GoRide Driver app, you agree to provide safe and professional service to all customers. Any misconduct or violation of traffic rules may lead to the suspension of your account.</Text>
      ))}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // हेडर
  header: { 
    backgroundColor: '#FFD54F', borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    padding: 20, paddingTop: 40, position: 'relative', overflow: 'hidden'
  },
  headerLogo: { position: 'absolute', top: 20, right: 20, alignItems: 'flex-end' },
  logoText: { fontSize: 24, fontWeight: '900', color: '#111', lineHeight: 26 },
  logoSub: { backgroundColor: '#111', color: '#FFC107', fontSize: 10, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, overflow: 'hidden', marginTop: 2 },
  headerAuto: { position: 'absolute', right: 10, bottom: 10, fontSize: 70 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 4 },
  driverName: { fontSize: 20, fontWeight: '800', color: '#111' },
  verifiedBadgeHeader: { backgroundColor: '#4CAF50', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  infoText: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 3 },

  // कंटेंट
  content: { padding: 15 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 10, marginLeft: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  
  card: { backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, marginBottom: 20, elevation: 2 },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemSub: { fontSize: 11, color: '#888', marginTop: 2 },
  rightAlign: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verifiedBadge: { backgroundColor: '#E8F5E9', color: '#4CAF50', fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  langBadge: { backgroundColor: '#F5F5F5', color: '#666', fontSize: 11, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  
  bigLogoutBtn: { backgroundColor: '#FFEBEE', borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#FFCDD2', marginBottom: 20 },
  
  // सब-पेज
  subHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', gap: 15 },
  backBtn: { padding: 5 },
  subTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  formLabel: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 5, marginTop: 10 },
  formInput: { backgroundColor: '#fff', padding: 15, borderRadius: 10, fontSize: 15, color: '#111', borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  docCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  docTitle: { fontSize: 15, fontWeight: '700', color: '#4CAF50' },
  docSub: { fontSize: 12, color: '#666', marginTop: 3 },
  aboutText: { fontSize: 14, color: '#444', lineHeight: 22 }
});
