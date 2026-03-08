/**
 * 附近 Tab
 */
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function NearbyTab() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState('posts');

  const posts = [
    {
      id: 1,
      user: {
        id: 1,
        name: 'Mike',
        country: 'AU',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      content: '附近有人想一起练习口语吗？',
      distance: '1.2km',
      time: '10分钟前',
      likes: 56,
      comments: 12,
      tags: ['#口语', '#约练'],
    },
    {
      id: 2,
      user: {
        id: 2,
        name: 'Anna',
        country: 'DE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      content: '刚刚到这个城市，想认识新朋友！',
      distance: '2.5km',
      time: '1小时前',
      likes: 32,
      comments: 8,
      tags: ['#交友', '#新人'],
    },
  ];

  const users = [
    {
      id: 1,
      name: 'David',
      country: 'US',
      distance: '0.8km',
      age: 28,
      gender: '男',
      learningLanguage: '中文',
      proficiency: 3,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Yumi',
      country: 'JP',
      distance: '1.5km',
      age: 24,
      gender: '女',
      learningLanguage: '英语',
      proficiency: 4,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Pierre',
      country: 'FR',
      distance: '3.2km',
      age: 32,
      gender: '男',
      learningLanguage: '西班牙语',
      proficiency: 2,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      {/* 选项卡切换 */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity
          style={[
            { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
            activeTab === 'posts' && { borderBottomWidth: 2, borderBottomColor: theme.primary }
          ]}
          onPress={() => setActiveTab('posts')}
        >
          <ThemedText 
            variant="body" 
            color={activeTab === 'posts' ? theme.primary : theme.textMuted}
          >
            附近的动态
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
            activeTab === 'users' && { borderBottomWidth: 2, borderBottomColor: theme.primary }
          ]}
          onPress={() => setActiveTab('users')}
        >
          <ThemedText 
            variant="body" 
            color={activeTab === 'users' ? theme.primary : theme.textMuted}
          >
            附近的人
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* 内容区域 */}
      <ScrollView style={{ flex: 1, padding: Spacing.md }}>
        {activeTab === 'posts' ? (
          /* 附近的动态 */
          posts.map((post) => (
            <View key={post.id} style={{ backgroundColor: theme.backgroundDefault, borderRadius: BorderRadius.lg, marginBottom: Spacing.md, padding: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Image
                  source={{ uri: post.user.avatar }}
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: Spacing.sm }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="body" color={theme.textPrimary}>{post.user.name}</ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    <ThemedText variant="caption" color={theme.textMuted}>{post.user.country}</ThemedText>
                    <ThemedText variant="caption" color={theme.primary}>{post.distance}</ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>{post.time}</ThemedText>
                  </View>
                </View>
                <TouchableOpacity>
                  <FontAwesome6 name="ellipsis-vertical" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              <ThemedText variant="body" color={theme.textPrimary} style={{ marginBottom: Spacing.sm }}>
                {post.content}
              </ThemedText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm }}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={{ backgroundColor: theme.primary + '20', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm }}>
                    <ThemedText variant="caption" color={theme.primary}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <FontAwesome6 name="heart" size={16} color={theme.textMuted} />
                  <ThemedText variant="caption" color={theme.textMuted}>{post.likes}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <FontAwesome6 name="comment" size={16} color={theme.textMuted} />
                  <ThemedText variant="caption" color={theme.textMuted}>{post.comments}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <FontAwesome6 name="share" size={16} color={theme.textMuted} />
                  <ThemedText variant="caption" color={theme.textMuted}>分享</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <FontAwesome6 name="language" size={16} color={theme.textMuted} />
                  <ThemedText variant="caption" color={theme.textMuted}>翻译</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          /* 附近的人 */
          users.map((user) => (
            <TouchableOpacity
              key={user.id}
              onPress={() => router.push('/detail', { id: user.id })}
              style={{ backgroundColor: theme.backgroundDefault, borderRadius: BorderRadius.lg, marginBottom: Spacing.md, padding: Spacing.md }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 50, height: 50, borderRadius: 25, marginRight: Spacing.md }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="body" color={theme.textPrimary}>{user.name}</ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs }}>
                    <ThemedText variant="caption" color={theme.textMuted}>{user.country}</ThemedText>
                    <ThemedText variant="caption" color={theme.primary}>{user.distance}</ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>{user.age}岁</ThemedText>
                    <ThemedText variant="caption" color={theme.textMuted}>{user.gender}</ThemedText>
                  </View>
                  <View>
                    <ThemedText variant="caption" color={theme.textMuted}>正在学习: </ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                      <View style={{ backgroundColor: theme.primary, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm }}>
                        <ThemedText variant="caption" color={theme.buttonPrimaryText}>{user.learningLanguage}</ThemedText>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {[...Array(5)].map((_, index) => (
                          <FontAwesome6 
                            key={index} 
                            name="circle" 
                            size={8} 
                            color={index < user.proficiency ? theme.primary : theme.textMuted} 
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
