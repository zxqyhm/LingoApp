import express from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { groups, groupMembers, groupMessages, users } from '@/storage/database/shared/schema';

const router = express.Router();

/**
 * POST /api/v1/groups
 * 创建群组
 *
 * Body:
 *   name: string - 群名称
 *   avatarUrl?: string - 群头像
 *   description?: string - 群描述
 *   ownerId: string - 群主 ID
 *   allowScreenshot?: boolean - 是否允许截屏（默认 true）
 *   allowScreenRecording?: boolean - 是否允许录屏（默认 true）
 *   isPublic?: boolean - 是否公开群（默认 true）
 *
 * Returns:
 *   {
 *     success: boolean,
 *     group: Group
 *   }
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      avatarUrl,
      description,
      ownerId,
      allowScreenshot = true,
      allowScreenRecording = true,
      isPublic = true,
    } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ error: '群名称和群主 ID 不能为空' });
    }

    const client = getSupabaseClient();

    // 创建群组
    const { data: newGroup, error: groupError } = await client
      .from('groups')
      .insert({
        name,
        avatar_url: avatarUrl,
        description,
        owner_id: ownerId,
        allow_screenshot: allowScreenshot,
        allow_screen_recording: allowScreenRecording,
        is_public: isPublic,
        member_count: 1,
      })
      .select()
      .single();

    if (groupError) {
      console.error('创建群组失败:', groupError);
      return res.status(500).json({ error: '创建群组失败' });
    }

    // 添加群主为成员
    const { error: memberError } = await client.from('group_members').insert({
      group_id: newGroup.id,
      user_id: ownerId,
      role: 'owner',
      nickname: '群主',
    });

    if (memberError) {
      console.error('添加群主失败:', memberError);
    }

    res.json({
      success: true,
      group: newGroup,
    });
  } catch (error) {
    console.error('创建群组错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/v1/groups
 * 获取群组列表
 *
 * Query:
 *   userId?: string - 用户 ID（获取用户加入的群组）
 *   isPublic?: boolean - 是否公开群（默认获取所有）
 *   page?: number - 页码
 *   limit?: number - 每页数量
 *
 * Returns:
 *   {
 *     success: boolean,
 *     groups: Group[],
 *     total: number
 *   }
 */
