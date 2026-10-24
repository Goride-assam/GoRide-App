import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import hi from './locales/hi.json';
import asLocale from './locales/as.json';

const resources = { en: { translation: en }, hi: { translation: hi }, as: { translation: asLocale } };

const init = async () => {
  const storedLang = await AsyncStorage.getItem('appLanguage');
  i18n.use(initReactI18next).init({
    resources,
    lng: storedLang || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
};
init();
export default i18n;
