import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  AppState,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

interface GroupMessage {
  id: string;
  sender_id: string;
  content: string;
  type: string;
  created_at: string;
  users: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

interface GroupInfo {
  id: string;
  name: string;
  allow_screenshot: boolean;
  allow_screen_recording: boolean;
  owner_id: string;
}

export default function GroupChatScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { groupId } = useSafeSearchParams<{ groupId: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageText, setMessageText] = useState('');
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

        // 根据群组设置启用/禁用截屏
        if (data.group) {
          await updateScreenCaptureSettings(
            data.group.allow_screenshot,
            data.group.allow_screen_recording
          );
        }
      }
    } catch (error) {
      console.error('加载群组信息失败:', error);
    }
  }, [groupId]);

  // 加载消息
  const loadMessages = useCallback(async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups/${groupId}/messages`
      );
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
        // 滚动到底部
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('加载消息失败:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 更新截屏/录屏设置
  const updateScreenCaptureSettings = async (
    allowScreenshot: boolean,
    allowScreenRecording: boolean
  ) => {
    try {
      if (Platform.OS === 'android') {
        // Android 使用 FLAG_SECURE 防止截屏
        await ScreenCapture.preventScreenCaptureAsync(allowScreenshot ? 'false' : 'true');
      }
    } catch (error) {
      console.error('更新截屏设置失败:', error);
    }
  };

  // 页面聚焦时加载数据
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      loadGroupInfo();
      loadMessages();

      return () => {
        // 页面离开时恢复默认设置
        ScreenCapture.preventScreenCaptureAsync('false');
      };
    }, [loadUserInfo, loadGroupInfo, loadMessages])
  );

  // 监听应用状态变化
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && group) {
        // 应用回到前台时重新检查设置
        updateScreenCaptureSettings(
          group.allow_screenshot,
          group.allow_screen_recording
        );
      }
    });

    return () => subscription.remove();
  }, [group]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !groupId || !user) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups/${groupId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: user.id,
            content: messageText.trim(),
            type: 'text',
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessageText('');
        // 重新加载消息
        loadMessages();
      } else {
        Alert.alert('错误', data.error || '发送失败');
      }
    } catch (error) {
      console.error('发送消息错误:', error);
      Alert.alert('错误', '发送失败，请重试');
    }
  };

  const handleSettings = () => {
    if (!group || group.owner_id !== user?.id) {
      Alert.alert('提示', '只有群主可以修改群组设置');
      return;
    }
    router.push(`/group-settings?groupId=${groupId}`);
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="chevron-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ThemedText variant="h4" color={theme.textPrimary} numberOfLines={1}>
              {group?.name || '群聊'}
            </ThemedText>
            {group && (!group.allow_screenshot || !group.allow_screen_recording) && (
              <View style={styles.securityBadge}>
                <FontAwesome6 name="shield-halved" size={12} color={theme.accent} />
                <ThemedText variant="caption" color={theme.accent} style={{ marginLeft: 4 }}>
                  {(!group.allow_screenshot && !group.allow_screen_recording) ? '禁止截屏录屏' : 
                   (!group.allow_screenshot ? '禁止截屏' : '禁止录屏')}
                </ThemedText>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleSettings}>
            <FontAwesome6 name="gear" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 消息列表 */}
        {loading ? (
          <View style={styles.center}>
            <FontAwesome6 name="spinner" size={24} color={theme.primary} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.center}>
            <ThemedText variant="caption" color={theme.textMuted}>
              暂无消息
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          >
            {messages.map((message) => {
              const isSelf = message.sender_id === user?.id;
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    isSelf ? styles.messageRowSelf : styles.messageRowOther,
                  ]}
                >
                  {!isSelf && (
                    <View style={styles.avatarSmall}>
                      <FontAwesome6
                        name="user"
                        size={16}
                        color={theme.textMuted}
                      />
                    </View>
                  )}
                  <View style={styles.messageContent}>
                    {!isSelf && (
                      <ThemedText
                        variant="caption"
                        color={theme.textSecondary}
                        style={styles.senderName}
                      >
                        {message.users?.username || '未知用户'}
                      </ThemedText>
                    )}
                    <View
                      style={[
                        styles.messageBubble,
                        isSelf
                          ? styles.messageBubbleSelf
                          : styles.messageBubbleOther,
                        { backgroundColor: isSelf ? theme.primary : theme.backgroundDefault },
                      ]}
                    >
                      <ThemedText
                        variant="body"
                        color={isSelf ? theme.buttonPrimaryText : theme.textPrimary}
                      >
                        {message.content}
                      </ThemedText>
                    </View>
                    <ThemedText
                      variant="caption"
                      color={theme.textMuted}
                      style={styles.messageTime}
                    >
                      {new Date(message.created_at).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* 输入框 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={[styles.inputContainer, { borderTopColor: theme.border }]}>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.backgroundDefault,
                },
              ]}
              placeholder="输入消息..."
              placeholderTextColor={theme.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <FontAwesome6
                name="paper-plane"
                size={18}
                color={messageText.trim() ? '#fff' : theme.textMuted}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Screen>
  );
}
