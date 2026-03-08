/**
 * 关注 Tab
 */
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function FollowingTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [posts] = useState([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      title: '日语学习第100天打卡',
      author: '日语达人',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=60&h=60&fit=crop',
      language: 'Japanese',
      time: '2小时前',
      likes: 234,
      comments: 56,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
      title: '法语语法笔记整理',
      author: '法语爱好者',
      avatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=60&h=60&fit=crop',
      language: 'French',
      time: '5小时前',
      likes: 189,
      comments: 43,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=280&fit=crop',
      title: '英语口语技巧分享',
      author: '英语老师',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=60&h=60&fit=crop',
      language: 'English',
      time: '1天前',
      likes: 312,
      comments: 78,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400&h=320&fit=crop',
      title: '西班牙语入门指南',
      author: '西语学习',
      avatar: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=60&h=60&fit=crop',
      language: 'Spanish',
      time: '2天前',
      likes: 167,
      comments: 35,
    },
  ]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: Spacing.md }}>
        <View style={{ marginBottom: Spacing.md }}>
          <ThemedText variant="h4" color={theme.textPrimary} style={{ marginBottom: Spacing.xs }}>
            关注动态
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted}>
            来自你关注的语言学习者
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
            }}
          >
            <Image
              source={{ uri: post.imageUrl }}
              style={{ width: '100%', height: 180 }}
              contentFit="cover"
            />
            <View style={{ padding: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Image
                  source={{ uri: post.avatar }}
                  style={{ width: 32, height: 32, borderRadius: 16, marginRight: Spacing.sm }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="caption" color={theme.textPrimary} style={{ marginBottom: 2 }}>
                    {post.author}
                  </ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                    <FontAwesome6 name="language" size={10} color={theme.textMuted} />
                    <ThemedText variant="caption" color={theme.textMuted}>
                      {post.language}
                    </ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>
                      ·
                    </ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>
                      {post.time}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <ThemedText variant="body" color={theme.textPrimary} style={{ marginBottom: Spacing.sm }}>
                {post.title}
              </ThemedText>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <ThemedText variant="caption" color={theme.textMuted}>
                  ❤️ {post.likes}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  💬 {post.comments}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted}>
                  🔄 分享
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
