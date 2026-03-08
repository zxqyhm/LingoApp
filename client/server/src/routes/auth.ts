import express from 'express';
import axios from 'axios';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { insertUserSchema } from '@/storage/database/shared/schema';

const router = express.Router();

/**
 * POST /api/v1/auth/google
 * 验证 Google ID Token 并登录
 *
 * Body:
 *   idToken: string - Google 返回的 ID Token
 *
 * Returns:
 *   {
 *     success: boolean,
 *     user: User
 *   }
 */
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: '缺少 ID Token' });
    }

    // 验证 ID Token（使用 Google tokeninfo 端点）
    const googleResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const googleData = googleResponse.data;

    // 验证 Token 是否有效
    if (!googleData.sub || !googleData.email) {
      return res.status(401).json({ error: '无效的 Google ID Token' });
    }

    const client = getSupabaseClient();

    // 检查用户是否已存在
    const { data: existingUser } = await client
      .from('users')
      .select('*')
      .eq('provider', 'google')
      .eq('provider_id', googleData.sub)
      .single();

    if (existingUser) {
      // 用户已存在，返回用户信息
      return res.json({
        success: true,
        user: existingUser,
      });
    }

    // 创建新用户
    const newUser = {
      provider: 'google',
      provider_id: googleData.sub,
      username: googleData.name || googleData.email.split('@')[0],
      email: googleData.email,
      avatar_url: googleData.picture,
      bio: '',
      native_language: '',
      learning_languages: [],
    };

    const { data: createdUser, error } = await client
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.error('创建用户失败:', error);
      return res.status(500).json({ error: '创建用户失败' });
    }

    res.json({
      success: true,
      user: createdUser,
    });
  } catch (error: any) {
    console.error('Google 登录错误:', error);
    if (error.response?.status === 400) {
      return res.status(401).json({ error: '无效的 Google ID Token' });
    }
    res.status(500).json({ error: '服务器错误' });
  }
});

// 用户登录/注册（支持微信、谷歌、苹果）- 兼容旧版，保留用于测试
router.post('/login', async (req, res) => {
  try {
    const { provider, providerId, username, email, avatarUrl } = req.body;

    // 验证参数
    if (!provider || !providerId || !username) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const client = getSupabaseClient();

    // 检查用户是否已存在
    const { data: existingUser } = await client
      .from('users')
      .select('*')
      .eq('provider', provider)
      .eq('provider_id', providerId)
      .single();

    if (existingUser) {
      // 用户已存在，返回用户信息
      return res.json({
        success: true,
        user: existingUser,
      });
    }

    // 创建新用户
    const newUser = {
      provider,
      provider_id: providerId,
      username,
      email,
      avatar_url: avatarUrl,
      bio: '',
      native_language: '',
      learning_languages: [],
    };

    const { data: createdUser, error } = await client
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.error('创建用户失败:', error);
      return res.status(500).json({ error: '创建用户失败' });
    }

    res.json({
      success: true,
      user: createdUser,
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户信息
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = getSupabaseClient();

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新用户信息
router.put('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, bio, nativeLanguage, learningLanguages, avatarUrl } = req.body;

    const client = getSupabaseClient();

    const updateData: any = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (nativeLanguage !== undefined) updateData.native_language = nativeLanguage;
    if (learningLanguages !== undefined) updateData.learning_languages = learningLanguages;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    updateData.updated_at = new Date().toISOString();

    const { data: user, error } = await client
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
