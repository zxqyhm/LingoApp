#!/usr/bin/env node

/**
 * 动态生成脚本
 * 为机器人用户生成朋友圈动态
 */

import { getSupabaseClient } from '../storage/database/supabase-client.js';
import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange, sample, shuffleArray } from './utils/random.js';

// Supabase 客户端
const client = getSupabaseClient();

// 动态内容模板（多语言）
const POST_TEMPLATES = {
  zh: [
    '今天天气真好，适合出门拍照 📸',
    '发现一家超棒的咖啡店 ☕️',
    '健身打卡 💪',
    '周末的快乐时光',
    '新的开始，新的梦想 ✨',
    '分享今天的穿搭',
    '享受美食时光',
    '旅行中 🌍',
    '生活中的小确幸',
    '和朋友的美好时光',
  ],
  en: [
    'Beautiful day for a walk 📸',
    'Found an amazing coffee shop ☕️',
    'Workout done 💪',
    'Weekend vibes',
    'New beginnings, new dreams ✨',
    'Sharing my outfit today',
    'Enjoying delicious food',
    'Traveling 🌍',
    'Simple pleasures of life',
    'Good times with friends',
  ],
  fr: [
    'Belle journée pour une promenade 📸',
    'Trouvé un café incroyable ☕️',
    'Séance terminée 💪',
    'Ambiance du week-end',
    'Nouveaux départs, nouveaux rêves ✨',
    'Partageant ma tenue du jour',
    'Profiter de la délicieuse nourriture',
    'En voyage 🌍',
    'Petits plaisirs de la vie',
    'Bons moments avec des amis',
  ],
  ru: [
    'Прекрасный день для прогулки 📸',
    'Нашел потрясающее кафе ☕️',
    'Тренировка завершена 💪',
    'Настроение выходного дня',
    'Новые начала, новые мечты ✨',
    'Делюсь сегодняшним нарядом',
    'Наслаждаюсь вкусной едой',
    'В путешествии 🌍',
    'Простые радости жизни',
    'Хорошее время с друзьями',
  ],
  es: [
    'Hermoso día para caminar 📸',
    'Encontré un café increíble ☕️',
    'Entrenamiento terminado 💪',
    'Vibra de fin de semana',
    'Nuevos comienzos, nuevos sueños ✨',
    'Compartiendo mi atuendo de hoy',
    'Disfrutando de comida deliciosa',
    'Viajando 🌍',
    'Pequeños placeres de la vida',
    'Buenos momentos con amigos',
  ],
  ar: [
    'يوم جميل للمشي 📸',
    'وجدت مقهى رائع ☕️',
    'انتهت التدريبات 💪',
    'أجواء عطلة نهاية الأسبوع',
    'بدايات جديدة، أحلام جديدة ✨',
    'مشاركة ملابسي اليوم',
    'الاستمتاع بالطعام اللذيذ',
    'في السفر 🌍',
    'ملذات الحياة البسيطة',
    'أوقات جيدة مع الأصدقاء',
  ],
};

// 图片关键词（美女/帅哥/生活）
const IMAGE_KEYWORDS = [
  'beautiful woman fashion portrait',
  'handsome man lifestyle photography',
  'elegant woman street style',
  'stylish man urban fashion',
  'gorgeous woman portrait natural',
  'attractive man photography modern',
  'fashion model portrait',
  'lifestyle photography people',
  'portrait beautiful smile',
  'stylish outfit street style',
  'fitness woman training',
  'handsome man casual style',
  'travel adventure beautiful',
  'coffee shop cozy',
  'healthy food photography',
  'yoga meditation peace',
];

// 美女/帅哥图片 ID（Unsplash）
const FEMALE_IMAGES = [
  1534528741775, 1524504388947, 1517841905240, 1488426862026,
  1529626455594, 1502823403499, 1531746020798, 1530073881454,
  1544005313, 1529688839218, 1519340339255, 1506794778202,
];

const MALE_IMAGES = [
  1500648767791, 1507003211169, 1472099645785, 1504257432389,
  1519085360750, 1534528741775, 1507003211169, 1552058531,
  1500648767791, 1472099645785, 1504257432389, 1519085360750,
];

/**
 * 生成随机动态
 */
