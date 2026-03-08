#!/usr/bin/env node

/**
 * 机器人用户生成脚本
 * 生成模拟的机器人用户，用于测试和丰富应用内容
 */

import { getSupabaseClient } from '../storage/database/supabase-client.js';
import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange, sample, shuffleArray } from './utils/random.js';

// Supabase 客户端
const client = getSupabaseClient();

// 国家列表（联合国官方语言对应国家）
const COUNTRIES = [
  { code: 'CN', name: '中国', names: ['小红', '小美', '小雅', '小丽', '小静', '小雪', '小雨', '小琳', '小芳', '小婷', '小敏', '小慧', '小薇', '小琴', '小娟', '小霞', '小燕', '小慧', '小兰', '小华'], surnames: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'] },
  { code: 'US', name: '美国', names: ['Emma', 'Olivia', 'Sophia', 'Ava', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Liam', 'Noah', 'William', 'James', 'Oliver', 'Benjamin', 'Elijah', 'Lucas', 'Mason', 'Logan'], surnames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'] },
  { code: 'FR', name: '法国', names: ['Marie', 'Camille', 'Léa', 'Manon', 'Chloé', 'Julie', 'Sarah', 'Emma', 'Sophie', 'Charlotte', 'Gabriel', 'Léo', 'Louis', 'Hugo', 'Raphaël', 'Arthur', 'Lucas', 'Nathan', 'Théo', 'Jules'], surnames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'] },
  { code: 'RU', name: '俄罗斯', names: ['Анастасия', 'Мария', 'Елена', 'Дарья', 'Ольга', 'Наталья', 'Екатерина', 'София', 'Виктория', 'Анна', 'Александр', 'Максим', 'Артём', 'Михаил', 'Иван', 'Даниил', 'Дмитрий', 'Матвей', 'Никита', 'Андрей'], surnames: ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Лебедев', 'Козлов', 'Новиков', 'Морозов', 'Петров'] },
  { code: 'ES', name: '西班牙', names: ['María', 'Lucía', 'Sofía', 'Martina', 'Valentina', 'Julia', 'Carla', 'Emma', 'Daniela', 'Laura', 'Alejandro', 'Daniel', 'David', 'Álvaro', 'Adrián', 'Hugo', 'Pablo', 'Diego', 'Mario', 'Javier'], surnames: ['García', 'Rodríguez', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Gómez', 'Fernández', 'González', 'Díaz'] },
  { code: 'AE', name: '阿拉伯联合酋长国', names: ['فاطمة', 'مريم', 'نور', 'لينا', 'سارة', 'ريم', 'هدى', 'أمل', 'منى', 'عائشة', 'أحمد', 'محمد', 'عبدالله', 'عمر', 'علي', 'خالد', 'يوسف', 'عبدالرحمن', 'سعيد', 'حسن'], surnames: ['محمد', 'أحمد', 'علي', 'حسن', 'حسين', 'عبدالله', 'محمد', 'إبراهيم', 'عمر', 'خالد'] },
];

// 职业列表
const PROFESSIONS = [
  { en: 'Model', zh: '模特' },
  { en: 'Actress', zh: '演员' },
  { en: 'Singer', zh: '歌手' },
  { en: 'Dancer', zh: '舞者' },
  { en: 'Artist', zh: '艺术家' },
  { en: 'Designer', zh: '设计师' },
  { en: 'Photographer', zh: '摄影师' },
  { en: 'Influencer', zh: '网红' },
  { en: 'Writer', zh: '作家' },
  { en: 'Entrepreneur', zh: '创业者' },
  { en: 'Fitness Coach', zh: '健身教练' },
  { en: 'Dentist', zh: '牙医' },
  { en: 'Teacher', zh: '教师' },
  { en: 'Architect', zh: '建筑师' },
  { en: 'Doctor', zh: '医生' },
];

// 爱好列表
const HOBBIES = [
  { en: 'Travel', zh: '旅行' },
  { en: 'Photography', zh: '摄影' },
  { en: 'Cooking', zh: '烹饪' },
  { en: 'Reading', zh: '阅读' },
  { en: 'Music', zh: '音乐' },
  { en: 'Dancing', zh: '舞蹈' },
  { en: 'Swimming', zh: '游泳' },
  { en: 'Yoga', zh: '瑜伽' },
  { en: 'Fashion', zh: '时尚' },
  { en: 'Art', zh: '艺术' },
  { en: 'Gaming', zh: '游戏' },
  { en: 'Fitness', zh: '健身' },
  { en: 'Movies', zh: '电影' },
  { en: 'Coffee', zh: '咖啡' },
  { en: 'Wine', zh: '品酒' },
];

// 美女/帅哥图片关键词（Unsplash）
const BEAUTIFUL_IMAGES = [
  'beautiful woman portrait fashion model',
  'attractive woman photography elegant',
  'stunning woman beauty fashion',
  'handsome man portrait model',
  'attractive man photography fashion',
  'gorgeous woman portrait lifestyle',
  'stylish woman fashion photography',
  'handsome man portrait modern',
  'elegant woman beauty portrait',
  'charming man photography style',
];

// 语言学习偏好
const LEARNING_LANGUAGES = ['zh', 'en', 'fr', 'ru', 'es', 'ar'];

/**
 * 生成随机机器人用户
 */
function generateBotUser(index: number) {
  const gender = Math.random() > 0.5 ? 'female' : 'male';
  const country = sample(COUNTRIES);

  // 根据性别选择名字
  const firstName = sample(country.names);
  const lastName = sample(country.surnames);
  const username = `${firstName}_${lastName}_${index}`;

  const age = randomIntRange(18, 35);
  const profession = sample(PROFESSIONS);
  const hobbyCount = randomIntRange(2, 5);
  const hobbies = shuffleArray([...HOBBIES]).slice(0, hobbyCount).map(h => h.en);

  // 学习语言（随机 2-3 种）
  const learningLangCount = randomIntRange(2, 4);
  const learningLangs = shuffleArray([...LEARNING_LANGUAGES]).slice(0, learningLangCount);

  // 高质量美女/帅哥图片
  const imageKeyword = sample(BEAUTIFUL_IMAGES);
  const imageId = randomIntRange(1000, 9999);
  const avatarUrl = `https://images.unsplash.com/photo-${1500000000000 + imageId}?auto=format&fit=crop&w=400&h=400&q=80`;

  // 根据性别生成不同的图片 URL
  const femaleImageIds = [1494790108377, 1534528741775, 1524504388947, 1517841905240, 1488426862026, 1529626455594, 1502823403499, 1531746020798];
  const maleImageIds = [1500648767791, 1507003211169, 1472099645785, 1506794778202, 1504257432389, 1519085360750, 1534528741775, 1552058531];

  let selectedAvatarUrl;
  if (gender === 'female') {
    const imgId = sample(femaleImageIds);
    selectedAvatarUrl = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=400&h=400&q=80`;
  } else {
    const imgId = sample(maleImageIds);
    selectedAvatarUrl = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=400&h=400&q=80`;
  }

  return {
    id: uuidv4(),
    email: `bot_${index}_${username}@lingo.bot`,
    username,
    avatar_url: selectedAvatarUrl,
    bio: `✨ ${gender === 'female' ? 'Living life beautifully 💖' : 'Living life passionately 🔥'}\n📍 ${country.name}\n💼 ${profession.en}\n🎂 ${age} years old\n❤️ ${hobbies.map(h => h.en).join(' • ')}`,
    native_language: country.code === 'CN' ? 'zh' : country.code === 'US' ? 'en' : country.code === 'FR' ? 'fr' : country.code === 'RU' ? 'ru' : country.code === 'ES' ? 'es' : 'ar',
    learning_languages: learningLangs,
    provider: 'bot',
    provider_id: uuidv4(),
    followers_count: randomIntRange(100, 10000),
    following_count: randomIntRange(50, 500),
    is_bot: true,
    bot_country: country.name,
    bot_gender: gender,
    bot_age: age,
    bot_profession: profession.en,
    bot_hobbies: hobbies,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * 批量生成机器人用户
 */
async function generateBotUsers(count: number) {
  console.log(`🤖 开始生成 ${count} 个机器人用户...`);

  const users = [];
  for (let i = 0; i < count; i++) {
    const user = generateBotUser(i + 1);
    users.push(user);

    if ((i + 1) % 50 === 0) {
      console.log(`✅ 已生成 ${i + 1} 个用户...`);
    }
  }

  // 批量插入数据库
  console.log('📝 正在写入数据库...');
  try {
    const { data, error } = await client.from('users').insert(users).select();
    if (error) {
      throw error;
    }
    console.log(`✅ 成功创建 ${data?.length || 0} 个机器人用户！`);
  } catch (error) {
    console.error('❌ 创建用户失败：', error);
    throw error;
  }

  return users;
}

// 主函数
async function main() {
  const count = parseInt(process.argv[2]) || 500;

  console.log('╔════════════════════════════════════════╗');
  console.log('║   🤖 Lingo 机器人用户生成器          ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    await generateBotUsers(count);

    console.log('\n✨ 完成！机器人用户已创建成功！');
    console.log('🎉 现在你可以使用这些用户来测试应用功能了。\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 错误：', error);
    process.exit(1);
  }
}

// 运行
main();
