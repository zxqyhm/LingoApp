import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

export default function CreateGroupScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allowScreenshot, setAllowScreenshot] = useState(true);
  const [allowScreenRecording, setAllowScreenRecording] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('请输入群组名称');
      return;
    }

    try {
      setLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        alert('请先登录');
        return;
      }

      const user = JSON.parse(userStr);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/groups`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            ownerId: user.id,
            allowScreenshot,
            allowScreenRecording,
            isPublic,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('创建成功');
        router.back();
      } else {
        alert(data.error || '创建失败');
      }
    } catch (error) {
      console.error('创建群组错误:', error);
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 顶部标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome6 name="xmark" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h4" color={theme.textPrimary}>
            创建群组
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!name.trim() || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={!name.trim() || loading}
          >
            <ThemedText
              variant="smallMedium"
              color={!name.trim() ? theme.textMuted : theme.buttonPrimaryText}
            >
              创建
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* 群名称 */}
          <View style={styles.formGroup}>
            <ThemedText variant="body" color={theme.textPrimary} style={styles.label}>
              群名称
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                },
              ]}
              placeholder="请输入群组名称"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={30}
            />
          </View>

          {/* 群描述 */}
          <View style={styles.formGroup}>
            <ThemedText variant="body" color={theme.textPrimary} style={styles.label}>
              群描述
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                },
              ]}
              placeholder="请输入群组描述（可选）"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          {/* 群设置 */}
          <View style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
              群设置
            </ThemedText>

            {/* 允许截屏 */}
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <ThemedText variant="body" color={theme.textPrimary}>
                  允许截屏
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  关闭后，成员无法截屏群聊内容
                </ThemedText>
              </View>
              <Switch
                value={allowScreenshot}
                onValueChange={setAllowScreenshot}
                trackColor={{ false: theme.border, true: theme.primary }}
                ios_backgroundColor={theme.border}
              />
            </View>

            {/* 允许录屏 */}
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <ThemedText variant="body" color={theme.textPrimary}>
                  允许录屏
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  关闭后，成员无法录屏群聊内容
                </ThemedText>
              </View>
              <Switch
                value={allowScreenRecording}
                onValueChange={setAllowScreenRecording}
                trackColor={{ false: theme.border, true: theme.primary }}
                ios_backgroundColor={theme.border}
              />
            </View>

            {/* 公开群 */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText variant="body" color={theme.textPrimary}>
                  公开群
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  关闭后，只有群主邀请才能加入
                </ThemedText>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: theme.border, true: theme.primary }}
                ios_backgroundColor={theme.border}
              />
            </View>
          </View>

          {/* 安全提示 */}
          <View
            style={[styles.tips, { backgroundColor: `${theme.accent}15`, borderColor: theme.accent }]}
          >
            <FontAwesome6 name="shield-halved" size={16} color={theme.accent} />
            <ThemedText
              variant="caption"
              color={theme.textSecondary}
              style={{ marginLeft: 8, flex: 1 }}
            >
              关闭截屏和录屏功能可以更好地保护群聊内容的隐私和安全
            </ThemedText>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
