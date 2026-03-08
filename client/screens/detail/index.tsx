import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams, useSafeRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';
import { env } from '@/utils/env';

interface Post {
  id: string;
  content: string;
  media_urls: string[];
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_favorited: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export default function DetailScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const params = useLocalSearchParams();
  const postId = params.postId as string || params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  // 加载帖子详情
  const loadPostDetail = useCallback(async () => {
    try {
      const response = await fetch(`${env.backendBaseUrl}/api/v1/posts/${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.post);
      }
    } catch (error) {
      console.error('加载帖子详情失败:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 加载评论
  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`${env.backendBaseUrl}/api/v1/comments?postId=${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  }, [postId]);

  // 翻译内容
  const handleTranslate = async () => {
    if (!post) return;
    
    try {
      setIsTranslating(true);
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(post.content)}&langpair=auto|zh`);
      const data = await response.json();
      
      if (data.responseData) {
        setTranslatedContent(data.responseData.translatedText);
      }
    } catch (error) {
      console.error('翻译失败:', error);
      Alert.alert('错误', '翻译失败，请稍后重试');
    } finally {
      setIsTranslating(false);
    }
  };

  // 点赞/取消点赞
  const handleLike = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(`${env.backendBaseUrl}/api/v1/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post.id,
          is_liked: !post.is_liked,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            is_liked: !prev.is_liked,
            likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1,
          };
        });
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // 收藏/取消收藏
  const handleFavorite = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(`${env.backendBaseUrl}/api/v1/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post.id,
          is_favorited: !post.is_favorited,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            is_favorited: !prev.is_favorited,
          };
        });
      }
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  // 转发
  const handleShare = () => {
    // 实现转发功能
    Alert.alert('转发', '转发功能开发中');
  };

  // 发布评论
  const handleComment = async () => {
    if (!post || !commentText.trim()) return;
    
    try {
      const response = await fetch(`${env.backendBaseUrl}/api/v1/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post.id,
          content: commentText.trim(),
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCommentText('');
        loadComments();
        setPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            comments_count: prev.comments_count + 1,
          };
        });
      }
    } catch (error) {
      console.error('发布评论失败:', error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPostDetail();
    loadComments();
  }, [loadPostDetail, loadComments]);

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </Screen>
    );
  }

  if (!post) {
    return (
      <Screen backgroundColor={theme.backgroundRoot}>
        <View style={[styles.container, styles.errorContainer]}>
          <ThemedText variant="body" color={theme.textMuted}>
            帖子不存在
          </ThemedText>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <ThemedText variant="body" color={theme.buttonPrimaryText}>
              返回
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView style={styles.container}>
        {/* 作者信息 */}
        <View style={[styles.authorSection, { backgroundColor: theme.backgroundDefault }]}>
          <TouchableOpacity style={styles.authorInfo} onPress={() => router.push(`/profile?id=${post.user.id}`)}>
            <ExpoImage
              source={{ uri: post.user.avatar_url }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.authorDetails}>
              <ThemedText variant="body" color={theme.textPrimary}>
                {post.user.username}
              </ThemedText>
              <ThemedText variant="caption" color={theme.textMuted}>
                {new Date(post.created_at).toLocaleString('zh-CN')}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* 帖子内容 */}
        <View style={[styles.contentSection, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText variant="body" color={theme.textPrimary} style={styles.content}>
            {post.content}
          </ThemedText>
          
          {/* 翻译按钮 */}
          <TouchableOpacity style={styles.translateButton} onPress={handleTranslate} disabled={isTranslating}>
            <FontAwesome6 name="language" size={14} color={theme.primary} />
            <ThemedText variant="caption" color={theme.primary} style={{ marginLeft: 4 }}>
              {isTranslating ? '翻译中...' : '翻译'}
            </ThemedText>
          </TouchableOpacity>
          
          {/* 翻译结果 */}
          {translatedContent && (
            <View style={[styles.translatedSection, { backgroundColor: theme.backgroundTertiary }]}>
              <ThemedText variant="caption" color={theme.textMuted} style={styles.translatedLabel}>
                翻译结果
              </ThemedText>
              <ThemedText variant="body" color={theme.textPrimary} style={styles.translatedContent}>
                {translatedContent}
              </ThemedText>
            </View>
          )}
        </View>

        {/* 媒体内容 */}
        {post.media_urls && post.media_urls.length > 0 && (
          <View style={[styles.mediaSection, { backgroundColor: theme.backgroundDefault }]}>
            {post.media_urls.map((url, index) => (
              <ExpoImage
                key={index}
                source={{ uri: url }}
                style={styles.mediaItem}
                contentFit="cover"
              />
            ))}
          </View>
        )}

        {/* 操作栏 */}
        <View style={[styles.actionSection, { backgroundColor: theme.backgroundDefault }]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <FontAwesome6 
              name={post.is_liked ? "heart" : "heart"} 
              solid={post.is_liked}
              size={20} 
              color={post.is_liked ? theme.error : theme.textMuted} 
            />
            <ThemedText variant="caption" color={theme.textMuted} style={styles.actionText}>
              {post.likes_count}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="comment" size={20} color={theme.textMuted} />
            <ThemedText variant="caption" color={theme.textMuted} style={styles.actionText}>
              {post.comments_count}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
            <FontAwesome6 
              name={post.is_favorited ? "bookmark" : "bookmark"} 
              solid={post.is_favorited}
              size={20} 
              color={post.is_favorited ? theme.primary : theme.textMuted} 
            />
            <ThemedText variant="caption" color={theme.textMuted} style={styles.actionText}>
              收藏
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <FontAwesome6 name="share-from-square" size={20} color={theme.textMuted} />
            <ThemedText variant="caption" color={theme.textMuted} style={styles.actionText}>
              {post.shares_count}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* 评论区 */}
        <View style={[styles.commentsSection, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText variant="bodyMedium" color={theme.textPrimary} style={styles.commentsTitle}>
            评论 ({comments.length})
          </ThemedText>
          
          {/* 评论列表 */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <ExpoImage
                  source={{ uri: comment.user.avatar_url }}
                  style={styles.commentAvatar}
                  contentFit="cover"
                />
                <View style={styles.commentContent}>
                  <ThemedText variant="caption" color={theme.textPrimary} style={styles.commentAuthor}>
                    {comment.user.username}
                  </ThemedText>
                  <ThemedText variant="body" color={theme.textPrimary} style={styles.commentText}>
                    {comment.content}
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.textMuted} style={styles.commentTime}>
                    {new Date(comment.created_at).toLocaleString('zh-CN')}
                  </ThemedText>
                </View>
              </View>
            ))
          ) : (
            <ThemedText variant="caption" color={theme.textMuted} style={styles.noComments}>
              暂无评论，快来抢沙发吧！
            </ThemedText>
          )}
        </View>
      </ScrollView>

      {/* 评论输入框 */}
      <View style={[styles.commentInputSection, { backgroundColor: theme.backgroundDefault, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.commentInput, { backgroundColor: theme.backgroundTertiary, color: theme.textPrimary }]}
          placeholder="写下你的评论..."
          placeholderTextColor={theme.textMuted}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: commentText.trim() ? theme.primary : theme.backgroundTertiary }]}
          onPress={handleComment}
          disabled={!commentText.trim()}
        >
          <FontAwesome6 name="paper-plane" size={16} color={commentText.trim() ? theme.buttonPrimaryText : theme.textMuted} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
