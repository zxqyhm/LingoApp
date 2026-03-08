# Lingo APK 完整打包指南 - 下载方法

## 🎯 最简单的方法（推荐新手）

### 方法 1：使用 Expo Go 调试（最快，无需打包）

**适用场景**：快速测试和开发调试

**步骤**：

1. **在手机上安装 Expo Go**
   - Android：在 Google Play 搜索 "Expo Go" 并安装
   - iOS：在 App Store 搜索 "Expo Go" 并安装

2. **启动开发服务器**
   ```bash
   cd /workspace/projects/client
   pnpm start
   ```

3. **扫描二维码**
   - 终端会显示一个二维码
   - 用手机 Expo Go 扫描二维码
   - 应用会自动在手机上打开

4. **优点**：
   - ✅ 无需打包，即开即用
   - ✅ 支持热更新，代码改动立即生效
   - ✅ 适合快速测试

5. **缺点**：
   - ❌ 需要保持开发服务器运行
   - ❌ 不是独立的 APK 文件
   - ❌ 无法分享给其他人

---

### 方法 2：使用 EAS Build（推荐，免费）

**适用场景**：生成可分享的 APK 文件

**优点**：
- ✅ 完全免费（个人项目）
- ✅ 云端构建，无需本地配置
- ✅ 支持所有 Android 设备
- ✅ 构建速度快（5-10分钟）

#### 步骤 1：安装 Expo CLI 和 EAS CLI

```bash
# 全局安装 Expo CLI
npm install -g expo-cli

# 全局安装 EAS CLI
npm install -g eas-cli
```

#### 步骤 2：登录 Expo 账号

```bash
cd /workspace/projects/client

# 登录 Expo（如果没有账号会自动跳转注册）
eas login
```

#### 步骤 3：配置 EAS

```bash
# 初始化 EAS 配置
eas build:configure
```

这会创建 `eas.json` 文件，选择默认配置即可。

#### 步骤 4：创建预构建

```bash
# 第一次需要预构建（仅第一次需要）
npx expo prebuild --clean
```

#### 步骤 5：构建 APK

```bash
# 构建预览版 APK（免费）
eas build --platform android --profile preview
```

**参数说明**：
- `--platform android`：构建 Android 版本
- `--profile preview`：使用预览配置（免费）

#### 步骤 6：等待构建完成

构建过程大约需要 5-10 分钟，你会看到：
```
✔ Build successfully submitted
✔ Build started
✔ Build completed
```

#### 步骤 7：下载 APK

构建完成后：

1. **方法 A：通过 Expo 网站**
   - 访问 https://expo.dev
   - 登录你的账号
   - 找到你的项目 "lingo"
   - 点击 "Builds" 标签
   - 找到最新构建
   - 点击 "Download APK"

2. **方法 B：通过命令行**
   ```bash
   # 查看构建列表
   eas build:list

   # 下载最新构建
   eas build:download <build-id>
   ```

#### 步骤 8：安装 APK 到手机

**方法 A：通过数据线**
```bash
# 确保 Android 手机开启了 USB 调试
# 连接手机到电脑
adb devices

# 安装 APK
adb install lingo-app.apk
```

**方法 B：通过云存储**
1. 将 APK 上传到 Google Drive、百度网盘等
2. 在手机上下载并安装

**方法 C：通过链接分享**
1. 将 APK 上传到云存储
2. 生成分享链接
3. 在手机浏览器中打开链接并下载

---

### 方法 3：使用 Expo Application Services（EAS）构建

**适用场景**：生成高质量 APK，支持签名

#### 详细步骤：

1. **创建 Expo 账号**
   - 访问 https://expo.dev
   - 点击 "Sign Up" 注册账号
   - 验证邮箱

2. **登录**
   ```bash
   cd /workspace/projects/client
   eas login
   ```

3. **配置 eas.json**

   在 `client/` 目录下创建 `eas.json` 文件：

   ```json
   {
     "cli": {
       "version": ">= 5.2.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {
         "android": {
           "buildType": "app-bundle"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

4. **配置 app.json**

   确保 `client/app.json` 包含：

   ```json
   {
     "expo": {
       "name": "Lingo",
       "slug": "lingo",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "userInterfaceStyle": "automatic",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "android": {
         "package": "com.lingo.app",
         "versionCode": 1,
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#ffffff"
         },
         "permissions": [
           "INTERNET",
           "CAMERA",
           "READ_EXTERNAL_STORAGE",
           "WRITE_EXTERNAL_STORAGE",
           "RECORD_AUDIO",
           "MODIFY_AUDIO_SETTINGS",
           "ACCESS_FINE_LOCATION",
           "ACCESS_COARSE_LOCATION"
         ]
       },
       "plugins": [
         "expo-av",
         "expo-camera",
         "expo-image-picker",
         "expo-media-library",
         "expo-location"
       ]
     }
   }
   ```

5. **预构建项目**

   ```bash
   npx expo prebuild --clean
   ```

6. **构建 APK**

   ```bash
   # 构建预览版（免费）
   eas build --platform android --profile preview

   # 或构建生产版（免费）
   eas build --platform android --profile production
   ```

7. **下载安装**

   按照上面的"方法 2"步骤 7-8 操作

---

## 🔧 方法 4：本地构建 APK（进阶）

**适用场景**：需要完全控制构建过程，离线构建

**前提要求**：
- 安装 Android Studio
- 配置 Android SDK
- 安装 JDK 17 或更高版本

### 步骤 1：安装依赖

```bash
cd /workspace/projects/client
pnpm install
```

### 步骤 2：预构建项目

```bash
npx expo prebuild --clean --platform android
```

这会生成 `android/` 目录。

### 步骤 3：进入 Android 目录

```bash
cd android
```

### 步骤 4：构建 Debug 版本（快速）

```bash
# Debug 版本（调试用，快速）
./gradlew assembleDebug

