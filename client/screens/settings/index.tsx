import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTranslation } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { createStyles } from './styles';

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { t } = useTranslation();
  const router = useSafeRouter();
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
  });
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showActivityStatus: true,
    allowComments: true,
    allowShares: true,
  });
  const [chatSettings, setChatSettings] = useState({
    messagePreviews: true,
    readReceipts: true,
    typingIndicators: true,
  });
  const [general, setGeneral] = useState({
    darkMode: isDark,
    autoPlayVideos: true,
    saveData: false,
  });

  // 退出登录
  const handleLogout = async () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: async () => {
          try {
            // 清除用户信息
            await AsyncStorage.removeItem('user');
            // 跳转到登录页
            router.replace('/login');
          } catch (error) {
            console.error('退出登录失败:', error);
          }
        },
      },
    ]);
  };

  // 切换账号
  const handleSwitchAccount = () => {
    Alert.alert('切换账号', '确定要切换账号吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '切换',
        onPress: async () => {
          try {
            // 清除用户信息
            await AsyncStorage.removeItem('user');
            // 跳转到登录页
            router.replace('/login');
          } catch (error) {
            console.error('切换账号失败:', error);
          }
        },
      },
    ]);
  };

  // 处理通知设置变化
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 处理隐私设置变化
  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 处理聊天设置变化
  const handleChatChange = (key: keyof typeof chatSettings) => {
    setChatSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 处理通用设置变化
  const handleGeneralChange = (key: keyof typeof general) => {
    setGeneral(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary}>
            设置
          </ThemedText>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content}>
          {/* 账户设置 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              账户设置
            </ThemedText>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                  <FontAwesome6 name="user" size={20} color={theme.primary} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  个人资料
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                  <FontAwesome6 name="lock" size={20} color={theme.accent} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  密码
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.success + '20' }]}>
                  <FontAwesome6 name="email" size={20} color={theme.success} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  邮箱
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* 通用设置 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              通用设置
            </ThemedText>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.textMuted + '20' }]}>
                  <FontAwesome6 name="moon" size={20} color={theme.textMuted} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  暗色模式
                </ThemedText>
              </View>
              <Switch
                value={general.darkMode}
                onValueChange={() => handleGeneralChange('darkMode')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.textMuted + '20' }]}>
                  <FontAwesome6 name="video" size={20} color={theme.textMuted} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  自动播放视频
                </ThemedText>
              </View>
              <Switch
                value={general.autoPlayVideos}
                onValueChange={() => handleGeneralChange('autoPlayVideos')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageSelector(true)}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.textMuted + '20' }]}>
                  <FontAwesome6 name="language" size={20} color={theme.textMuted} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  语言
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* 通知设置 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              通知设置
            </ThemedText>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                  <FontAwesome6 name="heart" size={20} color={theme.primary} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  点赞
                </ThemedText>
              </View>
              <Switch
                value={notifications.likes}
                onValueChange={() => handleNotificationChange('likes')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                  <FontAwesome6 name="comment" size={20} color={theme.accent} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  评论
                </ThemedText>
              </View>
              <Switch
                value={notifications.comments}
                onValueChange={() => handleNotificationChange('comments')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.success + '20' }]}>
                  <FontAwesome6 name="user-plus" size={20} color={theme.success} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  关注
                </ThemedText>
              </View>
              <Switch
                value={notifications.follows}
                onValueChange={() => handleNotificationChange('follows')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.textMuted + '20' }]}>
                  <FontAwesome6 name="message" size={20} color={theme.textMuted} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  消息
                </ThemedText>
              </View>
              <Switch
                value={notifications.messages}
                onValueChange={() => handleNotificationChange('messages')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
          </View>

          {/* 隐私设置 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              隐私设置
            </ThemedText>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                  <FontAwesome6 name="user-lock" size={20} color={theme.primary} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  私密账户
                </ThemedText>
              </View>
              <Switch
                value={privacy.privateAccount}
                onValueChange={() => handlePrivacyChange('privateAccount')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                  <FontAwesome6 name="circle-dot" size={20} color={theme.accent} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  显示活动状态
                </ThemedText>
              </View>
              <Switch
                value={privacy.showActivityStatus}
                onValueChange={() => handlePrivacyChange('showActivityStatus')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.success + '20' }]}>
                  <FontAwesome6 name="comment" size={20} color={theme.success} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  允许评论
                </ThemedText>
              </View>
              <Switch
                value={privacy.allowComments}
                onValueChange={() => handlePrivacyChange('allowComments')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.textMuted + '20' }]}>
                  <FontAwesome6 name="share-from-square" size={20} color={theme.textMuted} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  允许分享
                </ThemedText>
              </View>
              <Switch
                value={privacy.allowShares}
                onValueChange={() => handlePrivacyChange('allowShares')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
          </View>

          {/* 聊天设置 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              聊天设置
            </ThemedText>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                  <FontAwesome6 name="eye" size={20} color={theme.primary} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  消息预览
                </ThemedText>
              </View>
              <Switch
                value={chatSettings.messagePreviews}
                onValueChange={() => handleChatChange('messagePreviews')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                  <FontAwesome6 name="check-double" size={20} color={theme.accent} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  已读回执
                </ThemedText>
              </View>
              <Switch
                value={chatSettings.readReceipts}
                onValueChange={() => handleChatChange('readReceipts')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.success + '20' }]}>
                  <FontAwesome6 name="keyboard" size={20} color={theme.success} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  打字指示器
                </ThemedText>
              </View>
              <Switch
                value={chatSettings.typingIndicators}
                onValueChange={() => handleChatChange('typingIndicators')}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.backgroundDefault}
              />
            </View>
          </View>

          {/* 关于 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              关于
            </ThemedText>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                  <FontAwesome6 name="circle-info" size={20} color={theme.primary} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  关于 LingoTalk
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                  <FontAwesome6 name="star" size={20} color={theme.accent} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  给我们评分
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.success + '20' }]}>
                  <FontAwesome6 name="file-circle-question" size={20} color={theme.success} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  帮助与反馈
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* 账号操作 */}
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText variant="bodyMedium" color={theme.textSecondary} style={styles.sectionTitle}>
              账号操作
            </ThemedText>
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]} onPress={handleSwitchAccount}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                  <FontAwesome6 name="right-left" size={20} color={theme.primary} />
                </View>
                <ThemedText variant="body" color={theme.textPrimary}>
                  切换账号
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.error + '20' }]}>
                  <FontAwesome6 name="right-from-bracket" size={20} color={theme.error} />
                </View>
                <ThemedText variant="body" color={theme.error}>
                  退出登录
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 语言选择器 */}
        <LanguageSelector
          visible={showLanguageSelector}
          onClose={() => setShowLanguageSelector(false)}
        />
      </View>
    </Screen>
  );
}