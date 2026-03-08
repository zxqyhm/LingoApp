import express from 'express';
import { sql } from 'drizzle-orm';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();

// 关注/取消关注用户
router.post('/toggle', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ error: '不能关注自己' });
    }

    const client = getSupabaseClient();

    // 检查是否已经关注
    const { data: existingFollow } = await client
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (existingFollow) {
      // 取消关注
      await client
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      // 更新粉丝数和关注数
      await client
        .from('users')
        .update({
          followers_count: sql`GREATEST(followers_count - 1, 0)`
        })
        .eq('id', followingId);

      await client
        .from('users')
        .update({
          following_count: sql`GREATEST(following_count - 1, 0)`
        })
        .eq('id', followerId);

      res.json({
        success: true,
        following: false,
      });
    } else {
      // 关注
      await client
        .from('follows')
        .insert({
          follower_id: followerId,
          following_id: followingId,
        });

      // 更新粉丝数和关注数
      await client
        .from('users')
        .update({ followers_count: sql`followers_count + 1` })
        .eq('id', followingId);

      await client
        .from('users')
        .update({ following_count: sql`following_count + 1` })
        .eq('id', followerId);

      res.json({
        success: true,
        following: true,
      });
    }
  } catch (error) {
    console.error('关注操作错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 检查用户是否关注了另一个用户
router.get('/check', async (req, res) => {
  try {
    const { followerId, followingId } = req.query;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const client = getSupabaseClient();

    const { data: follow } = await client
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    res.json({
      success: true,
      following: !!follow,
    });
  } catch (error) {
    console.error('检查关注状态错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户的粉丝列表
router.get('/followers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = getSupabaseClient();

    const { data: follows, error } = await client
      .from('follows')
      .select('*')
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取粉丝列表错误:', error);
      return res.status(500).json({ error: '获取粉丝列表失败' });
    }

    // 获取粉丝用户信息
    const followerIds = follows.map((follow: any) => follow.follower_id);
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar_url, native_language, followers_count')
      .in('id', followerIds);

    res.json({
      success: true,
      followers: users || [],
    });
  } catch (error) {
    console.error('获取粉丝列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户的关注列表
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = getSupabaseClient();

    const { data: follows, error } = await client
      .from('follows')
      .select('*')
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取关注列表错误:', error);
      return res.status(500).json({ error: '获取关注列表失败' });
    }

    // 获取被关注用户信息
    const followingIds = follows.map((follow: any) => follow.following_id);
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar_url, native_language, followers_count')
      .in('id', followingIds);

    res.json({
      success: true,
      following: users || [],
    });
  } catch (error) {
    console.error('获取关注列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