router.get('/', async (req, res) => {
  try {
    const { userId, isPublic, page = 1, limit = 20 } = req.query;

    const client = getSupabaseClient();
    const limitNum = parseInt(limit as string, 10);
    const offset = (parseInt(page as string, 10) - 1) * limitNum;

    let query = client.from('groups').select('*').order('created_at', { ascending: false });

    if (isPublic !== undefined) {
      query = query.eq('is_public', isPublic === 'true');
    }

    if (userId) {
      // 获取用户加入的群组
      const { data: memberGroups } = await client
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);

      if (memberGroups) {
        const groupIds = memberGroups.map((m: any) => m.group_id);
        query = query.in('id', groupIds);
      }
    }

    const { data: groups, error, count } = await query.range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取群组列表错误:', error);
      return res.status(500).json({ error: '获取群组列表失败' });
    }

    // 获取每个群组的群主信息
    const groupIds = groups?.map((g: any) => g.owner_id) || [];
    const { data: owners } = await client
      .from('users')
      .select('id, username, avatar_url')
      .in('id', groupIds);

    const groupsWithOwners = groups?.map((group: any) => ({
      ...group,
      owner: owners?.find((u: any) => u.id === group.owner_id),
    }));

    res.json({
      success: true,
      groups: groupsWithOwners || [],
      total: count || 0,
    });
  } catch (error) {
    console.error('获取群组列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/v1/groups/:groupId
 * 获取群组详情
 *
 * Returns:
 *   {
 *     success: boolean,
 *     group: Group,
 *     members: GroupMember[],
 *     memberCount: number
 *   }
 */
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    const client = getSupabaseClient();

    // 获取群组信息
    const { data: group, error: groupError } = await client
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ error: '群组不存在' });
    }

    // 获取群主信息
    const { data: owner } = await client
      .from('users')
      .select('id, username, avatar_url')
      .eq('id', group.owner_id)
      .single();

    // 获取群成员
    const { data: members } = await client
      .from('group_members')
      .select('*, users(*)')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    res.json({
      success: true,
      group: { ...group, owner },
      members: members || [],
      memberCount: members?.length || 0,
    });
  } catch (error) {
    console.error('获取群组详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/v1/groups/:groupId/join
 * 加入群组
 *
 * Body:
 *   userId: string - 用户 ID
 *   nickname?: string - 群昵称
 *
 * Returns:
 *   {
 *     success: boolean,
 *     message: string
 *   }
 */
router.post('/:groupId/join', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, nickname } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '用户 ID 不能为空' });
    }

    const client = getSupabaseClient();

    // 检查是否已加入
    const { data: existingMember } = await client
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      return res.status(400).json({ error: '已经是群成员' });
    }

    // 检查群组成员数量
    const { data: group } = await client
      .from('groups')
      .select('member_count, max_members')
      .eq('id', groupId)
      .single();

    if (group && group.member_count >= group.max_members) {
      return res.status(400).json({ error: '群组已满' });
    }

    // 加入群组
    const { error: memberError } = await client.from('group_members').insert({
      group_id: groupId,
      user_id: userId,
      role: 'member',
      nickname: nickname || '',
    });

    if (memberError) {
      console.error('加入群组失败:', memberError);
      return res.status(500).json({ error: '加入群组失败' });
    }

    // 更新群组成员数
    await client
      .from('groups')
      .update({ member_count: (group?.member_count || 0) + 1 })
      .eq('id', groupId);

    res.json({
      success: true,
      message: '加入群组成功',
    });
  } catch (error) {
    console.error('加入群组错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/v1/groups/:groupId/leave
 * 退出群组
 *
 * Body:
 *   userId: string - 用户 ID
 *
 * Returns:
 *   {
 *     success: boolean,
 *     message: string
 *   }
 */
router.post('/:groupId/leave', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '用户 ID 不能为空' });
    }

    const client = getSupabaseClient();

    // 检查是否是群主
    const { data: group } = await client
      .from('groups')
      .select('owner_id')
      .eq('id', groupId)
      .single();

    if (group && group.owner_id === userId) {
      return res.status(400).json({ error: '群主不能退出群组' });
    }

    // 退出群组
    const { error } = await client
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) {
      console.error('退出群组失败:', error);
      return res.status(500).json({ error: '退出群组失败' });
    }

    // 更新群组成员数
    await client.rpc('decrement_group_member_count', { group_id: groupId });

    res.json({
      success: true,
      message: '退出群组成功',
    });
  } catch (error) {
    console.error('退出群组错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/v1/groups/:groupId/settings
 * 更新群组设置（仅群主）
 *
 * Body:
 *   userId: string - 用户 ID
 *   allowScreenshot?: boolean - 是否允许截屏
 *   allowScreenRecording?: boolean - 是否允许录屏
 *   name?: string - 群名称
 *   description?: string - 群描述
 *
 * Returns:
 *   {
 *     success: boolean,
 *     group: Group
 *   }
 */
router.post('/:groupId/settings', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, allowScreenshot, allowScreenRecording, name, description } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '用户 ID 不能为空' });
    }

    const client = getSupabaseClient();

    // 检查是否是群主
    const { data: group } = await client
      .from('groups')
      .select('owner_id')
      .eq('id', groupId)
      .single();

    if (!group || group.owner_id !== userId) {
      return res.status(403).json({ error: '只有群主可以修改群组设置' });
    }

    // 更新设置
    const updateData: any = {};
    if (allowScreenshot !== undefined) updateData.allow_screenshot = allowScreenshot;
    if (allowScreenRecording !== undefined) updateData.allow_screen_recording = allowScreenRecording;
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const { data: updatedGroup, error } = await client
      .from('groups')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', groupId)
      .select()
      .single();

    if (error) {
      console.error('更新群组设置失败:', error);
      return res.status(500).json({ error: '更新群组设置失败' });
    }

    res.json({
      success: true,
      group: updatedGroup,
    });
  } catch (error) {
    console.error('更新群组设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/v1/groups/:groupId/messages
 * 获取群组消息
 *
 * Query:
 *   page?: number - 页码
 *   limit?: number - 每页数量
 *
 * Returns:
 *   {
 *     success: boolean,
 *     messages: GroupMessage[]
 *   }
 */
router.get('/:groupId/messages', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const client = getSupabaseClient();
    const limitNum = parseInt(limit as string, 10);
    const offset = (parseInt(page as string, 10) - 1) * limitNum;

    const { data: messages, error } = await client
      .from('group_messages')
      .select('*, users(*)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取群消息错误:', error);
      return res.status(500).json({ error: '获取群消息失败' });
    }

    res.json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error('获取群消息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/v1/groups/:groupId/messages
 * 发送群消息
 *
 * Body:
 *   senderId: string - 发送者 ID
 *   content: string - 消息内容
 *   type?: string - 消息类型（text, image, voice, video）
 *   mediaUrl?: string - 媒体 URL
 *   replyToId?: string - 回复的消息 ID
 *
 * Returns:
 *   {
 *     success: boolean,
 *     message: GroupMessage
 *   }
 */
router.post('/:groupId/messages', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { senderId, content, type = 'text', mediaUrl, replyToId } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({ error: '发送者和消息内容不能为空' });
    }

    const client = getSupabaseClient();

    // 检查是否是群成员
    const { data: member } = await client
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', senderId)
      .single();

    if (!member) {
      return res.status(403).json({ error: '你不是群成员' });
    }

    // 检查是否被禁言
    if (member.muted_until && new Date(member.muted_until) > new Date()) {
      return res.status(403).json({ error: '你已被禁言' });
    }

    // 发送消息
    const { data: message, error } = await client
      .from('group_messages')
      .insert({
        group_id: groupId,
        sender_id: senderId,
        content,
        type,
        media_url: mediaUrl,
        reply_to_id: replyToId,
      })
      .select('*, users(*)')
      .single();

    if (error) {
      console.error('发送群消息失败:', error);
      return res.status(500).json({ error: '发送群消息失败' });
    }

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('发送群消息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
