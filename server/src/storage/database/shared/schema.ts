import { pgTable, serial, timestamp, varchar, text, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表 - 支持微信、谷歌、苹果登录
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).unique(),
    username: varchar("username", { length: 64 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    bio: text("bio"),
    nativeLanguage: varchar("native_language", { length: 50 }),
    learningLanguages: jsonb("learning_languages").$type<string[]>().default(sql`'[]'::jsonb`),
    provider: varchar("provider", { length: 20 }).notNull(), // wechat, google, apple
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    followersCount: integer("followers_count").default(0).notNull(),
    followingCount: integer("following_count").default(0).notNull(),
    isBot: boolean("is_bot").default(false).notNull(), // 机器人用户标记
    botCountry: varchar("bot_country", { length: 50 }), // 机器人国家
    botGender: varchar("bot_gender", { length: 20 }), // 机器人性别
    botAge: integer("bot_age"), // 机器人年龄
    botProfession: varchar("bot_profession", { length: 100 }), // 机器人职业
    botHobbies: jsonb("bot_hobbies").$type<string[]>().default(sql`'[]'::jsonb`), // 机器人爱好
    // 定位功能
    latitude: varchar("latitude", { length: 20 }), // 纬度
    longitude: varchar("longitude", { length: 20 }), // 经度
    city: varchar("city", { length: 100 }), // 城市
    country: varchar("country", { length: 100 }), // 国家
    lastLocationUpdate: timestamp("last_location_update", { withTimezone: true, mode: 'string' }), // 最后定位更新时间
    // 游戏化系统
    points: integer("points").default(0).notNull(), // 积分
    level: integer("level").default(1).notNull(), // 等级
    experience: integer("experience").default(0).notNull(), // 经验值
    dailyStreak: integer("daily_streak").default(0).notNull(), // 连续签到天数
    lastSignInDate: timestamp("last_sign_in_date", { withTimezone: true, mode: 'string' }), // 最后签到日期
    // 隐私设置
    showLocation: boolean("show_location").default(true).notNull(), // 是否显示位置
    showOnlineStatus: boolean("show_online_status").default(true).notNull(), // 是否显示在线状态
    allowStrangerMessages: boolean("allow_stranger_messages").default(true).notNull(), // 是否允许陌生人私信
    // 在线状态
    isOnline: boolean("is_online").default(false).notNull(), // 是否在线
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: 'string' }), // 最后在线时间
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_provider_idx").on(table.provider),
    index("users_is_bot_idx").on(table.isBot),
    index("users_location_idx").on(table.latitude, table.longitude), // 地理位置索引
    index("users_points_idx").on(table.points), // 积分排名索引
    index("users_level_idx").on(table.level), // 等级排名索引
    uniqueIndex("users_provider_unique").on(table.provider, table.providerId),
  ]
);

// 内容/帖子表
export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    content: text("content"),
    mediaUrls: jsonb("media_urls").$type<string[]>().default(sql`'[]'::jsonb`),
    mediaType: varchar("media_type", { length: 20 }), // image, video, mixed
    languageTag: varchar("language_tag", { length: 50 }),
    likesCount: integer("likes_count").default(0).notNull(),
    commentsCount: integer("comments_count").default(0).notNull(),
    repostsCount: integer("reposts_count").default(0).notNull(),
    // 定位功能
    latitude: varchar("latitude", { length: 20 }), // 纬度
    longitude: varchar("longitude", { length: 20 }), // 经度
    locationName: varchar("location_name", { length: 200 }), // 位置名称（如"北京市朝阳区"）
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("posts_user_id_idx").on(table.userId),
    index("posts_language_tag_idx").on(table.languageTag),
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_location_idx").on(table.latitude, table.longitude), // 地理位置索引
  ]
);

