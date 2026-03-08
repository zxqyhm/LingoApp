import express from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();

// 获取内容列表（支持分页、按语言标签筛选）
router.get('/', async (req, res) => {
  try {
    const { page = '1', limit = '20', languageTag, userId } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const client = getSupabaseClient();

    let query = client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (languageTag) {
      query = query.eq('language_tag', languageTag);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: posts, error } = await query
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取内容列表错误:', error);
      return res.status(500).json({ error: '获取内容列表失败' });
    }

    // 获取每个帖子的作者信息
    const userIds = posts.map((post: any) => post.user_id);
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar_url, native_language')
      .in('id', userIds);

    // 合并用户信息
    const postsWithUsers = posts.map((post: any) => {
      const user = users?.find((u: any) => u.id === post.user_id);
      return {
        ...post,
        user,
      };
    });

    res.json({
      success: true,
      posts: postsWithUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('获取内容列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个内容详情
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const client = getSupabaseClient();

    const { data: post, error } = await client
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !post) {
      return res.status(404).json({ error: '内容不存在' });
    }

    // 获取作者信息
    const { data: user } = await client
      .from('users')
      .select('id, username, avatar_url, native_language, followers_count')
      .eq('id', post.user_id)
      .single();

    res.json({
      success: true,
      post: {
        ...post,
        user,
      },
    });
  } catch (error) {
    console.error('获取内容详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建内容
router.post('/', async (req, res) => {
  try {
    const { userId, content, mediaUrls, mediaType, languageTag } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }

    const client = getSupabaseClient();

    const newPost = {
      user_id: userId,
      content,
      media_urls: mediaUrls || [],
      media_type: mediaType,
      language_tag: languageTag,
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
    };

    const { data: post, error } = await client
      .from('posts')
      .insert(newPost)
      .select()
      .single();

    if (error) {
      console.error('创建内容失败:', error);
      return res.status(500).json({ error: '创建内容失败' });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('创建内容错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除内容
router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const client = getSupabaseClient();

    // 检查是否是作者
    const { data: post } = await client
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (!post) {
      return res.status(404).json({ error: '内容不存在' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: '无权删除此内容' });
    }

    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('删除内容失败:', error);
      return res.status(500).json({ error: '删除内容失败' });
    }

    res.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除内容错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
