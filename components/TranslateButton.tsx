import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { translateText } from '@/utils/translation';
import { createStyles } from './TranslateButton/styles';

interface TranslateButtonProps {
  text: string;
  targetLang?: string;
  onTranslated?: (translatedText: string) => void;
  style?: any;
}

/**
 * 翻译按钮组件
 * 点击按钮翻译文本，再次点击恢复原文
 */
export function TranslateButton({
  text,
  targetLang = 'en',
  onTranslated,
  style,
}: TranslateButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  // 执行翻译
  const handleTranslate = async () => {
    if (isLoading) return;

    if (isTranslated) {
      // 如果已翻译，恢复原文
      setIsTranslated(false);
      setDisplayText(text);
      return;
    }

    // 执行翻译
    setIsLoading(true);
    try {
      const result = await translateText(text, targetLang);
      setTranslatedText(result.translatedText);
      setDisplayText(result.translatedText);
      setIsTranslated(true);

      if (onTranslated) {
        onTranslated(result.translatedText);
      }
    } catch (error) {
      console.error('翻译失败:', error);
      Alert.alert('翻译失败', '请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ThemedText variant="body" color={theme.textPrimary} style={styles.text}>
        {displayText}
      </ThemedText>

      <TouchableOpacity
        style={[styles.translateButton, { borderColor: theme.border }]}
        onPress={handleTranslate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <>
            <FontAwesome6
              name={isTranslated ? 'rotate-left' : 'language'}
              size={14}
              color={theme.primary}
            />
            <ThemedText
              variant="caption"
              color={theme.primary}
              style={styles.translateButtonText}
            >
              {isTranslated ? '恢复' : '翻译'}
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

/**
 * 简单翻译组件（带文本）
 */
interface TranslateTextProps {
  text: string;
  targetLang?: string;
  style?: any;
  textStyle?: any;
}

export function TranslateText({ text, targetLang = 'en', style, textStyle }: TranslateTextProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (isLoading) return;

    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(text, targetLang);
      setTranslatedText(result.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error('翻译失败:', error);
      Alert.alert('翻译失败', '请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.textContainer, style]}>
      <ThemedText variant="body" color={theme.textPrimary} style={textStyle}>
        {isTranslated ? translatedText : text}
      </ThemedText>

      <TouchableOpacity onPress={handleTranslate} disabled={isLoading} style={styles.iconButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <FontAwesome6
            name={isTranslated ? 'rotate-left' : 'language'}
            size={12}
            color={theme.textMuted}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
