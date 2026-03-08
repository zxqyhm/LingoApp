/**
 * 推荐 Tab
 */
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function RecommendTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [posts] = useState([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=350&fit=crop',
      title: '🔥 热门：30天掌握基础日语',
      author: '日语老师',
      likes: 128,
      comments: 45,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=280&fit=crop',
      title: '🌟 推荐：英语口语速成法',
      author: 'EnglishMaster',
      likes: 96,
      comments: 32,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&h=320&fit=crop',
      title: '✨ 精选：法语入门指南',
      author: '法语达人',
      likes: 87,
      comments: 28,
    },
  ]);

  return (
    <View style={{ padding: Spacing.md }}>
      <View style={{ marginBottom: Spacing.md }}>
        <ThemedText variant="h4" color={theme.primary} style={{ marginBottom: Spacing.xs }}>
          为你推荐
        </ThemedText>
        <ThemedText variant="caption" color={theme.textMuted}>
          基于你的学习兴趣智能推荐
        </ThemedText>
      </View>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onPress={() => router.push('/detail', { id: post.id })}
          style={{
            backgroundColor: theme.backgroundDefault,
            borderRadius: BorderRadius.lg,
            marginBottom: Spacing.md,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.primary + '20',
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
                <ThemedText variant="caption" color={theme.primary}>
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
