import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStyles } from './styles';

interface Contact {
  id: number;
  username: string;
  avatar_url: string;
  bio: string;
  is_online: boolean;
  native_language: string;
}

interface Group {
  id: number;
  name: string;
  avatar_url: string;
  member_count: number;
}

export default function ContactsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 加载当前用户
  const loadCurrentUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 加载联系人列表
const loadContacts = async () => {
  try {
    if (!currentUser) return;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/${currentUser.id}/following`
    );
    
    if (!response.ok) {
      console.error('加载联系人失败: HTTP', response.status);
      setContacts([]);  // 设置为空数组
      return;
    }
    
    const data = await response.json();

    if (data.success) {
      setContacts(data.users || []);
    } else {
      console.error('加载联系人失败:', data.error);
      setContacts([]);  // 设置为空数组
    }
  } catch (error) {
    console.error('加载联系人失败:', error);
    setContacts([]);  // 设置为空数组
  } finally {
    setLoading(false);
  }
};

  // 加载群组列表
const loadGroups = async () => {
  try {
    if (!currentUser) return;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups/user/${currentUser.id}`
    );
    
    if (!response.ok) {
      console.error('加载群组失败: HTTP', response.status);
      setGroups([]);  // 设置为空数组
      return;
    }
    
    const data = await response.json();

    if (data.success) {
      setGroups(data.groups || []);
    } else {
      console.error('加载群组失败:', data.error);
      setGroups([]);  // 设置为空数组
    }
  } catch (error) {
    console.error('加载群组失败:', error);
    setGroups([]);  // 设置为空数组
  }
};

  // 页面聚焦时加载数据
  useFocusEffect(
    React.useCallback(() => {
      loadCurrentUser();
      loadContacts();
      loadGroups();
    }, [currentUser])
  );

  // 过滤联系人和群组
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 渲染联系人
  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => {
        // 跳转到聊天
        // router.push('/chat', { userId: item.id });
        Alert.alert('提示', `即将与 ${item.username} 开始聊天`);
      }}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <FontAwesome6 name="user" size={30} color={theme.textMuted} />
        </View>
        {item.is_online && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.contactInfo}>
        <View style={styles.contactNameRow}>
          <ThemedText variant="bodyMedium" color={theme.textPrimary} style={styles.contactName}>
            {item.username}
          </ThemedText>
          {item.native_language && (
            <View style={[styles.languageBadge, { backgroundColor: theme.backgroundTertiary }]}>
              <ThemedText variant="caption" color={theme.textSecondary}>
                {item.native_language}
              </ThemedText>
            </View>
          )}
        </View>
        {item.bio && (
          <ThemedText variant="caption" color={theme.textMuted} numberOfLines={1}>
            {item.bio}
          </ThemedText>
        )}
      </View>
      <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
    </TouchableOpacity>
  );

  // 渲染群组
  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => {
        Alert.alert('提示', `即将进入群组：${item.name}`);
      }}
    >
      <View style={styles.groupAvatar}>
        <FontAwesome6 name="users" size={30} color={theme.primary} />
      </View>
      <View style={styles.groupInfo}>
        <ThemedText variant="bodyMedium" color={theme.textPrimary} style={styles.groupName}>
          {item.name}
        </ThemedText>
        <ThemedText variant="caption" color={theme.textMuted}>
          {item.member_count} 位成员
        </ThemedText>
      </View>
      <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={{ marginTop: 16 }} color={theme.textSecondary}>
            加载中...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundTertiary }]}>
          <FontAwesome6 name="magnifying-glass" size={16} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="搜索联系人或群组"
            placeholderTextColor={theme.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <FontAwesome6 name="xmark" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 群组列表 */}
      {filteredGroups.length > 0 && (
        <View style={styles.section}>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.sectionTitle}>
            群组
          </ThemedText>
          <FlatList
            data={filteredGroups}
            renderItem={renderGroup}
            keyExtractor={(item) => `group-${item.id}`}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* 联系人列表 */}
      {filteredContacts.length > 0 ? (
        <View style={styles.section}>
          <ThemedText variant="caption" color={theme.textMuted} style={styles.sectionTitle}>
            联系人
          </ThemedText>
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={(item) => `contact-${item.id}`}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome6 name="address-book" size={48} color={theme.textMuted} />
          <ThemedText variant="body" style={styles.emptyText} color={theme.textMuted}>
            {searchText.length > 0 ? '未找到相关联系人' : '暂无联系人'}
          </ThemedText>
          <ThemedText variant="caption" style={styles.emptyHint} color={theme.textMuted}>
            去&ldquo;发现&rdquo;页面添加好友吧
          </ThemedText>
        </View>
      )}
    </Screen>
  );
}
