import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

interface Group {
  id: string;
  name: string;
  avatar_url: string;
  description: string;
  member_count: number;
  allow_screenshot: boolean;
  allow_screen_recording: boolean;
  owner: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export default function MessagesScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
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

  // 加载群组列表
  const loadGroups = useCallback(async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) return;

    const userData = JSON.parse(userStr);
    setLoading(true);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups?userId=${userData.id}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.success) {
      setGroups(data.groups || []);
    } else {
      console.error('加载群组失败:', data.error || '未知错误');
    }
  } catch (error) {
    console.error('加载群组列表失败:', error);
  } finally {
    setLoading(false);
  }
}, []);

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      loadGroups();
    }, [loadUserInfo, loadGroups])
  );

  const handleCreateGroup = () => {
    router.push('/create-group');
  };

  const handleGroupPress = (group: Group) => {
    router.push(`/group-chat?groupId=${group.id}`);
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部标题栏 */}
        <View style={styles.header}>
          <ThemedText variant="h3" color={theme.textPrimary}>
            消息
          </ThemedText>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGroup}
          >
            <FontAwesome6 name="plus" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* 群组列表 */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.empty}>
            <FontAwesome6 name="users" size={48} color={theme.textMuted} />
            <ThemedText
              variant="caption"
              color={theme.textMuted}
              style={{ marginTop: 16 }}
            >
              还没有加入任何群组
            </ThemedText>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: theme.primary }]}
              onPress={handleCreateGroup}
            >
              <ThemedText variant="body" color={theme.buttonPrimaryText}>
                创建群组
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.list}>
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupItem, { backgroundColor: theme.backgroundDefault }]}
                onPress={() => handleGroupPress(group)}
              >
                <View style={styles.groupInfo}>
                  <View style={styles.avatar}>
                    <FontAwesome6
                      name="users"
                      size={28}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.groupText}>
                    <ThemedText variant="body" color={theme.textPrimary} style={styles.groupName}>
                      {group.name}
                    </ThemedText>
                    <ThemedText
                      variant="caption"
                      color={theme.textSecondary}
                      style={styles.groupDesc}
                    >
                      {group.description || '暂无描述'}
                    </ThemedText>
                    <View style={styles.groupMeta}>
                      <FontAwesome6 name="user" size={12} color={theme.textMuted} />
                      <ThemedText
                        variant="caption"
                        color={theme.textMuted}
                        style={{ marginLeft: 4 }}
                      >
                        {group.member_count} 人
                      </ThemedText>
                      {(!group.allow_screenshot || !group.allow_screen_recording) && (
                        <FontAwesome6
                          name="shield-halved"
                          size={12}
                          color={theme.accent}
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}
