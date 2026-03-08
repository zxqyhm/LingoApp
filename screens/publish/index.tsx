import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';
import { createFormDataFile } from '@/utils';

export default function PublishScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 状态
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // 选择图片
  const pickImage = async () => {
    try {
      // 请求权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限错误', '需要相册权限才能选择图片');
        return;
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        selectionLimit: 9 - selectedImages.length, // 最多 9 张
      });

      if (!result.canceled && result.assets) {
        const newUris = result.assets.map(asset => asset.uri);
        setSelectedImages([...selectedImages, ...newUris]);
      }
    } catch (error) {
      console.error('选择图片错误:', error);
      Alert.alert('错误', '选择图片失败');
    }
  };

  // 移除图片
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  // 上传图片
  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = selectedImages.map(async (uri) => {
      const formData = new FormData();
      const file = await createFormDataFile(uri, `image_${Date.now()}.jpg`, 'image/jpeg');
      formData.append('file', file as any);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/upload/image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error('图片上传失败');
      }
      return data.url;
    });

    return Promise.all(uploadPromises);
  };

  // 发布内容
  const handlePublish = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      Alert.alert('提示', '请输入内容或选择图片');
      return;
    }

    try {
      setIsPublishing(true);

      // 上传图片
      let uploadedUrls: string[] = [];
      if (selectedImages.length > 0) {
        setIsUploading(true);
        uploadedUrls = await uploadImages();
        setIsUploading(false);
      }

      // 发布帖子
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/posts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1, // TODO: 从登录状态获取真实用户 ID
            content: content,
            mediaUrls: uploadedUrls,
            mediaType: uploadedUrls.length > 0 ? 'image' : null,
            languageTag: 'zh-CN',
          }),
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || '发布失败');
      }

      Alert.alert('成功', '内容发布成功', [
        {
          text: '确定',
          onPress: () => {
            // 重置表单
            setContent('');
            setSelectedImages([]);
          },
        },
      ]);
    } catch (error: any) {
      console.error('发布错误:', error);
      Alert.alert('错误', error.message || '发布失败，请重试');
    } finally {
      setIsUploading(false);
      setIsPublishing(false);
    }
  };

  return (
    <Screen
      backgroundColor={theme.backgroundRoot}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* 顶部标题栏 */}
          <View style={styles.header}>
            <View style={{ width: 60 }} />
            <ThemedText variant="h4" color={theme.textPrimary}>
              发布内容
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.publishButton,
                (!content.trim() && selectedImages.length === 0) && styles.publishButtonDisabled,
              ]}
              onPress={handlePublish}
              disabled={isPublishing || (!content.trim() && selectedImages.length === 0)}
            >
              {isPublishing ? (
                <ActivityIndicator size="small" color={theme.buttonPrimaryText} />
              ) : (
                <ThemedText
                  variant="smallMedium"
                  color={theme.buttonPrimaryText}
                >
                  发布
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* 内容输入框 */}
            <TextInput
              style={[
                styles.textInput,
                { color: theme.textPrimary, backgroundColor: theme.backgroundDefault },
              ]}
              placeholder="分享你的语言学习心得..."
              placeholderTextColor={theme.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
            />

            {/* 图片预览 */}
            {selectedImages.length > 0 && (
              <View style={styles.imageGrid}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                    >
                      <ThemedText style={styles.removeButtonText}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedImages.length < 9 && !isUploading && (
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    <ThemedText style={styles.addImageText}>+</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 添加图片按钮（如果没有图片） */}
            {selectedImages.length === 0 && !isUploading && (
              <TouchableOpacity style={styles.addImageButtonLarge} onPress={pickImage}>
                <ThemedText variant="h2" color={theme.textMuted}>+</ThemedText>
                <ThemedText
                  variant="caption"
                  color={theme.textMuted}
                  style={{ marginTop: 8 }}
                >
                  添加图片
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* 上传提示 */}
            {isUploading && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <ThemedText
                  variant="caption"
                  color={theme.textMuted}
                  style={{ marginLeft: 8 }}
                >
                  正在上传图片...
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
