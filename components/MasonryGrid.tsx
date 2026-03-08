import React, { useMemo } from 'react';
import { View, ScrollView, useWindowDimensions, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { distributeItems, getOptimizedDimensions, MasonryItem } from '@/utils/masonry';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface MasonryGridProps {
  data: MasonryItem[];
  onItemPress?: (item: MasonryItem) => void;
}

export function MasonryGrid({ data, onItemPress }: MasonryGridProps) {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  // 布局常量
  const COLUMNS = 2;
  const GAP = 12;
  const PADDING = 16;
  const COLUMN_WIDTH = (width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  // 使用 useMemo 缓存计算结果
  const columnData = useMemo(
    () => distributeItems(data, COLUMN_WIDTH, COLUMNS),
    [data, COLUMN_WIDTH]
  );

  const renderPostCard = (item: MasonryItem) => {
    const { height } = getOptimizedDimensions(item.aspectRatio, COLUMN_WIDTH);

    return (
      <Pressable
        key={item.id}
        style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
        onPress={() => onItemPress?.(item)}
      >
        {/* 图片容器 */}
        <View style={[styles.imageWrapper, { height, width: COLUMN_WIDTH }]}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ flex: 1 }}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* 内容区域 */}
        <View style={styles.textWrapper}>
          {item.title && (
            <ThemedText numberOfLines={2} variant="smallMedium" color={theme.textPrimary}>
              {item.title}
            </ThemedText>
          )}

          {/* 用户信息 */}
          {item.user && (
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.user.avatarUrl || `https://i.pravatar.cc/40?u=${item.user.username}` }}
                style={styles.avatar}
              />
              <ThemedText variant="caption" numberOfLines={1} style={styles.username} color={theme.textSecondary}>
                {item.user.username}
              </ThemedText>
            </View>
          )}

          {/* 互动数据 */}
          <View style={styles.interactions}>
            <View style={styles.interactionItem}>
              <FontAwesome6 name="heart" size={12} color={theme.textMuted} />
              <ThemedText variant="caption" color={theme.textMuted}>
                {item.likesCount || 0}
              </ThemedText>
            </View>
            <View style={styles.interactionItem}>
              <FontAwesome6 name="comment" size={12} color={theme.textMuted} />
              <ThemedText variant="caption" color={theme.textMuted}>
                {item.commentsCount || 0}
              </ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: PADDING }]}>
      <View style={[styles.columnsProps, { gap: GAP }]}>
        {columnData.map((colItems, colIndex) => (
          <View key={colIndex} style={[styles.column, { gap: GAP }]}>
            {colItems.map(renderPostCard)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  columnsProps: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 0,
  },
  imageWrapper: {
    overflow: 'hidden',
    backgroundColor: '#e1e1e1',
  },
  textWrapper: {
    padding: 12,
    gap: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  username: {
    flex: 1,
  },
  interactions: {
    flexDirection: 'row',
    gap: 12,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
