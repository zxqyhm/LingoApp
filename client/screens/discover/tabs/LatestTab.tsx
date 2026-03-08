/**
 * 最新 Tab
 */
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function LatestTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [posts] = useState([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop',
      title: '今天学了新的英语单词',
      author: 'Alice',
      likes: 42,
      comments: 8,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=500&fit=crop',
      title: '法语学习心得分享',
      author: 'Bob',
      likes: 38,
      comments: 12,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=400&fit=crop',
      title: '我的日语学习进度',
      author: 'Charlie',
      likes: 56,
      comments: 15,
    },
  ]);

  return (
    <View style={{ padding: Spacing.md }}>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onPress={() => router.push('/detail', { id: post.id })}
          style={{
            backgroundColor: theme.backgroundDefault,
            borderRadius: BorderRadius.lg,
            marginBottom: Spacing.md,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: post.imageUrl }}
            style={{ width: '100%', height: 200 }}
            contentFit="cover"
          />
          <View style={{ padding: Spacing.md }}>
            <ThemedText variant="body" color={theme.textPrimary} style={{ marginBottom: Spacing.sm }}>
              {post.title}
            </ThemedText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText variant="caption" color={theme.textMuted}>
                {post.author}
              </ThemedText>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <ThemedText variant="caption" color={theme.textMuted}>
                  ❤️ {post.likes}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  💬 {post.comments}
                </ThemedText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
