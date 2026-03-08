#!/usr/bin/env node

/**
 * 预置成就数据脚本
 */

import { getSupabaseClient } from '../storage/database/supabase-client.js';

const client = getSupabaseClient();

const achievements = [
  // 学习类成就
  {
    name: '初学者',
    description: '完成第一天签到',
    icon: '🎯',
    type: 'learning',
    requirement: 1,
    points_reward: 10,
  },
  {
    name: '语言大师',
    description: '学习获得 1000 积分',
    icon: '🌟',
    type: 'learning',
    requirement: 1000,
    points_reward: 100,
  },
  {
    name: '学习达人',
    description: '学习获得 5000 积分',
    icon: '🏆',
    type: 'learning',
    requirement: 5000,
    points_reward: 500,
  },
  {
    name: '连续学习',
    description: '连续签到 7 天',
    icon: '🔥',
    type: 'learning',
    requirement: 7,
    points_reward: 50,
  },
  {
    name: '持之以恒',
    description: '连续签到 30 天',
    icon: '💪',
    type: 'learning',
    requirement: 30,
    points_reward: 200,
  },
  {
    name: '学霸',
    description: '学习获得 10000 积分',
    icon: '🎓',
    type: 'learning',
    requirement: 10000,
    points_reward: 1000,
  },

  // 社交类成就
  {
    name: '社交新星',
    description: '发布第一条动态',
    icon: '✨',
    type: 'social',
    requirement: 1,
    points_reward: 10,
  },
  {
    name: '活跃用户',
    description: '发布 10 条动态',
    icon: '📝',
    type: 'social',
    requirement: 10,
    points_reward: 50,
  },
  {
    name: '人气之星',
    description: '获得 100 个点赞',
    icon: '❤️',
    type: 'social',
    requirement: 100,
    points_reward: 100,
  },
  {
    name: '好友达人',
    description: '关注 50 个用户',
    icon: '👥',
    type: 'social',
    requirement: 50,
    points_reward: 50,
  },
  {
    name: '受欢迎',
    description: '获得 500 个点赞',
    icon: '💖',
    type: 'social',
    requirement: 500,
    points_reward: 500,
  },

  // 活动类成就
  {
    name: '话题王',
    description: '发表 50 条评论',
    icon: '💬',
    type: 'activity',
    requirement: 50,
    points_reward: 100,
  },
  {
    name: '聊天狂人',
    description: '发送 100 条消息',
    icon: '💭',
    type: 'activity',
    requirement: 100,
    points_reward: 50,
  },
  {
    name: '社区贡献者',
    description: '发表 200 条评论',
    icon: '🌏',
    type: 'activity',
    requirement: 200,
    points_reward: 200,
  },
  {
    name: '社交达人',
    description: '发送 500 条消息',
    icon: '🎉',
    type: 'activity',
    requirement: 500,
    points_reward: 200,
  },
];

async function seedAchievements() {
  console.log('开始预置成就数据...');

  try {
    // 检查是否已有数据
    const { data: existing } = await client.from('achievements').select('id').limit(1);

    if (existing && existing.length > 0) {
      console.log('成就数据已存在，跳过预置');
      return;
    }

    // 插入成就
    const { data, error } = await client.from('achievements').insert(achievements).select();

    if (error) {
      console.error('插入成就失败:', error);
      throw error;
    }

    console.log(`✅ 成功预置 ${data?.length || 0} 个成就！`);
  } catch (error) {
    console.error('预置成就失败:', error);
    throw error;
  }
}

// 运行
seedAchievements()
  .then(() => {
    console.log('✨ 完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 错误:', error);
    process.exit(1);
  });
