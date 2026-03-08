import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTranslation } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { languages } from '@/i18n';
import { createStyles } from './styles';
import { createFormDataFile } from '@/utils';

interface User {
  id: number;
  username: string;
  avatar_url: string;
  bio: string;
  native_language: string;
  learning_languages: string[];
}

interface Post {
  id: number;
  content: string;
  media_urls: string[];
  created_at: string;
}

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { t, language } = useTranslation();
  const router = useSafeRouter();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // 加载用户信息
  const loadUserInfo = useCallback(async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }, []);

  // 加载用户帖子
  const loadUserPosts = useCallback(async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return;

      const userData = JSON.parse(userStr);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/posts?userId=${userData.id}`
      );
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('加载帖子失败:', error);
    }
  }, []);

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      loadUserPosts();
    }, [loadUserInfo, loadUserPosts])
  );

  // 上传头像
  const pickAndUploadAvatar = async () => {
    try {
      // 请求权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限错误', '需要相册权限才能选择图片');
        return;
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        setIsUploadingAvatar(true);

        try {
          // 上传到后端
          const formData = new FormData();
          const file = await createFormDataFile(uri, 'avatar.jpg', 'image/jpeg');
          formData.append('file', file as any);

          const uploadResponse = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/upload/avatar`,
            {
              method: 'POST',
              body: formData,
            }
          );

          const uploadData = await uploadResponse.json();

          if (uploadData.success) {
            // 更新用户头像
            const updatedUser = { ...user!, avatar_url: uploadData.url };
            setUser(updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

            Alert.alert('成功', '头像更新成功');
          } else {
            Alert.alert('错误', '头像上传失败');
          }
        } catch (error) {
          console.error('上传头像错误:', error);
          Alert.alert('错误', '头像上传失败');
        } finally {
          setIsUploadingAvatar(false);
        }
      }
    } catch (error) {
      console.error('选择头像错误:', error);
      Alert.alert('错误', '选择头像失败');
    }
  };

  if (!user) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={{ marginTop: 16 }} color={theme.textSecondary}>
            加载中...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView style={styles.container}>
        {/* 头部信息 */}
        <View style={styles.header}>
          {/* 头像 */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={pickAndUploadAvatar}
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <View style={[styles.avatar, styles.avatarLoading]}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            )}
            <View style={styles.editIcon}>
              <FontAwesome6 name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* 用户信息 */}
          <View style={styles.userInfo}>
            <ThemedText variant="h3" color={theme.textPrimary} style={styles.username}>
              {user.username}
            </ThemedText>
            <ThemedText
              variant="caption"
              color={theme.textSecondary}
              style={styles.bio}
            >
              {user.bio || '这个人很懒，还没有填写简介'}
            </ThemedText>
            <View style={styles.languageTags}>
              <View style={[styles.tag, { backgroundColor: theme.primary }]}>
                <ThemedText variant="caption" color={theme.buttonPrimaryText}>
                  母语: {user.native_language || '中文'}
                </ThemedText>
              </View>
              {user.learning_languages?.map((lang, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: theme.accent }]}>
                  <ThemedText variant="caption" color="#fff">
                    学习: {lang}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 分隔线 */}
        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

        {/* 设置选项 */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}
            onPress={() => setShowLanguageSelector(true)}
          >
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                <FontAwesome6 name="language" size={20} color={theme.primary} />
              </View>
              <ThemedText variant="body" color={theme.textPrimary}>
                {t.settings.language}
              </ThemedText>
            </View>
            <View style={styles.settingItemRight}>
              <ThemedText variant="caption" color={theme.textMuted}>
                {languages.find(l => l.code === language)?.nativeName || language}
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}
            onPress={() => {/* TODO: 实现通知设置 */}}
          >
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <FontAwesome6 name="bell" size={20} color={theme.accent} />
              </View>
              <ThemedText variant="body" color={theme.textPrimary}>
                {t.settings.notification}
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}
            onPress={() => {/* TODO: 实现隐私设置 */}}
          >
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: theme.success + '20' }]}>
                <FontAwesome6 name="shield" size={20} color={theme.success} />
              </View>
              <ThemedText variant="body" color={theme.textPrimary}>
                {t.settings.privacy}
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {/* TODO: 实现关于页面 */}}
          >
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: theme.textMuted + '20' }]}>
                <FontAwesome6 name="circle-info" size={20} color={theme.textMuted} />
              </View>
              <ThemedText variant="body" color={theme.textPrimary}>
                {t.settings.about}
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 分隔线 */}
        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

        {/* 我的动态 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            我的动态
          </ThemedText>
          {posts.length === 0 ? (
            <View style={styles.empty}>
              <ThemedText variant="caption" color={theme.textMuted}>
                还没有发布过动态
              </ThemedText>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={[styles.postCard, { backgroundColor: theme.backgroundDefault }]}>
                <ThemedText variant="body" color={theme.textPrimary} style={styles.postContent}>
                  {post.content}
                </ThemedText>
                {post.media_urls?.length > 0 && (
                  <View style={styles.postImages}>
                    {post.media_urls.map((url, index) => (
                      <Image key={index} source={{ uri: url }} style={styles.postImage} />
                    ))}
                  </View>
                )}
                <ThemedText variant="caption" color={theme.textMuted} style={styles.postTime}>
                  {new Date(post.created_at).toLocaleString('zh-CN')}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* 语言选择器 */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </Screen>
  );
}
