import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';

export default function NotificationsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 通知设置状态
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [messageSound, setMessageSound] = useState(true);
  const [messageVibration, setMessageVibration] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView style={styles.container}>
        {/* 通知设置 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            通知
          </ThemedText>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="bell" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                推送通知
              </ThemedText>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={pushNotifications ? theme.primary : theme.backgroundDefault}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="comment" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                消息通知
              </ThemedText>
            </View>
            <Switch
              value={messageNotifications}
              onValueChange={setMessageNotifications}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={messageNotifications ? theme.primary : theme.backgroundDefault}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="gear" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                系统通知
              </ThemedText>
            </View>
            <Switch
              value={systemNotifications}
              onValueChange={setSystemNotifications}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={systemNotifications ? theme.primary : theme.backgroundDefault}
            />
          </View>
        </View>

        {/* 隐私设置 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            隐私
          </ThemedText>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="eye" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                谁可以看我
              </ThemedText>
            </View>
            <View style={styles.settingItemRight}>
              <ThemedText variant="caption" color={theme.textMuted}>
                所有人
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="paper-plane" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                谁可以给我发消息
              </ThemedText>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={theme.primary}
            />
          </View>
        </View>

        {/* 聊天设置 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            聊天
          </ThemedText>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="volume-high" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                消息提示音
              </ThemedText>
            </View>
            <Switch
              value={messageSound}
              onValueChange={setMessageSound}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={messageSound ? theme.primary : theme.backgroundDefault}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="mobile-screen" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                消息震动
              </ThemedText>
            </View>
            <Switch
              value={messageVibration}
              onValueChange={setMessageVibration}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={messageVibration ? theme.primary : theme.backgroundDefault}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="check-double" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                已读回执
              </ThemedText>
            </View>
            <Switch
              value={readReceipts}
              onValueChange={setReadReceipts}
              trackColor={{ false: theme.backgroundTertiary, true: theme.primary + '80' }}
              thumbColor={readReceipts ? theme.primary : theme.backgroundDefault}
            />
          </View>
        </View>

        {/* 关于 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            关于
          </ThemedText>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="info-circle" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                版本
              </ThemedText>
            </View>
            <ThemedText variant="caption" color={theme.textMuted}>
              1.0.0
            </ThemedText>
          </View>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="file-contract" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                用户协议
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="shield" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                隐私政策
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 账号 */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            账号
          </ThemedText>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="right-left" size={20} color={theme.primary} />
              <ThemedText variant="body" color={theme.textPrimary} style={styles.settingText}>
                切换账号
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.error }]}>
            <View style={styles.settingItemLeft}>
              <FontAwesome6 name="right-from-bracket" size={20} color={theme.error} />
              <ThemedText variant="body" color={theme.error} style={styles.settingText}>
                退出登录
              </ThemedText>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color={theme.error} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