function generatePost(user: any) {
  const language = user.nativeLanguage || 'en';
  const templates = POST_TEMPLATES[language as keyof typeof POST_TEMPLATES] || POST_TEMPLATES.en;
  const content = sample(templates);

  // 随机决定是否包含图片（80% 的概率）
  const hasImage = Math.random() > 0.2;
  let mediaUrls: string[] = [];
  let mediaType = 'text';

  if (hasImage) {
    const gender = user.botGender;
    const images = gender === 'female' ? FEMALE_IMAGES : MALE_IMAGES;
    const imageId = sample(images);

    // 生成不同尺寸的图片 URL
    mediaUrls = [
      `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&h=1000&q=80`,
    ];
    mediaType = 'image';
  }

  // 随机生成点赞数、评论数、转发数
  const likesCount = randomIntRange(10, 5000);
  const commentsCount = randomIntRange(0, 500);
  const repostsCount = randomIntRange(0, 200);

  return {
    id: uuidv4(),
    userId: user.id,
    content,
    media_urls: mediaUrls,
    media_type: mediaType,
    language_tag: language,
    likes_count: likesCount,
    comments_count: commentsCount,
    reposts_count: repostsCount,
    created_at: new Date(Date.now() - randomIntRange(0, 7 * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * 生成点赞关系
 */
function generateLikes(posts: any[], users: any[], count: number) {
  const likes = [];
  const userIds = users.map(u => u.id);

  for (let i = 0; i < count; i++) {
    const post = sample(posts);
    const userId = sample(userIds);

    // 避免重复点赞
    if (likes.some(l => l.postId === post.id && l.userId === userId)) {
      continue;
    }

    likes.push({
      id: uuidv4(),
      post_id: post.id,
      user_id: userId,
      created_at: new Date(Date.now() - randomIntRange(0, 7 * 24 * 60 * 60 * 1000)).toISOString(),
    });
  }

  return likes;
}

/**
 * 生成评论
 */
function generateComments(posts: any[], users: any[], count: number) {
  const comments = [];

  for (let i = 0; i < count; i++) {
    const post = sample(posts);
    const user = sample(users);
    const language = user.nativeLanguage || 'en';

    const commentTemplates = POST_TEMPLATES[language as keyof typeof POST_TEMPLATES] || POST_TEMPLATES.en;
    const content = sample(commentTemplates);

    comments.push({
      id: uuidv4(),
      post_id: post.id,
      user_id: user.id,
      content: `${content} 💖`,
      created_at: new Date(Date.now() - randomIntRange(0, 7 * 24 * 60 * 60 * 1000)).toISOString(),
    });
  }

  return comments;
}

/**
 * 生成关注关系
 */
function generateFollows(users: any[], count: number) {
  const follows = [];

  for (let i = 0; i < count; i++) {
    const user1 = sample(users);
    const user2 = sample(users);

    // 避免自己关注自己
    if (user1.id === user2.id) {
      continue;
    }

    // 避免重复关注
    if (follows.some(f => f.followerId === user1.id && f.followingId === user2.id)) {
      continue;
    }

    follows.push({
      id: uuidv4(),
      follower_id: user1.id,
      following_id: user2.id,
      created_at: new Date(Date.now() - randomIntRange(0, 30 * 24 * 60 * 60 * 1000)).toISOString(),
    });
  }

  return follows;
}

/**
 * 批量生成动态
 */
async function generatePosts(postCount: number, likeCount: number, commentCount: number, followCount: number) {
  console.log('📝 正在获取机器人用户...');
  const { data: users, error: usersError } = await client.from('users').select('*').eq('is_bot', true);

  if (usersError) {
    console.error('❌ 获取机器人用户失败：', usersError);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.error('❌ 没有找到机器人用户！请先运行机器人生成脚本。');
    process.exit(1);
  }

  console.log(`✅ 找到 ${users.length} 个机器人用户`);

  // 生成动态
  console.log(`\n📝 正在生成 ${postCount} 条动态...`);
  const posts: any[] = [];
  for (let i = 0; i < postCount; i++) {
    const user = sample(users);
    const post = generatePost(user);
    posts.push(post);

    if ((i + 1) % 100 === 0) {
      console.log(`✅ 已生成 ${i + 1} 条动态...`);
    }
  }

  console.log('📝 正在写入动态到数据库...');
  const { data: postsData } = await client.from('posts').insert(posts).select();
  console.log(`✅ 成功创建 ${postsData?.length || 0} 条动态！`);

  // 使用插入后的 posts 数据（包含 id）
  const insertedPosts = postsData || [];

  // 生成点赞
  console.log(`\n❤️ 正在生成 ${likeCount} 个点赞...`);
  const likes = generateLikes(insertedPosts, users, likeCount);
  const { data: likesData } = await client.from('likes').insert(likes).select();
  console.log(`✅ 成功创建 ${likesData?.length || 0} 个点赞！`);

  // 生成评论
  console.log(`\n💬 正在生成 ${commentCount} 条评论...`);
  const comments = generateComments(insertedPosts, users, commentCount);
  const { data: commentsData } = await client.from('comments').insert(comments).select();
  console.log(`✅ 成功创建 ${commentsData?.length || 0} 条评论！`);

  // 生成关注
  console.log(`\n👥 正在生成 ${followCount} 个关注...`);
  const follows = generateFollows(users, followCount);
  const { data: followsData } = await client.from('follows').insert(follows).select();
  const insertedFollows = followsData || [];

  console.log('✅ 成功创建 ${insertedFollows.length} 个关注！');

  // 更新用户的关注数和粉丝数
  console.log('\n📊 正在更新用户统计数据...');
  for (const user of users) {
    const followersCount = insertedFollows.filter(f => f.following_id === user.id).length;
    const followingCount = insertedFollows.filter(f => f.follower_id === user.id).length;

    await client
      .from('users')
      .update({ followers_count: followersCount, following_count: followingCount })
      .eq('id', user.id);
  }
  console.log('✅ 用户统计数据更新完成！');
}

// 主函数
async function main() {
  const postCount = parseInt(process.argv[2]) || 1000;
  const likeCount = parseInt(process.argv[3]) || 5000;
  const commentCount = parseInt(process.argv[4]) || 2000;
  const followCount = parseInt(process.argv[5]) || 3000;

  console.log('╔════════════════════════════════════════╗');
  console.log('║   📝 Lingo 动态生成器                ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    await generatePosts(postCount, likeCount, commentCount, followCount);

    console.log('\n✨ 完成！动态数据已创建成功！');
    console.log('🎉 现在你可以看到丰富的朋友圈内容了！\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 错误：', error);
    process.exit(1);
  }
}

// 运行
main();