// 评论表
export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    postId: varchar("post_id", { length: 36 }).notNull().references(() => posts.id),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    content: text("content").notNull(),
    parentId: varchar("parent_id", { length: 36 }), // 用于回复评论
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("comments_post_id_idx").on(table.postId),
    index("comments_user_id_idx").on(table.userId),
    index("comments_parent_id_idx").on(table.parentId),
  ]
);

// 点赞表
export const likes = pgTable(
  "likes",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    postId: varchar("post_id", { length: 36 }).notNull().references(() => posts.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("likes_user_id_idx").on(table.userId),
    index("likes_post_id_idx").on(table.postId),
    uniqueIndex("likes_user_post_unique").on(table.userId, table.postId),
  ]
);

// 关注表
export const follows = pgTable(
  "follows",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    followerId: varchar("follower_id", { length: 36 }).notNull().references(() => users.id),
    followingId: varchar("following_id", { length: 36 }).notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("follows_follower_id_idx").on(table.followerId),
    index("follows_following_id_idx").on(table.followingId),
    uniqueIndex("follows_unique").on(table.followerId, table.followingId),
  ]
);

// 会话表
export const conversations = pgTable(
  "conversations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user1Id: varchar("user1_id", { length: 36 }).notNull().references(() => users.id),
    user2Id: varchar("user2_id", { length: 36 }).notNull().references(() => users.id),
    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true, mode: 'string' }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("conversations_user1_id_idx").on(table.user1Id),
    index("conversations_user2_id_idx").on(table.user2Id),
    uniqueIndex("conversations_unique").on(table.user1Id, table.user2Id),
  ]
);

// 消息表
export const messages = pgTable(
  "messages",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    conversationId: varchar("conversation_id", { length: 36 }).notNull().references(() => conversations.id),
    senderId: varchar("sender_id", { length: 36 }).notNull().references(() => users.id),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(), // 消息是否已删除
    replyToId: varchar("reply_to_id", { length: 36 }), // 引用回复的消息 ID
    forwardFromId: varchar("forward_from_id", { length: 36 }), // 转发来源消息 ID
    forwardFromConversationId: varchar("forward_from_conversation_id", { length: 36 }), // 转发来源会话 ID
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("messages_conversation_id_idx").on(table.conversationId),
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_reply_to_id_idx").on(table.replyToId),
  ]
);

// 群组表
export const groups = pgTable(
  "groups",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    description: text("description"),
    ownerId: varchar("owner_id", { length: 36 }).notNull().references(() => users.id),
    memberCount: integer("member_count").default(0).notNull(),
    maxMembers: integer("max_members"), // 移除默认值，支持无限制人数
    allowScreenshot: boolean("allow_screenshot").default(true).notNull(), // 是否允许截屏
    allowScreenRecording: boolean("allow_screen_recording").default(true).notNull(), // 是否允许录屏
    isPublic: boolean("is_public").default(true).notNull(), // 是否公开群
    // 定位功能
    latitude: varchar("latitude", { length: 20 }), // 纬度
    longitude: varchar("longitude", { length: 20 }), // 经度
    city: varchar("city", { length: 100 }), // 城市
    country: varchar("country", { length: 100 }), // 国家
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("groups_owner_id_idx").on(table.ownerId),
    index("groups_is_public_idx").on(table.isPublic),
    index("groups_location_idx").on(table.latitude, table.longitude), // 地理位置索引
  ]
);

// 群成员表
export const groupMembers = pgTable(
  "group_members",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    groupId: varchar("group_id", { length: 36 }).notNull().references(() => groups.id, { onDelete: 'cascade' }),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: varchar("role", { length: 20 }).default("member").notNull(), // owner, admin, member
    nickname: varchar("nickname", { length: 64 }),
    mutedUntil: timestamp("muted_until", { withTimezone: true, mode: 'string' }), // 禁言到期时间
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("group_members_group_id_idx").on(table.groupId),
    index("group_members_user_id_idx").on(table.userId),
    uniqueIndex("group_members_unique").on(table.groupId, table.userId),
  ]
);

