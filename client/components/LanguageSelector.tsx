/**
 * Language Selector Component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/contexts/LanguageContext';
import { languages, TranslationLanguage } from '@/i18n';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { language, setLanguage, t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSelectLanguage = async (langCode: TranslationLanguage) => {
    await setLanguage(langCode);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: theme.backgroundRoot, paddingBottom: insets.bottom }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <ThemedText variant="h3" color={theme.textPrimary}>
              {t.language.title}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome6 name="xmark" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Language List */}
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  { borderBottomColor: theme.borderLight },
                  language === item.code && { backgroundColor: theme.primary + '10' }
                ]}
                onPress={() => handleSelectLanguage(item.code)}
              >
                <View style={styles.languageInfo}>
                  <ThemedText variant="body" color={theme.textPrimary}>
                    {item.nativeName}
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.textMuted}>
                    {item.name}
                  </ThemedText>
                </View>
                {language === item.code && (
                  <FontAwesome6 name="check" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  languageInfo: {
    gap: 4,
  },
});
