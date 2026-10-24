import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Share, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert(t('logout'), 'Kya aap logout karna chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          router.replace('/login' as any);
      }},
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: 'GoRide app download karo!', title: 'GoRide App' });
    } catch (error) { console.log(error); }
  };

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('appLanguage', lang);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>{t('account')}</Text>
        <View style={styles.section}>
          <Pressable style={styles.row} onPress={() => setModalVisible(true)}>
            <Ionicons name="language-outline" size={24} color="#333" />
            <Text style={styles.rowText}>{t('language')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>
          <Pressable style={styles.row} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
            <Text style={styles.rowText}>{t('share')}</Text>
          </Pressable>
        </View>
        
        <Text style={styles.sectionTitle}>{t('about')}</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="information-circle-outline" size={24} color="#333" />
            <Text style={styles.rowText}>{t('version')}</Text>
            <Text style={styles.versionText}>1.0.5</Text>
          </View>
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <Pressable style={styles.row} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="red" />
            <Text style={[styles.rowText, { color: 'red', fontWeight: 'bold' }]}>{t('logout')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <Pressable style={styles.modalBtn} onPress={() => changeLanguage('en')}>
              <Text style={styles.modalText}>English</Text>
            </Pressable>
            <Pressable style={styles.modalBtn} onPress={() => changeLanguage('hi')}>
              <Text style={styles.modalText}>हिंदी</Text>
            </Pressable>
            <Pressable style={[styles.modalBtn, { borderBottomWidth: 0 }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalText, { color: 'red' }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  sectionTitle: { fontSize: 13, color: '#6e6e73', marginTop: 20, marginBottom: 8, marginLeft: 16, fontWeight: '600' },
  section: { backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  rowText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#333' },
  versionText: { fontSize: 16, color: '#999' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalBtn: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalText: { fontSize: 16, textAlign: 'center' }
});