// 群消息表
export const groupMessages = pgTable(
  "group_messages",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    groupId: varchar("group_id", { length: 36 }).notNull().references(() => groups.id, { onDelete: 'cascade' }),
    senderId: varchar("sender_id", { length: 36 }).notNull().references(() => users.id),
    content: text("content").notNull(),
    type: varchar("type", { length: 20 }).default("text").notNull(), // text, image, voice, video
    mediaUrl: varchar("media_url", { length: 500 }), // 媒体文件 URL
    replyToId: varchar("reply_to_id", { length: 36 }), // 回复的消息 ID
    isRead: jsonb("is_read").$type<Record<string, boolean>>().default(sql`'{}'::jsonb`), // 已读状态 {userId: boolean}
    isDeleted: boolean("is_deleted").default(false).notNull(), // 消息是否已删除
    forwardFromId: varchar("forward_from_id", { length: 36 }), // 转发来源消息 ID
    forwardFromGroupId: varchar("forward_from_group_id", { length: 36 }), // 转发来源群组 ID
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("group_messages_group_id_idx").on(table.groupId),
    index("group_messages_sender_id_idx").on(table.senderId),
    index("group_messages_created_at_idx").on(table.createdAt),
    index("group_messages_reply_to_id_idx").on(table.replyToId),
  ]
);

// 频道表 - 类似 Telegram 频道，单向广播
export const channels = pgTable(
  "channels",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    username: varchar("username", { length: 64 }).unique(), // 频道唯一用户名 @channelname
    avatarUrl: varchar("avatar_url", { length: 500 }),
    description: text("description"),
    ownerId: varchar("owner_id", { length: 36 }).notNull().references(() => users.id),
    subscriberCount: integer("subscriber_count").default(0).notNull(),
    isPublic: boolean("is_public").default(true).notNull(), // 是否公开频道
    language: varchar("language", { length: 20 }).default("zh"), // 频道主要语言
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("channels_owner_id_idx").on(table.ownerId),
    index("channels_is_public_idx").on(table.isPublic),
    index("channels_language_idx").on(table.language),
  ]
);

// 频道订阅表
export const channelSubscriptions = pgTable(
  "channel_subscriptions",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    channelId: varchar("channel_id", { length: 36 }).notNull().references(() => channels.id, { onDelete: 'cascade' }),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("channel_subscriptions_channel_id_idx").on(table.channelId),
    index("channel_subscriptions_user_id_idx").on(table.userId),
    uniqueIndex("channel_subscriptions_unique").on(table.channelId, table.userId),
  ]
);

// 频道消息表
export const channelMessages = pgTable(
  "channel_messages",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    channelId: varchar("channel_id", { length: 36 }).notNull().references(() => channels.id, { onDelete: 'cascade' }),
    senderId: varchar("sender_id", { length: 36 }).notNull().references(() => users.id),
    content: text("content").notNull(),
    type: varchar("type", { length: 20 }).default("text").notNull(), // text, image, voice, video
    mediaUrl: varchar("media_url", { length: 500 }), // 媒体文件 URL
    viewsCount: integer("views_count").default(0).notNull(), // 查看次数
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("channel_messages_channel_id_idx").on(table.channelId),
    index("channel_messages_sender_id_idx").on(table.senderId),
    index("channel_messages_created_at_idx").on(table.createdAt),
  ]
);

// 成就表 - 游戏化系统
export const achievements = pgTable(
  "achievements",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(), // 成就名称
    description: text("description").notNull(), // 成就描述
    icon: varchar("icon", { length: 500 }), // 成就图标
    type: varchar("type", { length: 50 }).notNull(), // 成就类型（learning, social, activity）
    requirement: integer("requirement").notNull(), // 完成要求
    pointsReward: integer("points_reward").default(0).notNull(), // 积分奖励
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("achievements_type_idx").on(table.type),
  ]
);

