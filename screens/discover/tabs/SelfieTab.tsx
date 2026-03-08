/**
 * 自拍 Tab
 */
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function SelfieTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [posts] = useState([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
      title: '今天的法语学习打卡',
      author: 'Lucy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop',
      likes: 89,
      comments: 23,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=450&fit=crop',
      title: '英语口语练习第30天',
      author: 'Mike',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop',
      likes: 124,
      comments: 38,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      title: '日语学习日记',
      author: 'Yuki',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop',
      likes: 156,
      comments: 42,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=520&fit=crop',
      title: '德语发音练习',
      author: 'Hans',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop',
      likes: 67,
      comments: 19,
    },
  ]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: Spacing.md }}>
        <View style={{ marginBottom: Spacing.md }}>
          <ThemedText variant="h4" color={theme.accent} style={{ marginBottom: Spacing.xs }}>
            📸 学习打卡自拍
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted}>
            分享你的学习瞬间
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              onPress={() => router.push('/detail', { id: post.id })}
              style={{
                width: '48%',
                backgroundColor: theme.backgroundDefault,
                borderRadius: BorderRadius.md,
                overflow: 'hidden',
                marginBottom: Spacing.sm,
              }}
            >
              <Image
                source={{ uri: post.imageUrl }}
                style={{ width: '100%', height: 180 }}
                contentFit="cover"
              />
              <View style={{ padding: Spacing.sm }}>
                <ThemedText variant="caption" color={theme.textPrimary} numberOfLines={2}>
                  {post.title}
                </ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs, gap: Spacing.xs }}>
                  <Image
                    source={{ uri: post.avatar }}
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                    contentFit="cover"
                  />
                  <ThemedText variant="caption" color={theme.textMuted}>
                    {post.author}
                  </ThemedText>
                </View>
                <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs }}>
                  <ThemedText variant="caption" color={theme.accent}>
                    ❤️ {post.likes}
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.textMuted}>
                    💬 {post.comments}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
