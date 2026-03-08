import express from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();

// 获取会话的消息列表
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const client = getSupabaseClient();

    const { data: messages, error } = await client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取消息列表错误:', error);
      return res.status(500).json({ error: '获取消息列表失败' });
    }

    // 获取发送者用户信息
    const senderIds = messages.map((msg: any) => msg.sender_id);
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar_url')
      .in('id', senderIds);

    // 合并用户信息
    const messagesWithUsers = messages.map((msg: any) => {
      const user = users?.find((u: any) => u.id === msg.sender_id);
      return {
        ...msg,
        sender: user,
      };
    });

    res.json({
      success: true,
      messages: messagesWithUsers.reverse(), // 按时间正序返回
      pagination: {
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('获取消息列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 发送消息
router.post('/', async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    if (!conversationId || !senderId || !content) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const client = getSupabaseClient();

    // 创建消息
    const { data: message, error: messageError } = await client
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        is_read: false,
      })
      .select()
      .single();

    if (messageError) {
      console.error('创建消息失败:', messageError);
      return res.status(500).json({ error: '创建消息失败' });
    }

    // 更新会话的最后一条消息
    await client
      .from('conversations')
      .update({
        last_message: content,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    // 获取发送者用户信息
    const { data: user } = await client
      .from('users')
      .select('id, username, avatar_url')
      .eq('id', senderId)
      .single();

    res.json({
      success: true,
      message: {
        ...message,
        sender: user,
      },
    });
  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 标记消息为已读
router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const client = getSupabaseClient();

    // 获取消息信息
    const { data: message } = await client
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (!message) {
      return res.status(404).json({ error: '消息不存在' });
    }

    // 检查消息是否属于当前用户的会话
    const { data: conversation } = await client
      .from('conversations')
      .select('*')
      .eq('id', message.conversation_id)
      .single();

    if (!conversation || (conversation.user1_id !== userId && conversation.user2_id !== userId)) {
      return res.status(403).json({ error: '无权标记此消息' });
    }

    // 标记为已读
    const { data: updatedMessage, error } = await client
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('标记消息失败:', error);
      return res.status(500).json({ error: '标记消息失败' });
    }

    res.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error('标记消息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取未读消息数
router.get('/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = getSupabaseClient();

    // 获取用户参与的所有会话
    const { data: conversations } = await client
      .from('conversations')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (!conversations || conversations.length === 0) {
      return res.json({
        success: true,
        unreadCount: 0,
      });
    }

    const conversationIds = conversations.map((c: any) => c.id);

    // 获取这些会话中的未读消息（排除自己发送的消息）
    const { count, error } = await client
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .eq('is_read', false)
      .neq('sender_id', userId);

    if (error) {
      console.error('获取未读消息数错误:', error);
      return res.status(500).json({ error: '获取未读消息数失败' });
    }

    res.json({
      success: true,
      unreadCount: count || 0,
    });
  } catch (error) {
    console.error('获取未读消息数错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
