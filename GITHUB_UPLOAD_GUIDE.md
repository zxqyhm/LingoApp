# GitHub 仓库创建和代码上传超详细指南

## 📋 准备工作

你已经有：
- ✅ GitHub 账号：zxqyhm
- ✅ 项目代码：我会在云端帮你准备

---

## 步骤 1：在 GitHub 上创建仓库（3分钟）

### 1.1 登录 GitHub

1. **访问 GitHub**
   - 打开浏览器
   - 访问：https://github.com

2. **登录**
   - 点击右上角"Sign in"
   - 输入用户名：zxqyhm
   - 输入密码
   - 点击"Sign in"

---

### 1.2 创建新仓库

1. **找到创建仓库入口**
   - 登录后，页面右上角有个 **+** 号按钮
   - 点击 **+** 号
   - 在下拉菜单中选择 **"New repository"**

2. **填写仓库信息**

   **Repository name（仓库名）**
   - 输入：`lingo`
   - 注意：小写

   **Description（描述）**
   - 输入：`Lingo - Global Language Learning and Social App`

   **选择仓库类型**
   - ⚠️ **重要**：选择 **"Public"**（公开仓库）
   - 如果你选了 "Private"（私有），后面克隆可能需要密码

   **其他选项**
   - 不要勾选任何选项（保持默认）
   - 不要勾选 "Initialize this repository with a README"
   - 不要勾选 "Add .gitignore"
   - 不要勾选 "Choose a license"

3. **创建仓库**
   - 滚动到页面底部
   - 点击绿色的 **"Create repository"** 按钮

---

### 1.3 创建成功

创建成功后，会看到一个页面，显示：
- 仓库地址
- 命令行操作指引

**你的仓库地址应该是：**
```
https://github.com/zxqyhm/lingo.git
```

**记下这个地址，后面会用到！**

---

## 步骤 2：在云端准备代码（我来做）

我会在云端环境中：

1. **初始化 Git 仓库**
2. **添加所有文件**
3. **提交代码**
4. **推送到你的 GitHub 仓库**

但首先，我需要在 GitHub 上获得访问权限。

---

## 🚀 方案 A：使用 Personal Access Token（推荐）

### 步骤 2.1：创建 GitHub Personal Access Token

这是 GitHub 推荐的认证方式。

#### 2.1.1 访问设置

1. **登录 GitHub**
   - 访问：https://github.com
   - 登录账号：zxqyhm

2. **进入设置**
   - 点击右上角你的头像
   - 在下拉菜单中选择 **"Settings"**

#### 2.1.2 创建 Token

1. **访问 Developer Settings**
   - 在设置页面左侧菜单
   - 向下滚动找到 **"Developer settings"**
   - 点击进入

2. **访问 Personal Access Tokens**
   - 在左侧菜单
   - 点击 **"Personal access tokens"**
   - 然后点击 **"Tokens (classic)"**

3. **生成新 Token**
   - 点击 **"Generate new token (classic)"** 按钮
   - 可能会要求输入密码

4. **填写 Token 信息**

   **Note（备注）**
   - 输入：`lingo-build`
   - 或者：`lingo project`

   **Expiration（过期时间）**
   - 选择：**"No expiration"**（永不过期）
   - 或者选择：**"30 days"**（30天）

   **Scopes（权限）**
   - ⚠️ **重要**：勾选以下权限：
     - ☑️ `repo`（完整仓库访问权限）
     - ☑️ `workflow`（工作流权限）
   - 其他不需要勾选

5. **生成 Token**
   - 点击页面底部的绿色按钮 **"Generate token"**

6. **复制 Token**
   - ⚠️ **只显示一次！**
   - Token 会显示为一串字符串，例如：
     ```
     ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - **立即复制**，点击 "Copy" 按钮
   - 保存到一个安全的地方（记事本、密码管理器等）
   - 如果没复制，需要重新生成

---

### 步骤 2.2：告诉我 Token

**把 Token 发给我，格式如下：**

```
Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

或者直接粘贴 Token 即可。

---

## 🚀 方案 B：使用 SSH Key（高级，可选）

如果你熟悉 SSH，也可以使用 SSH Key。但如果你是0基础，**推荐用方案 A（Token）**。

---

## 🎯 接下来

**收到你的 Token 后，我会：**

1. ✅ 使用 Token 访问你的 GitHub
2. ✅ 在云端初始化 Git 仓库
3. ✅ 添加所有文件
4. ✅ 提交代码
5. ✅ 推送到 `https://github.com/zxqyhm/lingo.git`
6. ✅ 告诉你上传成功

---

## 📝 重要提醒

### 关于 Token：

- ⚠️ **Token 只显示一次**，复制后妥善保存
- ⚠️ **不要分享给任何人**，除了我（因为我需要用它上传代码）
- ⚠️ 如果泄露，可以立即删除并重新生成
- ⚠️ 建议定期更换 Token

### 保存 Token 的方式：

- 记事本（最简单）
- 密码管理器（推荐）
- 纸质记录（安全但容易丢失）

---

## ❓ 遇到问题？

### 问题 1："Generate new token" 按钮在哪里？

**解答：**
- 在 GitHub 设置页面
- 左侧菜单 → Developer settings → Personal access tokens → Tokens (classic)
- 页面顶部右侧有 "Generate new token (classic)" 按钮

### 问题 2：没有勾选 repo 权限怎么办？

**解答：**
- Token 可以重新生成
- 或者删除当前 Token，重新创建一个

### 问题 3：Token 太长，不好复制怎么办？

**解答：**
- 点击 "Copy" 按钮直接复制
- 或者手动选中，按 Ctrl+C（Windows）或 Command+C（Mac）

---

## ✅ 准备好了吗？

现在按照上面的步骤：

1. **登录 GitHub**
2. **创建仓库**（名为 `lingo`）
3. **创建 Personal Access Token**
4. **把 Token 发给我**

**完成后，回复我：**
```
Token 已生成：[你的Token]
```

收到后，我立即帮你上传代码！ 🚀
