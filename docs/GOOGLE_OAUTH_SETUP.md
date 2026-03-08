# Google OAuth 登录配置指南

## 概述
本文档指导如何为 Lingo 应用配置真实的 Google 账号登录功能。

---

## 前置要求
- [ ] Google 账号
- [ ] Expo 开发环境已配置

---

## 步骤 1：创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 记录**项目 ID**（后续会用到）

---

## 步骤 2：启用 Google+ API

1. 进入 **API & Services** → **Library**
2. 搜索 "Google+ API"
3. 点击并启用

---

## 步骤 3：配置 OAuth 同意屏幕

1. 进入 **API & Services** → **OAuth consent screen**
2. 选择用户类型：
   - 外部（External）：任何 Google 用户都可以登录
   - 内部（Internal）：仅限组织内用户（选择外部）

3. 填写应用信息：
   - 应用名称：Lingo
   - 用户支持电子邮件：your-email@example.com
   - 开发者联系信息：your-email@example.com

4. 添加测试用户（可选，发布前必填）

---

## 步骤 4：创建 OAuth 2.0 凭据

### Android 应用

1. 进入 **API & Services** → **Credentials**
2. 点击 **Create Credentials** → **OAuth client ID**
3. 应用类型选择：**Android**
4. 填写：
   - **包名**：查看 `client/app.config.ts` 中的 `android.package`
     ```
     com.anonymous.x7610833538652602409
     ```
   - **SHA-1 证书指纹**：
     ```bash
     cd /workspace/projects/client
     # 开发环境的 SHA-1
     eas credentials
     ```
     或使用调试密钥：
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```

5. 复制生成的 **Client ID**（以 `.apps.googleusercontent.com` 结尾）

### iOS 应用

1. 点击 **Create Credentials** → **OAuth client ID**
2. 应用类型选择：**iOS**
3. 填写：
   - **Bundle ID**：查看 `client/app.config.ts` 中的 `ios.bundleIdentifier`（默认无）
   - 添加 Bundle ID：`com.anonymous.x7610833538652602409`
4. 复制生成的 **Client ID**

### Web 应用（用于开发测试）

1. 点击 **Create Credentials** → **OAuth client ID**
2. 应用类型选择：**Web application**
3. 添加授权的重定向 URI：
   ```
   http://localhost:19006/
   https://42d11b18-215e-4ad0-a60e-c702f697ad3b.dev.coze.site/
   ```
4. 复制生成的 **Client ID**

---

## 步骤 5：配置环境变量

### 方式一：通过 Coze 环境变量（推荐）

在 Coze 项目配置中添加以下环境变量：

```bash
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=your-web-client-id.apps.googleusercontent.com
```

### 方式二：通过 .env 文件（开发环境）

在 `client/` 目录创建 `.env` 文件：

```bash
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=your-web-client-id.apps.googleusercontent.com
```

---

## 步骤 6：配置 app.config.ts

更新 `client/app.config.ts`，添加 Google 配置：

```typescript
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    // ... 其他配置
    plugins: [
      // ... 其他插件
      [
        "expo-auth-session",
        {
          redirectUri: "com.anonymous.x7610833538652602409:/oauthredirect"
        }
      ],
    ],
  };
};
```

---

## 步骤 7：测试登录

1. 重启 Expo 服务
2. 在登录页面点击 "Google 登录"
3. 系统会跳转到 Google 授权页面
4. 授权成功后返回应用

---

## 常见问题

### Q1: 报错 "redirect_uri_mismatch"
**A:** 检查 OAuth 客户端配置的重定向 URI 是否与实际使用的匹配。

### Q2: 开发环境无法使用 Google 登录
**A:** 确保在 Google Cloud Console 中添加了 Web 应用的客户端 ID，并配置了正确的重定向 URI。

### Q3: 发布到应用商店后无法登录
**A:** 需要为生产版本（使用发布密钥签名）创建新的 OAuth 客户端 ID，并更新 SHA-1 指纹。

---

## 参考资料

- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Expo Auth Session 文档](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Cloud Console](https://console.cloud.google.com/)
