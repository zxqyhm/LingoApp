import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

interface GroupInfo {
  id: string;
  name: string;
  description: string;
  allow_screenshot: boolean;
  allow_screen_recording: boolean;
  owner_id: string;
}

export default function GroupSettingsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { groupId } = useSafeSearchParams<{ groupId: string }>();

  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [allowScreenshot, setAllowScreenshot] = useState(true);
  const [allowScreenRecording, setAllowScreenRecording] = useState(true);
  const [loading, setLoading] = useState(false);

  // 加载用户信息
  const loadUserInfo = useCallback(async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }, []);

  // 加载群组信息
  const loadGroupInfo = useCallback(async () => {
    if (!groupId) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups/${groupId}`
      );
      const data = await response.json();

      if (data.success) {
        setGroup(data.group);
        setAllowScreenshot(data.group.allow_screenshot);
        setAllowScreenRecording(data.group.allow_screen_recording);
      }
    } catch (error) {
      console.error('加载群组信息失败:', error);
    }
  }, [groupId]);

  // 页面聚焦时加载数据
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      loadGroupInfo();
    }, [loadUserInfo, loadGroupInfo])
  );

  // 更新群组设置
  const handleUpdateSettings = async () => {
    if (!groupId || !user) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups/${groupId}/settings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            allowScreenshot,
            allowScreenRecording,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('成功', '设置已更新');
        setGroup(data.group);
      } else {
        Alert.alert('错误', data.error || '更新失败');
      }
    } catch (error) {
      console.error('更新设置错误:', error);
      Alert.alert('错误', '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      '解散群组',
      '确定要解散这个群组吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            Alert.alert('提示', '解散功能暂未实现');
          },
        },
      ]
    );
  };

  if (!group || group.owner_id !== user?.id) {
    return (
      <Screen backgroundColor={theme.backgroundRoot}>
        <View style={styles.center}>
          <FontAwesome6 name="lock" size={48} color={theme.textMuted} />
          <ThemedText
            variant="body"
            color={theme.textMuted}
            style={{ marginTop: 16 }}
          >
            只有群主可以访问此页面
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h4" color={theme.textPrimary}>
            群组设置
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* 群组信息 */}
          <View style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
              群组信息
            </ThemedText>
            <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
              <ThemedText variant="body" color={theme.textSecondary}>
                群名称
              </ThemedText>
              <ThemedText variant="body" color={theme.textPrimary}>
                {group.name}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText variant="body" color={theme.textSecondary}>
                群描述
              </ThemedText>
              <ThemedText
                variant="body"
                color={theme.textPrimary}
                numberOfLines={2}
              >
                {group.description || '暂无描述'}
              </ThemedText>
            </View>
          </View>

          {/* 安全设置 */}
          <View style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
              安全设置
            </ThemedText>

            {/* 允许截屏 */}
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <FontAwesome6 name="camera" size={20} color={theme.primary} />
                </View>
                <View>
                  <ThemedText variant="body" color={theme.textPrimary}>
                    允许截屏
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.textMuted}>
                    关闭后，成员无法截屏群聊内容
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={allowScreenshot}
                onValueChange={setAllowScreenshot}
                trackColor={{ false: theme.border, true: theme.primary }}
                ios_backgroundColor={theme.border}
              />
            </View>

            {/* 允许录屏 */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <FontAwesome6 name="video" size={20} color={theme.primary} />
                </View>
                <View>
                  <ThemedText variant="body" color={theme.textPrimary}>
                    允许录屏
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.textMuted}>
                    关闭后，成员无法录屏群聊内容
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={allowScreenRecording}
                onValueChange={setAllowScreenRecording}
                trackColor={{ false: theme.border, true: theme.primary }}
                ios_backgroundColor={theme.border}
              />
            </View>
          </View>

          {/* 安全提示 */}
          <View
            style={[styles.tips, { backgroundColor: `${theme.accent}15`, borderColor: theme.accent }]}
          >
            <FontAwesome6 name="shield-halved" size={20} color={theme.accent} />
            <ThemedText
              variant="body"
              color={theme.textSecondary}
              style={{ marginLeft: 12, flex: 1 }}
            >
              关闭截屏和录屏功能可以更好地保护群聊内容的隐私和安全。建议在讨论敏感话题时开启此功能。
            </ThemedText>
          </View>

          {/* 危险操作 */}
          <View style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
              危险操作
            </ThemedText>
            <TouchableOpacity
              style={[styles.dangerButton, { borderColor: theme.error }]}
              onPress={handleDeleteGroup}
            >
              <FontAwesome6 name="trash" size={20} color={theme.error} />
              <ThemedText variant="body" color={theme.error} style={{ marginLeft: 8 }}>
                解散群组
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* 保存按钮 */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleUpdateSettings}
            disabled={loading}
          >
            <ThemedText
              variant="body"
              color={theme.buttonPrimaryText}
              style={{ fontWeight: '600' }}
            >
              {loading ? '保存中...' : '保存设置'}
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Screen>
  );
}
