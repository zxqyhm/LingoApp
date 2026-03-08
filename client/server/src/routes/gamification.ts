import express from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();
const client = getSupabaseClient();

/**
 * 每日签到
 * POST /api/v1/gamification/sign-in
 */
router.post('/sign-in', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '缺少 userId 参数' });
    }

    // 获取用户信息
    const { data: user, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastSignInDate = user.last_sign_in_date ? user.last_sign_in_date.split('T')[0] : null;

    // 检查今天是否已经签到
    if (lastSignInDate === today) {
      return res.status(400).json({ error: '今天已经签到过了' });
    }

    // 检查是否连续签到
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    let newStreak = user.daily_streak || 0;
    if (lastSignInDate === yesterdayDate) {
      newStreak += 1; // 连续签到
    } else {
      newStreak = 1; // 重新开始
    }

    // 计算奖励积分
    const basePoints = 10;
    const streakBonus = Math.floor(newStreak / 7) * 5; // 每连续7天额外奖励5分
    const totalPoints = basePoints + streakBonus;

    // 更新用户信息
    const { data: updatedUser, error: updateError } = await client
      .from('users')
      .update({
        points: user.points + totalPoints,
        experience: user.experience + totalPoints,
        daily_streak: newStreak,
        last_sign_in_date: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('签到失败:', updateError);
      return res.status(500).json({ error: '签到失败' });
    }

    // 添加学习记录
    await client.from('learning_records').insert({
      user_id: userId,
      type: 'sign_in',
      points: totalPoints,
    });

    res.json({
      success: true,
      points: totalPoints,
      streak: newStreak,
      streakBonus,
      totalPoints: updatedUser.points,
    });
  } catch (error) {
    console.error('签到失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 添加积分
 * POST /api/v1/gamification/add-points
 */
router.post('/add-points', async (req, res) => {
  try {
    const { userId, points, type, targetId, language, duration } = req.body;

    if (!userId || !points || !type) {
      return res.status(400).json({ error: '缺少必需参数' });
    }

    // 获取用户信息
    const { data: user, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 更新积分和经验
    const newPoints = user.points + points;
    const newExperience = user.experience + points;

    // 计算等级（每100经验值升一级）
    const newLevel = Math.floor(newExperience / 100) + 1;

    // 更新用户
    const { data: updatedUser, error: updateError } = await client
      .from('users')
      .update({
        points: newPoints,
        experience: newExperience,
        level: newLevel,
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('添加积分失败:', updateError);
      return res.status(500).json({ error: '添加积分失败' });
    }

    // 添加学习记录
    await client.from('learning_records').insert({
      user_id: userId,
      type,
      target_id: targetId,
      language,
      duration: duration || 0,
      points,
    });

    res.json({
      success: true,
      points,
      totalPoints: newPoints,
      level: newLevel,
      experience: newExperience,
    });
  } catch (error) {
    console.error('添加积分失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取排行榜
 * GET /api/v1/gamification/leaderboard?type=points|level&limit=20
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'points', limit = 20 } = req.query;

    const orderBy = type === 'level' ? 'level' : 'points';
    const limitNum = parseInt(limit as string);

    const { data: users, error } = await client
      .from('users')
      .select('*')
      .eq('is_bot', false) // 排除机器人
      .order(orderBy, { ascending: false })
      .limit(limitNum);

    if (error) {
      console.error('获取排行榜失败:', error);
      return res.status(500).json({ error: '获取排行榜失败' });
    }

    // 添加排名
    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取用户成就
 * GET /api/v1/gamification/achievements?userId=xxx
 */
router.get('/achievements', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '缺少 userId 参数' });
    }

    // 获取用户已解锁的成就
    const { data: userAchievements, error: uaError } = await client
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId);

    if (uaError) {
      console.error('获取用户成就失败:', uaError);
      return res.status(500).json({ error: '获取用户成就失败' });
    }

    // 获取所有成就
    const { data: allAchievements, error: aError } = await client
      .from('achievements')
      .select('*');

    if (aError) {
      console.error('获取成就列表失败:', aError);
      return res.status(500).json({ error: '获取成就列表失败' });
    }

    // 标记已解锁的成就
    const achievementsWithStatus = allAchievements.map((achievement) => {
      const isUnlocked = userAchievements.some(
        (ua) => ua.achievement_id === achievement.id
      );

      return {
        ...achievement,
        isUnlocked,
        unlockedAt: isUnlocked
          ? userAchievements.find((ua) => ua.achievement_id === achievement.id)?.unlocked_at
          : null,
      };
    });

    res.json({
      success: true,
      achievements: achievementsWithStatus,
      unlockedCount: userAchievements.length,
      totalCount: allAchievements.length,
    });
  } catch (error) {
    console.error('获取成就失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取用户统计数据
 * GET /api/v1/gamification/stats?userId=xxx
 */
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '缺少 userId 参数' });
    }

    // 获取用户信息
    const { data: user, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取学习记录统计
    const { data: learningRecords, error: recordsError } = await client
      .from('learning_records')
      .select('*')
      .eq('user_id', userId);

    if (recordsError) {
      console.error('获取学习记录失败:', recordsError);
      return res.status(500).json({ error: '获取学习记录失败' });
    }

    // 统计各类学习记录
    const stats = {
      totalPoints: user.points || 0,
      level: user.level || 1,
      experience: user.experience || 0,
      dailyStreak: user.daily_streak || 0,
      // 学习记录统计
      chatCount: learningRecords.filter((r) => r.type === 'chat').length,
      postCount: learningRecords.filter((r) => r.type === 'post').length,
      commentCount: learningRecords.filter((r) => r.type === 'comment').length,
      likeCount: learningRecords.filter((r) => r.type === 'like').length,
      followCount: learningRecords.filter((r) => r.type === 'follow').length,
      totalLearningTime: learningRecords.reduce((sum, r) => sum + (r.duration || 0), 0),
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
