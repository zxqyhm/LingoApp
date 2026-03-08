import express from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();

// 获取用户的会话列表
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = getSupabaseClient();

    // 获取用户参与的所有会话（作为 user1 或 user2）
    const { data: conversations, error } = await client
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('获取会话列表错误:', error);
      return res.status(500).json({ error: '获取会话列表失败' });
    }

    // 获取每个会话的另一个用户的信息
    const conversationsWithUsers = await Promise.all(
      (conversations || []).map(async (conv: any) => {
        const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;
        const { data: user } = await client
          .from('users')
          .select('id, username, avatar_url, native_language')
          .eq('id', otherUserId)
          .single();

        return {
          ...conv,
          otherUser: user,
        };
      })
    );

    res.json({
      success: true,
      conversations: conversationsWithUsers,
    });
  } catch (error) {
    console.error('获取会话列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建或获取会话
router.post('/getOrCreate', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    if (user1Id === user2Id) {
      return res.status(400).json({ error: '不能与自己创建会话' });
    }

    const client = getSupabaseClient();

    // 确保较小的 ID 作为 user1Id
    const [smallerId, largerId] = [user1Id, user2Id].sort();

    // 检查会话是否已存在
    const { data: existingConversation } = await client
      .from('conversations')
      .select('*')
      .eq('user1_id', smallerId)
      .eq('user2_id', largerId)
      .single();

    if (existingConversation) {
      res.json({
        success: true,
        conversation: existingConversation,
      });
      return;
    }

    // 创建新会话
    const { data: conversation, error } = await client
      .from('conversations')
      .insert({
        user1_id: smallerId,
        user2_id: largerId,
      })
      .select()
      .single();

    if (error) {
      console.error('创建会话失败:', error);
      return res.status(500).json({ error: '创建会话失败' });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error('创建会话错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除会话
router.delete('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    const client = getSupabaseClient();

    // 检查用户是否参与该会话
    const { data: conversation } = await client
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (!conversation) {
      return res.status(404).json({ error: '会话不存在' });
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      return res.status(403).json({ error: '无权删除此会话' });
    }

    await client
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    res.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除会话错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