// 用户成就关联表
export const userAchievements = pgTable(
  "user_achievements",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    achievementId: varchar("achievement_id", { length: 36 }).notNull().references(() => achievements.id),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("user_achievements_user_id_idx").on(table.userId),
    index("user_achievements_achievement_id_idx").on(table.achievementId),
    uniqueIndex("user_achievements_unique").on(table.userId, table.achievementId),
  ]
);

// 学习记录表 - 用于统计
export const learningRecords = pgTable(
  "learning_records",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: varchar("type", { length: 50 }).notNull(), // 记录类型（chat, post, comment, like, follow）
    targetId: varchar("target_id", { length: 36 }), // 目标ID（如帖子ID、消息ID）
    language: varchar("language", { length: 20 }), // 涉及的语言
    duration: integer("duration").default(0), // 持续时间（秒，用于聊天时长）
    points: integer("points").default(0).notNull(), // 获得的积分
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("learning_records_user_id_idx").on(table.userId),
    index("learning_records_type_idx").on(table.type),
    index("learning_records_created_at_idx").on(table.createdAt),
  ]
);

// Zod schemas for validation
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

export const insertUserSchema = createCoercedInsertSchema(users).pick({
  email: true,
  username: true,
  avatarUrl: true,
  bio: true,
  nativeLanguage: true,
  learningLanguages: true,
  provider: true,
  providerId: true,
});

export const updateUserSchema = createCoercedInsertSchema(users)
  .pick({
    email: true,
    username: true,
    avatarUrl: true,
    bio: true,
    nativeLanguage: true,
    learningLanguages: true,
  })
  .partial();

export const insertPostSchema = createCoercedInsertSchema(posts).pick({
  userId: true,
  content: true,
  mediaUrls: true,
  mediaType: true,
  languageTag: true,
});

export const updatePostSchema = createCoercedInsertSchema(posts)
  .pick({
    content: true,
  })
  .partial();

export const insertCommentSchema = createCoercedInsertSchema(comments).pick({
  postId: true,
  userId: true,
  content: true,
  parentId: true,
});

export const insertLikeSchema = createCoercedInsertSchema(likes).pick({
  userId: true,
  postId: true,
});

export const insertFollowSchema = createCoercedInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

export const insertConversationSchema = createCoercedInsertSchema(conversations).pick({
  user1Id: true,
  user2Id: true,
});

export const updateConversationSchema = createCoercedInsertSchema(conversations)
  .pick({
    lastMessage: true,
    lastMessageAt: true,
  })
  .partial();

export const insertMessageSchema = createCoercedInsertSchema(messages).pick({
  conversationId: true,
  senderId: true,
  content: true,
});

export const updateMessageSchema = createCoercedInsertSchema(messages)
  .pick({
    isRead: true,
    isDeleted: true,
    replyToId: true,
    forwardFromId: true,
    forwardFromConversationId: true,
  })
  .partial();

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type UpdateConversation = z.infer<typeof updateConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UpdateMessage = z.infer<typeof updateMessageSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = typeof groups.$inferInsert;
export type UpdateGroup = Partial<typeof groups.$inferInsert>;

export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = typeof groupMembers.$inferInsert;
export type UpdateGroupMember = Partial<typeof groupMembers.$inferInsert>;

export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroupMessage = typeof groupMessages.$inferInsert;
export type UpdateGroupMessage = Partial<typeof groupMessages.$inferInsert>;

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = typeof channels.$inferInsert;
export type UpdateChannel = Partial<typeof channels.$inferInsert>;

export type ChannelSubscription = typeof channelSubscriptions.$inferSelect;
export type InsertChannelSubscription = typeof channelSubscriptions.$inferInsert;

export type ChannelMessage = typeof channelMessages.$inferSelect;
export type InsertChannelMessage = typeof channelMessages.$inferInsert;
export type UpdateChannelMessage = Partial<typeof channelMessages.$inferInsert>;
