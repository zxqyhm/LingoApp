import { getSupabaseClient } from './storage/database/supabase-client';

// 预置用户数据（使用 Unsplash 真实头像）
const mockUsers = [
  {
    provider: 'wechat',
    provider_id: 'wechat_user_1',
    username: '小明',
    email: 'xiaoming@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    bio: '正在学习英语，希望能交到外国朋友 🌍',
    native_language: '中文',
    learning_languages: ['英语'],
  },
  {
    provider: 'wechat',
    provider_id: 'wechat_user_2',
    username: '李华',
    email: 'lihua@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: '日语初学者，喜欢动漫 🎌',
    native_language: '中文',
    learning_languages: ['日语'],
  },
  {
    provider: 'phone',
    provider_id: 'phone_user_1',
    username: '张伟',
    email: 'zhangwei@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
    bio: '法语爱好者，喜欢旅行 ✈️',
    native_language: '中文',
    learning_languages: ['法语'],
  },
];

// 预置帖子内容
const mockPosts = [
  {
    user_id: 1,
    content: '今天学到了一个新的英语短语 "break a leg"，原来不是"打断腿"的意思，而是"祝你好运"！🎉',
    media_urls: [],
    media_type: null,
    language_tag: 'zh-CN',
  },
  {
    user_id: 2,
    content: '谁能帮我看看这段日语翻译对不对？"こんにちは、元気ですか？" 我说对了吗？🇯🇵',
    media_urls: [],
    media_type: null,
    language_tag: 'zh-CN',
  },
  {
    user_id: 3,
    content: '分享一个学习法语的好方法：每天看一部法语电影，不看字幕，试着听懂对话 🎬',
    media_urls: ['https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop'],
    media_type: 'image',
    language_tag: 'zh-CN',
  },
  {
    user_id: 1,
    content: '有没有外国朋友想学中文的？我可以教你中文，你教我英语！🤝',
    media_urls: [],
    media_type: null,
    language_tag: 'zh-CN',
  },
  {
    user_id: 2,
    content: '终于考过了 N3！继续努力向 N2 冲刺 💪',
    media_urls: [],
    media_type: null,
    language_tag: 'zh-CN',
  },
  {
    user_id: 3,
    content: '法语发音真的好难啊，特别是小舌音 😅 有没有什么技巧？',
    media_urls: [],
    media_type: null,
    language_tag: 'zh-CN',
  },
];

// 预置评论
const mockComments = [
  { post_id: 1, user_id: 2, content: '哈哈，我也刚学到这个！很有趣的短语 😄' },
  { post_id: 1, user_id: 3, content: '在英语国家常用的祝福语，特别是在表演前' },
  { post_id: 2, user_id: 1, content: '翻译是对的！"こんにちは"是你好，"元気ですか"是身体好吗' },
  { post_id: 3, user_id: 1, content: '这个方法不错，推荐大家试试！' },
  { post_id: 3, user_id: 2, content: '我也要试试这个方法 🎬' },
  { post_id: 4, user_id: 2, content: '我可以教你日语！🇯🇵' },
  { post_id: 4, user_id: 3, content: '我可以教你法语！🇫🇷' },
  { post_id: 5, user_id: 1, content: '恭喜恭喜！🎉 继续加油！' },
];

// 预置点赞
const mockLikes = [
  { post_id: 1, user_id: 2 },
  { post_id: 1, user_id: 3 },
  { post_id: 2, user_id: 1 },
  { post_id: 2, user_id: 3 },
  { post_id: 3, user_id: 1 },
  { post_id: 3, user_id: 2 },
  { post_id: 4, user_id: 2 },
  { post_id: 4, user_id: 3 },
];

// 预置关注
const mockFollows = [
  { follower_id: 1, following_id: 2 },
  { follower_id: 1, following_id: 3 },
  { follower_id: 2, following_id: 1 },
  { follower_id: 2, following_id: 3 },
  { follower_id: 3, following_id: 1 },
  { follower_id: 3, following_id: 2 },
];

export async function seedDatabase() {
  console.log('开始预置数据库数据...');

  const client = getSupabaseClient();

  try {
    // 检查是否已有数据
    const { data: existingUsers } = await client.from('users').select('id').limit(1);
    if (existingUsers && existingUsers.length > 0) {
      console.log('数据库已有数据，跳过预置');
      return;
    }

    // 插入用户
    console.log('插入用户数据...');
    const { data: users } = await client.from('users').insert(mockUsers).select();
    console.log(`✅ 插入 ${users?.length || 0} 个用户`);

    // 插入帖子
    console.log('插入帖子数据...');
    const { data: posts } = await client.from('posts').insert(mockPosts).select();
    console.log(`✅ 插入 ${posts?.length || 0} 个帖子`);

    // 插入评论
    console.log('插入评论数据...');
    const { data: comments } = await client.from('comments').insert(mockComments).select();
    console.log(`✅ 插入 ${comments?.length || 0} 个评论`);

    // 插入点赞
    console.log('插入点赞数据...');
    const { data: likes } = await client.from('likes').insert(mockLikes).select();
    console.log(`✅ 插入 ${likes?.length || 0} 个点赞`);

    // 插入关注
    console.log('插入关注数据...');
    const { data: follows } = await client.from('follows').insert(mockFollows).select();
    console.log(`✅ 插入 ${follows?.length || 0} 个关注`);

    console.log('✅ 数据库预置完成！');
  } catch (error) {
    console.error('数据库预置失败:', error);
    throw error;
  }
}
