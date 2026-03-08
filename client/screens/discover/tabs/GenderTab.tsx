/**
 * 性别 Tab
 */
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function GenderTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [selectedGender, setSelectedGender] = useState('all');

  const users = [
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      name: 'Emma',
      gender: 'female',
      language: 'English',
      distance: '1.2km',
      isOnline: true,
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      name: 'James',
      gender: 'male',
      language: 'Japanese',
      distance: '2.5km',
      isOnline: true,
    },
    {
      id: 3,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      name: 'Sophie',
      gender: 'female',
      language: 'French',
      distance: '3.8km',
      isOnline: false,
    },
    {
      id: 4,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      name: 'David',
      gender: 'male',
      language: 'Spanish',
      distance: '4.2km',
      isOnline: true,
    },
  ];

  const filteredUsers = selectedGender === 'all' ? users : users.filter(user => user.gender === selectedGender);

  return (
    <View style={{ padding: Spacing.md }}>
      {/* 性别筛选 */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md }}>
        <TouchableOpacity
          style={[
            { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
            selectedGender === 'all' ? { backgroundColor: theme.primary } : { backgroundColor: theme.backgroundTertiary }
          ]}
          onPress={() => setSelectedGender('all')}
        >
          <ThemedText 
            variant="body" 
            color={selectedGender === 'all' ? theme.buttonPrimaryText : theme.textPrimary}
          >
            全部
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
            selectedGender === 'male' ? { backgroundColor: theme.primary } : { backgroundColor: theme.backgroundTertiary }
          ]}
          onPress={() => setSelectedGender('male')}
        >
          <ThemedText 
            variant="body" 
            color={selectedGender === 'male' ? theme.buttonPrimaryText : theme.textPrimary}
          >
            男性
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
            selectedGender === 'female' ? { backgroundColor: theme.primary } : { backgroundColor: theme.backgroundTertiary }
          ]}
          onPress={() => setSelectedGender('female')}
        >
          <ThemedText 
            variant="body" 
            color={selectedGender === 'female' ? theme.buttonPrimaryText : theme.textPrimary}
          >
            女性
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* 用户列表 */}
      <ScrollView>
        {filteredUsers.map((user) => (
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
      </ScrollView>
    </View>
  );
}
