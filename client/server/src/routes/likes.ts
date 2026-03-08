import express from 'express';
import { sql } from 'drizzle-orm';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();

// 点赞/取消点赞帖子
router.post('/toggle', async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const client = getSupabaseClient();

    // 检查是否已经点赞
    const { data: existingLike } = await client
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      // 取消点赞
      await client
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      // 更新帖子的点赞数
      await client
        .from('posts')
        .update({
          likes_count: sql`GREATEST(likes_count - 1, 0)`
        })
        .eq('id', postId);

      res.json({
        success: true,
        liked: false,
      });
    } else {
      // 点赞
      await client
        .from('likes')
        .insert({
          user_id: userId,
          post_id: postId,
        });

      // 更新帖子的点赞数
      await client
        .from('posts')
        .update({ likes_count: sql`likes_count + 1` })
        .eq('id', postId);

      res.json({
        success: true,
        liked: true,
      });
    }
  } catch (error) {
    console.error('点赞操作错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 检查用户是否点赞了帖子
router.get('/check', async (req, res) => {
  try {
    const { userId, postId } = req.query;

    if (!userId || !postId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const client = getSupabaseClient();

    const { data: like } = await client
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    res.json({
      success: true,
      liked: !!like,
    });
  } catch (error) {
    console.error('检查点赞状态错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取帖子的点赞列表
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const client = getSupabaseClient();

    const { data: likes, error } = await client
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取点赞列表错误:', error);
      return res.status(500).json({ error: '获取点赞列表失败' });
    }

    // 获取点赞用户信息
    const userIds = likes.map((like: any) => like.user_id);
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar_url')
      .in('id', userIds);

    // 合并用户信息
    const likesWithUsers = likes.map((like: any) => {
      const user = users?.find((u: any) => u.id === like.user_id);
      return {
        ...like,
        user,
      };
    });

    res.json({
      success: true,
      likes: likesWithUsers,
    });
  } catch (error) {
    console.error('获取点赞列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
