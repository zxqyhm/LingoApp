import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useSafeRouter();

  // 简化登录：点击任意登录按钮就自动登录
  const handleLogin = async (provider: 'wechat' | 'apple' | 'phone') => {
    setLoading(provider);

    try {
      // 模拟用户数据（与数据库预置数据一致）
      const mockUser = {
        id: 1,
        provider: provider,
        provider_id: `${provider}_user_1`,
        username: provider === 'wechat' ? '小明' : provider === 'apple' ? '李华' : '张伟',
        email: 'user@example.com',
        avatar_url: provider === 'wechat'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
          : provider === 'apple'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
          : 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
        bio: '正在学习英语，希望能交到外国朋友 🌍',
        native_language: '中文',
        learning_languages: ['英语'],
      };

      // 保存用户信息到本地存储
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      // 跳转到首页
      setTimeout(() => {
        router.replace('/');
      }, 500);
    } catch (error) {
      console.error('登录错误:', error);
      alert('登录失败，请重试');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Screen
      backgroundColor={theme.backgroundRoot}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          {/* Logo 区域 */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <FontAwesome6 name="language" size={48} color={theme.primary} />
            </View>
            <ThemedText variant="h1" style={styles.appName} color={theme.textPrimary}>
              Lingo
            </ThemedText>
            <ThemedText variant="body" style={styles.appDesc} color={theme.textSecondary}>
              连接世界，学习语言
            </ThemedText>
          </View>

          {/* 登录按钮区域 */}
          <View style={styles.loginButtons}>
            

            {/* 微信登录 */}
            <TouchableOpacity
              style={[styles.loginButton, styles.wechatButton]}
              onPress={() => handleLogin('wechat')}
              disabled={!!loading}
            >
              {loading === 'wechat' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome6 name="weixin" size={24} color="#fff" />
                  <ThemedText style={styles.loginButtonText} color={theme.buttonPrimaryText}>
                    微信登录
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>

            
            )}
          </View>

          {/* 底部提示 */}
          <View style={styles.footer}>
            <ThemedText variant="caption" color={theme.textMuted}>
              点击任意按钮即可登录（演示版本）
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </Screen>
  );
}