# APK 位置：
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 步骤 5：构建 Release 版本（优化）

#### 5.1 生成签名密钥

```bash
# 创建 keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore lingo-release.keystore \
  -alias lingox \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

#### 5.2 配置签名

编辑 `android/app/build.gradle`，添加：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('lingo-release.keystore')
            storePassword '你的密码'
            keyAlias 'lingox'
            keyPassword '你的密码'
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

#### 5.3 构建

```bash
# Release 版本（优化，适合发布）
./gradlew assembleRelease

# APK 位置：
# android/app/build/outputs/apk/release/app-release.apk
```

### 步骤 6：安装 APK

```bash
# 连接设备
adb devices

# 安装
adb install app-release.apk
```

---

## 📱 方法 5：使用 Docker 构建（CI/CD）

**适用场景**：自动化构建，无本地环境要求

### 步骤 1：创建 Dockerfile

创建 `client/Dockerfile.android`：

```dockerfile
FROM cirrusci/android:api-33-node

WORKDIR /workspace

# 安装依赖
RUN npm install -g expo-cli eas-cli
COPY package*.json ./
RUN npm install

# 复制项目
COPY . .

# 配置 EAS
RUN eas build:configure

# 构建
CMD ["eas", "build", "--platform", "android", "--profile", "preview", "--non-interactive"]
```

### 步骤 2：构建 Docker 镜像

```bash
cd /workspace/projects/client
docker build -f Dockerfile.android -t lingox-android .
```

### 步骤 3：运行构建

```bash
docker run --rm \
  -e EXPO_TOKEN=your-expo-token \
  lingox-android
```

---

## ⚡ 快速命令参考

### EAS 构建命令

```bash
# 登录
eas login

# 配置
eas build:configure

# 构建 APK（预览版，免费）
eas build --platform android --profile preview

# 构建 AAB（生产版，Google Play）
eas build --platform android --profile production

# 查看构建列表
eas build:list

# 下载构建产物
eas build:download <build-id>

# 查看构建日志
eas build:view <build-id>
```

### 本地构建命令

```bash
# 预构建
npx expo prebuild --clean

# Debug 版本
cd android && ./gradlew assembleDebug

# Release 版本
cd android && ./gradlew assembleRelease

# 清理构建
cd android && ./gradlew clean
```

---

## ❓ 常见问题

### Q1: 构建失败怎么办？

**A:** 检查以下几点：
1. 确保 `app.json` 配置正确
2. 检查依赖是否完整安装
3. 查看构建日志中的错误信息
4. 尝试清理缓存：`eas build:list` 然后重新构建

### Q2: 免费版 EAS 有什么限制？

**A:** 个人项目免费版限制：
- ✅ 每月 30 次构建
- ✅ 构建时间 15 分钟
- ✅ APK 格式（适合测试）
- ❌ 不支持 AAB 格式（Google Play 需要）

### Q3: 如何加快构建速度？

**A:**
1. 使用预览版配置（`--profile preview`）
2. 避免不必要的依赖
3. 使用缓存（EAS 自动缓存）
4. 选择合适的构建时间段（服务器负载低）

### Q4: APK 安装时提示"应用未安装"？

**A:** 可能的原因：
1. APK 文件损坏 → 重新下载
2. Android 版本不兼容 → 检查 `minSdkVersion`
3. 已安装旧版本 → 先卸载旧版本

### Q5: 如何分享 APK 给其他人？

**A:** 三种方法：
1. 上传到云存储（Google Drive、百度网盘）
2. 使用文件传输工具（AirDrop、快牙）
3. 托管到网站（GitHub Releases）

---

## 🎉 推荐方案

**对于你现在的需求（快速测试）**：

1. **最快方案**：使用 Expo Go（无需打包）
2. **推荐方案**：使用 EAS Build（免费，5-10分钟）
3. **进阶方案**：本地构建（需要配置）

---

## 📦 APK 文件信息

### 预期 APK 信息

- **应用名称**：Lingo
- **包名**：com.lingo.app
- **版本**：1.0.0
- **版本号**：1
- **最低 Android 版本**：Android 5.0 (API 21)
- **目标 Android 版本**：Android 13 (API 33)
- **文件大小**：约 50-100 MB（取决于资源）

### 功能列表

✅ 用户系统（登录、注册）
✅ 内容流（动态、点赞、评论）
✅ 消息系统（私聊、群聊）
✅ 群组功能（创建、设置、禁截屏）
✅ 机器人系统（500+ 机器人用户）
✅ 定位功能（附近用户、群组、动态）
✅ 游戏化系统（积分、等级、成就、排行榜）
✅ 多语言支持（6 种联合国官方语言）
✅ 视频内容分享
✅ 隐私保护（隐私模式、位置隐藏）

---

## 🚀 开始打包

**立即执行以下命令：**

```bash
# 1. 进入客户端目录
cd /workspace/projects/client

# 2. 安装依赖
pnpm install

# 3. 登录 EAS
npm install -g eas-cli
eas login

# 4. 配置 EAS（第一次需要）
eas build:configure

# 5. 预构建（第一次需要）
npx expo prebuild --clean

# 6. 构建 APK
eas build --platform android --profile preview
```

**等待 5-10 分钟后，你就可以下载 APK 了！**

---

**Lingo - 全球语言学习与社交应用** 🌍
