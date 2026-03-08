import express from 'express';
import { sql } from 'drizzle-orm';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();

// 获取帖子的评论列表
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const client = getSupabaseClient();

    const { data: comments, error } = await client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取评论列表错误:', error);
      return res.status(500).json({ error: '获取评论列表失败' });
    }

    // 获取评论用户信息
    const userIds = comments.map((comment: any) => comment.user_id);
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar_url')
      .in('id', userIds);

    // 合并用户信息
    const commentsWithUsers = comments.map((comment: any) => {
      const user = users?.find((u: any) => u.id === comment.user_id);
      return {
        ...comment,
        user,
      };
    });

    res.json({
      success: true,
      comments: commentsWithUsers,
    });
  } catch (error) {
    console.error('获取评论列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建评论
router.post('/', async (req, res) => {
  try {
    const { postId, userId, content, parentId } = req.body;

    if (!postId || !userId || !content) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const client = getSupabaseClient();

    // 创建评论
    const { data: comment, error: commentError } = await client
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        parent_id: parentId,
      })
      .select()
      .single();

    if (commentError) {
      console.error('创建评论失败:', commentError);
      return res.status(500).json({ error: '创建评论失败' });
    }

    // 更新帖子的评论数
    await client
      .from('posts')
      .update({ comments_count: sql`comments_count + 1` })
      .eq('id', postId);

    // 获取评论用户信息
    const { data: user } = await client
      .from('users')
      .select('id, username, avatar_url')
      .eq('id', userId)
      .single();

    res.json({
      success: true,
      comment: {
        ...comment,
        user,
      },
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除评论
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const client = getSupabaseClient();

    // 检查是否是评论作者
    const { data: comment } = await client
      .from('comments')
      .select('user_id, post_id')
      .eq('id', commentId)
      .single();

    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({ error: '无权删除此评论' });
    }

    // 删除评论
    await client
      .from('comments')
      .delete()
      .eq('id', commentId);

    // 更新帖子的评论数
    await client
      .from('posts')
      .update({
        comments_count: sql`GREATEST(comments_count - 1, 0)`
      })
      .eq('id', comment.post_id);

    res.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
