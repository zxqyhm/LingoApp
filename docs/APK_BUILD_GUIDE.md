# Lingo APK 打包指南

## 📦 方法 1：使用 Expo Application Services (EAS) - 推荐

### 步骤 1：安装 EAS CLI

```bash
npm install -g eas-cli
```

### 步骤 2：配置 EAS

```bash
cd /workspace/projects/client
eas login
```

### 步骤 3：初始化 EAS 配置

```bash
eas build:configure
```

### 步骤 4：构建 Android APK

```bash
# 开发版本
eas build --platform android --profile development

# 生产版本
eas build --platform android --profile preview

# 应用商店版本
eas build --platform android --profile production
```

### 步骤 5：下载 APK

构建完成后，Expo 会提供下载链接：
- 在 Expo 控制台查看构建状态
- 构建成功后会生成 APK 下载链接
- 点击链接下载 APK 到本地

---

## 📦 方法 2：本地构建 APK

### 前置要求

1. **安装 Android Studio**
   - 下载：https://developer.android.com/studio
   - 安装 Android SDK（API 34）
   - 配置环境变量：
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

2. **安装 Java JDK**
   - 推荐：JDK 17
   - 下载：https://adoptium.net/

### 步骤 1：预构建项目

```bash
cd /workspace/projects/client

# 清理缓存
npx expo prebuild --clean

# 预构建 Android
npx expo prebuild --platform android
```

### 步骤 2：构建 APK

```bash
cd android

# Debug 版本（快速）
./gradlew assembleDebug

# Release 版本（优化）
./gradlew assembleRelease
```

### 步骤 3：查找 APK

**Debug APK**：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK**：
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📦 方法 3：使用 Docker 构建（推荐用于 CI/CD）

### 步骤 1：创建 Dockerfile

在 `client/Dockerfile.android`：

```dockerfile
FROM circleci/android:api-30-node

WORKDIR /workspace

# 安装依赖
RUN npm install -g expo-cli eas-cli
COPY package*.json ./
RUN npm install

# 复制项目
COPY . .

# 构建配置
RUN eas build:configure

# 构建
CMD ["eas", "build", "--platform", "android", "--non-interactive"]
```

### 步骤 2：构建并运行

```bash
cd /workspace/projects/client

docker build -f Dockerfile.android -t lingox-android .
```

---

## 🔧 配置文件

### app.config.ts

确保配置正确：

```typescript
export default {
  expo: {
    name: 'Lingo',
    slug: 'lingo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    android: {
      package: 'com.lingo.app',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      permissions: [
        'INTERNET',
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'RECORD_AUDIO',
        'MODIFY_AUDIO_SETTINGS',
        'READ_CONTACTS',
        'WRITE_CONTACTS',
      ]
    },
    plugins: [
      'expo-av',
      'expo-camera',
      'expo-image-picker',
      'expo-media-library',
      '@react-native-firebase/app',
    ],
  }
};
```

### eas.json

创建 `client/eas.json`：

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

---

## 🚀 快速构建脚本

创建 `client/build-android.sh`：

```bash
#!/bin/bash

echo "🚀 开始构建 Android APK..."

# 检查环境
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI 未安装"
    echo "请运行: npm install -g eas-cli"
    exit 1
fi

# 登录 EAS
echo "📝 登录 EAS..."
eas login

# 构建配置
echo "⚙️ 配置 EAS..."
eas build:configure

# 构建
echo "📦 开始构建..."
eas build --platform android --profile preview

echo "✅ 构建完成！"
echo "📥 请在 Expo 控制台下载 APK"
```

使用方法：

```bash
chmod +x build-android.sh
./build-android.sh
```

---

## 📱 安装 APK

### 方法 1：ADB 安装

```bash
# 连接设备
adb devices

# 安装 APK
adb install app-release.apk

# 卸载
adb uninstall com.lingo.app
```

### 方法 2：直接传输

1. 将 APK 文件传输到手机
2. 在手机上打开文件管理器
3. 找到 APK 文件
4. 点击安装

### 方法 3：通过链接下载

1. 将 APK 上传到云存储（如 Google Drive）
2. 生成分享链接
3. 在手机浏览器中打开链接
4. 下载并安装

---

## 🔍 验证 APK

### 检查 APK 信息

```bash
# 使用 aapt
aapt dump badging app-release.apk

# 使用 keytool（如果已签名）
keytool -printcert -jarfile app-release.apk
```

### 测试安装

```bash
# 在模拟器中测试
emulator -avd <avd_name> &
adb install app-release.apk

# 在真机上测试
adb devices
adb -s <device_id> install app-release.apk
```

---

## ⚠️ 常见问题

### 问题 1：构建失败

**原因**：依赖冲突或配置错误

**解决方案**：
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install

# 重新构建
npx expo prebuild --clean
```

### 问题 2：签名错误

**原因**：缺少签名配置

**解决方案**：
创建 `client/android/app/release.keystore`：

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore release.keystore \
  -alias lingox \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

配置 `android/app/build.gradle`：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword 'your_password'
            keyAlias 'lingox'
            keyPassword 'your_password'
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

### 问题 3：APK 体积过大

**原因**：包含不必要的资源

**解决方案**：
1. 启用 ProGuard
2. 压缩图片资源
3. 移除未使用的代码

配置 `android/app/build.gradle`：

```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 📊 APK 优化

### 减小体积

1. **启用 ProGuard**：混淆和压缩代码
2. **压缩图片**：使用 WebP 格式
3. **按需加载**：使用动态导入
4. **移除未使用的依赖**：清理 package.json

### 提高性能

1. **启用 Hermes 引擎**：提升 JS 执行性能
2. **使用原生模块**：替代 JS 实现
3. **优化启动时间**：延迟加载非关键资源

---

## 🎯 推荐方案

**开发测试**：
- 使用 EAS 预览版本
- 快速迭代，无需本地配置

**生产发布**：
- 使用 EAS 生产版本
- 自动签名和优化
- 支持 Google Play

**CI/CD**：
- 使用 Docker 构建
- 自动化测试和部署

---

## 📞 技术支持

- 📖 Expo 文档：https://docs.expo.dev
- 🐛 EAS 文档：https://docs.expo.dev/build/introduction/
- 💬 Expo 社区：https://forums.expo.dev

---

**Lingo - 全球语言学习与社交应用** 🌍
