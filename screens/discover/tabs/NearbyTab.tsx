/**
 * 附近 Tab
 */
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function NearbyTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [users] = useState([
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      name: 'Emma',
      language: 'English',
      distance: '1.2km',
      isOnline: true,
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      name: 'James',
      language: 'Japanese',
      distance: '2.5km',
      isOnline: true,
    },
    {
      id: 3,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      name: 'Sophie',
      language: 'French',
      distance: '3.8km',
      isOnline: false,
    },
  ]);

  return (
    <View style={{ padding: Spacing.md }}>
      <View style={{ marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
        <FontAwesome6 name="location-dot" size={16} color={theme.primary} />
        <ThemedText variant="h4" color={theme.primary}>
          附近的语言学习者
        </ThemedText>
      </View>
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          onPress={() => router.push('/detail', { id: user.id })}
          style={{
            backgroundColor: theme.backgroundDefault,
            borderRadius: BorderRadius.lg,
            marginBottom: Spacing.md,
            padding: Spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ position: 'relative', marginRight: Spacing.md }}>
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              contentFit="cover"
            />
            {user.isOnline && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: '#4ade80',
                  borderWidth: 2,
                  borderColor: theme.backgroundDefault,
                }}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="body" color={theme.textPrimary} style={{ marginBottom: Spacing.xs }}>
              {user.name}
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <ThemedText variant="caption" color={theme.textMuted}>
                🗣️ {user.language}
              </ThemedText>
              <FontAwesome6 name="location-arrow" size={12} color={theme.textMuted} />
              <ThemedText variant="caption" color={theme.textMuted}>
                {user.distance}
              </ThemedText>
            </View>
          </View>
          <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
