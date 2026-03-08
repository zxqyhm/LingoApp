/**
 * i18n Configuration
 */

import { Platform } from 'react-native';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import zhCN from './zh-CN';
import en from './en';
import fr from './fr';
import es from './es';
import ru from './ru';
import ar from './ar';
import ja from './ja';
import ko from './ko';
import de from './de';
import pt from './pt';

export type TranslationLanguage = 'zh-CN' | 'en' | 'fr' | 'es' | 'ru' | 'ar' | 'ja' | 'ko' | 'de' | 'pt';

export const translations = {
  'zh-CN': zhCN,
  'en': en,
  'fr': fr,
  'es': es,
  'ru': ru,
  'ar': ar,
  'ja': ja,
  'ko': ko,
  'de': de,
  'pt': pt,
} as const;

export const languages: Array<{
  code: TranslationLanguage;
  name: string;
  nativeName: string;
}> = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

const LANGUAGE_KEY = 'user_language';

export const getDeviceLanguage = (): TranslationLanguage => {
  // 使用 Expo Localization API 获取设备语言（跨平台兼容）
  const locale = Localization.locale || 'en';
  // 移除地区代码 (如 zh-CN -> zh)
  const languageCode = locale.split('-')[0];

  // 映射到支持的语言
  switch (languageCode) {
    case 'zh':
      return 'zh-CN';
    case 'en':
      return 'en';
    case 'fr':
      return 'fr';
    case 'es':
      return 'es';
    case 'ru':
      return 'ru';
    case 'ar':
      return 'ar';
    case 'ja':
      return 'ja';
    case 'ko':
      return 'ko';
    case 'de':
      return 'de';
    case 'pt':
      return 'pt';
    default:
      return 'en'; // 默认英语
  }
};

export const getSavedLanguage = async (): Promise<TranslationLanguage> => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang && translations[savedLang as TranslationLanguage]) {
      return savedLang as TranslationLanguage;
    }
  } catch (error) {
    console.error('Failed to get saved language:', error);
  }
  return getDeviceLanguage();
};

export const saveLanguage = async (language: TranslationLanguage): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
};
