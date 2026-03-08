# Expo Token 获取步骤

## 方法 1：浏览器获取 Token（推荐）

1. 访问：https://expo.dev/accounts/zxqyhm/settings/access-tokens
2. 登录你的 Expo 账号（zxqyhm@163.com）
3. 点击 "Create new token"
4. 输入 token 名称（如：lingo-build）
5. 复制生成的 token
6. 告诉我 token，我帮你构建

## 方法 2：使用 Expo CLI

在本地电脑执行：
```bash
npx expo login
```
然后执行：
```bash
npx expo whoami --json
```
这会显示 token 信息
