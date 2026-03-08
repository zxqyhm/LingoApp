# Lingo 应用打包安装指南

## 📱 方法 1：使用 Expo Go（最简单，推荐）

**适用场景**：快速测试开发版，无需打包

### 步骤：

1. **手机上安装 Expo Go**
   - 📲 Android：Google Play 搜索 "Expo Go"
   - 📲 iOS：App Store 搜索 "Expo Go"

2. **启动开发服务器**
   ```bash
   cd /workspace/projects/client
   pnpm start
   ```

3. **扫描二维码连接**
   - 终端会显示二维码
   - 用手机 Expo Go 扫描
   - 自动打开应用

### ✅ 优点：
- 无需打包，即开即用
- 支持热更新，代码改动立即生效
- 适合快速测试

### ❌ 缺点：
- 需要保持开发服务器运行
- 无法分享给其他人

---

## 📦 方法 2：生成 APK 安装包（推荐分享）

**适用场景**：生成可独立安装的 APK 文件

### 步骤：

#### 1. 登录 Expo 账号

```bash
cd /workspace/projects/client
eas login
```

> 💡 如果没有账号，会自动跳转到浏览器注册（免费）

#### 2. 构建 APK

```bash
eas build --platform android --profile preview
```

#### 3. 等待构建完成

- 构建时间：5-10 分钟
- 在 Expo 云端构建，无需本地配置
- 完全免费（个人项目）

#### 4. 下载 APK

**方法 A：浏览器下载**
1. 访问 https://expo.dev
2. 登录后找到 "lingo" 项目
3. 点击 "Builds" 标签
4. 找到最新构建，点击 "Download APK"

**方法 B：命令行下载**
```bash
# 查看构建列表
eas build:list

# 下载最新构建
eas build:download <build-id>
```

#### 5. 安装到手机

**方法 A：数据线**
```bash
# 连接手机，启用 USB 调试
adb install lingo-app.apk
```

**方法 B：云存储分享**
1. 上传 APK 到 Google Drive / 百度网盘
2. 生成分享链接
3. 手机下载并安装

**方法 C：直接传输**
1. 通过 QQ/微信/钉钉发送 APK 文件
2. 手机下载安装

---

## 🚀 快速对比

| 特性 | Expo Go | APK 安装包 |
|------|---------|------------|
| 难度 | ⭐ 超简单 | ⭐⭐ 简单 |
| 时间 | 2 分钟 | 10 分钟 |
| 分享 | ❌ 不可分享 | ✅ 可分享 |
| 离线使用 | ❌ 需联网 | ✅ 离线可用 |
| 适用场景 | 开发测试 | 分享测试 |

---

## 📌 推荐方案

### 快速测试自己看？
→ 用 **Expo Go**，2 分钟搞定

### 想分享给朋友/测试团队？
→ 用 **EAS Build 生成 APK**，10 分钟搞定

---

## ⚠️ 常见问题

### Q: Expo Go 无法连接？
**A:** 检查手机和电脑在同一 WiFi 网络

### Q: APK 安装失败？
**A:** Android 手机需要在设置中开启"允许安装未知来源应用"

### Q: iOS 如何安装？
**A:** iOS 无法直接安装 APK，需要：
1. 使用 Expo Go（推荐）
2. 使用 TestFlight 分发
3. 或者使用 EAS Build 构建 iOS 版本（需要 Apple Developer 账号，付费）

---

## 🎉 总结

**最简单的方式（推荐）**：
1. 手机安装 Expo Go
2. 电脑运行 `pnpm start`
3. 扫码连接

**需要分享的方式**：
1. 运行 `eas login` 登录
2. 运行 `eas build --platform android --profile preview`
3. 10 分钟后下载 APK 分享
