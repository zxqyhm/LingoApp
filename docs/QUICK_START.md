# Lingo - 快速开始指南

## 🚀 5 分钟快速启动

### 前置要求

- Node.js 18+
- pnpm
- Git

### 步骤 1：克隆项目

```bash
git clone <repository-url>
cd /workspace/projects
```

### 步骤 2：安装依赖

```bash
# 安装后端依赖
cd server
pnpm install

# 安装前端依赖
cd ../client
pnpm install
```

### 步骤 3：生成测试数据

```bash
cd ../server

# 生成 500 个机器人用户
pnpm run generate:bot-users 500

# 生成 2000 条动态内容
pnpm run generate:posts 2000 10000 5000 6000
```

### 步骤 4：启动服务

```bash
# 启动后端（端口 9091）
cd server
pnpm run dev &

# 启动前端（端口 5000）
cd ../client
pnpm start &
```

### 步骤 5：访问应用

打开浏览器访问：
- 🌐 前端：http://localhost:5000
- 🔧 后端 API：http://localhost:9091/api/v1/health

---

## 📱 生成机器人用户

### 命令格式

```bash
pnpm run generate:bot-users <数量>
```

### 示例

```bash
# 生成 100 个机器人用户
pnpm run generate:bot-users 100

# 生成 500 个机器人用户（推荐）
pnpm run generate:bot-users 500

# 生成 1000 个机器人用户
pnpm run generate:bot-users 1000
```

### 机器人用户特性

- 🌍 6 个国家（中、美、法、俄、西、阿联酋）
- 👫 男女平衡
- 🎂 年龄 18-35 岁
- 💼 15 种职业
- ❤️ 15 种爱好
- 📸 高质量 Unsplash 图片
- 🌐 多语言内容

---

## 📝 生成动态内容

### 命令格式

```bash
pnpm run generate:posts <动态数> <点赞数> <评论数> <关注数>
```

### 示例

```bash
# 小规模测试
pnpm run generate:posts 100 500 200 300

# 中等规模
pnpm run generate:posts 1000 5000 2000 3000

# 大规模生产（推荐）
pnpm run generate:posts 2000 10000 5000 6000
```

### 参数说明

- `<动态数>`：生成的动态数量
- `<点赞数>`：生成的点赞数量
- `<评论数>`：生成的评论数量
- `<关注数>`：生成的关注关系数量

---

## 🏗️ 构建 APK

### 方法 1：使用 EAS（推荐）

```bash
cd client

# 安装 EAS CLI
npm install -g eas-cli

# 登录
eas login

# 构建
eas build --platform android --profile preview
```

### 方法 2：本地构建

```bash
cd client

# 预构建
npx expo prebuild --clean --platform android

# 构建 APK
cd android
./gradlew assembleRelease

# APK 位置
# android/app/build/outputs/apk/release/app-release.apk
```

详细步骤请查看：[APK 打包指南](./APK_BUILD_GUIDE.md)

---

## 🎯 核心功能

### 1. 用户系统
- ✅ 多平台登录（微信、谷歌、苹果）
- ✅ 个人资料编辑
- ✅ 粉丝/关注管理

### 2. 内容流
- ✅ 瀑布流布局
- ✅ 点赞、评论、分享
- ✅ 图文/视频支持
- ✅ 多语言内容

### 3. 消息系统
- ✅ 私聊功能
- ✅ 群组聊天
- ✅ 消息撤回
- ✅ 引用回复
- ✅ 消息转发

### 4. 群组功能
- ✅ 创建群组
- ✅ 无成员限制
- ✅ 禁止截屏/录屏
- ✅ 群主管理权限

### 5. 机器人系统
- ✅ 500+ 美女/帅哥用户
- ✅ 自动发布动态
- ✅ 多语言内容
- ✅ 真实社交关系

---

## 🌍 多语言支持

### 支持的语言

| 语言 | 代码 | 标志 |
|------|------|------|
| 中文 | zh | 🇨🇳 |
| 英文 | en | 🇺🇸 |
| 法语 | fr | 🇫🇷 |
| 俄语 | ru | 🇷🇺 |
| 西班牙语 | es | 🇪🇸 |
| 阿拉伯语 | ar | 🇦🇪 |

### 使用方法

机器人用户会自动生成对应语言的内容，前端可以通过 `language_tag` 字段筛选内容。

---

## 📊 数据统计

### 生成数据示例

运行以下命令后：

```bash
pnpm run generate:bot-users 500
pnpm run generate:posts 2000 10000 5000 6000
```

将获得：
- 🤖 500 个机器人用户
- 📝 2000 条动态内容
- ❤️ 10000 个点赞
- 💬 5000 条评论
- 👥 6000 个关注关系

---

## 🛠️ 开发命令

### 后端

```bash
cd server

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 生产模式
pnpm start

# 生成机器人用户
pnpm run generate:bot-users 500

# 生成动态内容
pnpm run generate:posts 2000 10000 5000 6000
```

### 前端

```bash
cd client

# 开发模式
pnpm start

# 构建 Web
pnpm run build:web

# 构建 Android
npx expo prebuild --platform android

# 构建 iOS
npx expo prebuild --platform ios
```

---

## 🔧 环境变量

### 后端 (.env)

```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### 前端 (app.config.ts)

```typescript
export default {
  expo: {
    extra: {
      backendBaseUrl: process.env.EXPO_PUBLIC_BACKEND_BASE_URL
    }
  }
}
```

---

## 📂 项目结构

```
lingo/
├── client/                  # 前端（Expo + React Native）
│   ├── app/                # Expo Router 页面
│   ├── screens/            # 页面组件
│   ├── components/         # 可复用组件
│   ├── hooks/              # 自定义 Hooks
│   ├── utils/              # 工具函数
│   └── assets/             # 静态资源
├── server/                 # 后端（Express + Supabase）
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── storage/        # 数据库配置
│   │   ├── scripts/        # 生成脚本
│   │   └── seed.ts         # 数据预置
│   └── package.json
├── docs/                   # 文档
└── README.md
```

---

## 🐛 常见问题

### 问题 1：数据库连接失败

**解决方案**：
```bash
# 检查 Supabase 配置
cat server/.env

# 确保 Supabase 实例正在运行
# 检查 DATABASE_URL 是否正确
```

### 问题 2：机器人用户生成失败

**解决方案**：
```bash
# 清理缓存
cd server
rm -rf node_modules
pnpm install

# 重新生成
pnpm run generate:bot-users 500
```

### 问题 3：前端构建失败

**解决方案**：
```bash
# 清理缓存
cd client
rm -rf node_modules .expo
pnpm install

# 重新构建
npx expo prebuild --clean
```

---

## 📚 文档

- [功能更新说明](./FEATURE_UPDATE.md) - 最新功能和更新
- [APK 打包指南](./APK_BUILD_GUIDE.md) - 如何打包 APK
- [群组功能指南](./GROUP_FEATURE_GUIDE.md) - 群组功能详细说明

---

## 🎉 开始使用

现在你已经准备好启动 Lingo 应用了！

1. **启动服务**：运行启动命令
2. **生成数据**：创建机器人用户和动态
3. **访问应用**：打开浏览器查看
4. **构建 APK**：打包安装到手机

享受全球语言学习与社交的乐趣吧！🌍

---

**Lingo - 全球语言学习与社交应用** 🌍
