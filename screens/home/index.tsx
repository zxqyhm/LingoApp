import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { MasonryGrid } from '@/components/MasonryGrid';
import { MasonryItem } from '@/utils/masonry';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [posts, setPosts] = useState<MasonryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 加载帖子列表
  const loadPosts = useCallback(async () => {
    try {
      /**
       * 服务端文件：server/src/routes/posts.ts
       * 接口：GET /api/v1/posts
       * Query 参数：page?: string, limit?: string, languageTag?: string, userId?: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/posts?page=1&limit=20`
      );
      const result = await response.json();

      if (result.success && result.posts) {
        const formattedPosts: MasonryItem[] = result.posts.map((post: any) => ({
          id: post.id,
          imageUrl: post.media_urls?.[0] || `https://picsum.photos/400/${400 + Math.random() * 200}`,
          aspectRatio: post.media_urls?.[0] ? 1 : 0.8 + Math.random() * 0.4,
          title: post.content,
          user: post.user,
          likesCount: post.likes_count,
          commentsCount: post.comments_count,
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  // 初始加载和页面返回时刷新
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts])
  );

  // 处理帖子点击
  const handlePostPress = (item: MasonryItem) => {
    router.push('/detail', { postId: item.id });
  };

  return (
    <Screen
      backgroundColor={theme.backgroundRoot}
      statusBarStyle="light"
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <ThemedText variant="h3" color={theme.textPrimary}>
            Lingo
          </ThemedText>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="magnifying-glass" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/publish')}>
              <FontAwesome6 name="plus" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 内容区域 */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="image" size={48} color={theme.textMuted} />
            <ThemedText variant="body" style={styles.emptyText} color={theme.textMuted}>
              暂无内容
            </ThemedText>
          </View>
        ) : (
          <MasonryGrid data={posts} onItemPress={handlePostPress} />
        )}
      </SafeAreaView>
    </Screen>
  );
}
