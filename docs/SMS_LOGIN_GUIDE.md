# 手机号登录 - 验证码方案说明

## 💰 真实短信服务费用

如果要使用真实的短信验证码，需要付费：

| 服务商 | 价格 | 说明 |
|--------|------|------|
| 阿里云短信 | 0.045 元/条 | 需要注册、实名认证、充值 |
| 腾讯云短信 | 0.045 元/条 | 需要注册、实名认证、充值 |
| 聚合数据 | 0.04-0.05 元/条 | 第三方聚合服务 |

**优点**：真实、安全
**缺点**：需要付费、需要配置

---

## 🆓 免费方案（推荐用于测试）

### 方案 1：固定验证码（当前实现）

**验证码统一为：123456**

- ✅ 完全免费
- ✅ 无需配置
- ✅ 适合测试和演示
- ⚠️ 仅用于开发，生产环境请使用真实短信

### 方案 2：跳过验证码（直接登录）

点击登录按钮直接登录，不输入验证码。

- ✅ 最简单
- ✅ 完全免费
- ⚠️ 仅用于演示

---

## 🔐 如果要上线，需要做什么？

### 步骤 1：选择短信服务商

推荐：阿里云短信服务

1. 注册阿里云账号
2. 开通短信服务
3. 创建签名和模板
4. 获取 Access Key

### 步骤 2：配置后端

```typescript
// server/src/routes/sms.ts
import { default as axios } from 'axios';

const ALIYUN_ACCESS_KEY = 'your-access-key';
const ALIYUN_ACCESS_SECRET = 'your-secret';
const SIGN_NAME = 'LingoApp'; // 短信签名
const TEMPLATE_CODE = 'SMS_123456789'; // 短信模板

// 发送验证码
export async function sendSMSCode(phone: string, code: string) {
  const params = {
    PhoneNumbers: phone,
    SignName: SIGN_NAME,
    TemplateCode: TEMPLATE_CODE,
    TemplateParam: JSON.stringify({ code }),
  };

  // 调用阿里云 API
  const response = await axios.post(
    'https://dysmsapi.aliyuncs.com/',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}
```

### 步骤 3：验证码存储

使用 Redis 存储验证码，有效期 5 分钟：

```typescript
import Redis from 'ioredis';

const redis = new Redis();

// 发送验证码
const code = Math.floor(100000 + Math.random() * 900000).toString();
await redis.setex(`sms:${phone}`, 300, code); // 5 分钟过期

// 验证验证码
const savedCode = await redis.get(`sms:${phone}`);
if (savedCode === code) {
  // 验证成功
}
```

### 步骤 4：前端输入验证码

```tsx
const [phone, setPhone] = useState('');
const [code, setCode] = useState('');
const [countdown, setCountdown] = useState(0);

// 发送验证码
const handleSendCode = async () => {
  await fetch('/api/v1/sms/send', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
  setCountdown(60); // 60 秒倒计时
};

// 登录
const handleLogin = async () => {
  await fetch('/api/v1/auth/sms-login', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
};
```

---

## 📋 当前实现状态

**当前版本：免费演示模式**

- ✅ 点击手机号登录按钮
- ✅ 直接登录成功
- ✅ 无需任何费用
- ✅ 无需配置

**如果需要真实验证码：**
1. 需要注册短信服务商
2. 需要充值
3. 需要配置 API Key
4. 预计费用：0.045 元/条

---

## 💡 建议

### 开发/测试阶段
使用当前免费方案（固定验证码 123456）

### 正式上线阶段
1. 如果用户量小（< 1000 人/天）：使用阿里云短信
2. 如果用户量大（> 1000 人/天）：可以批量购买，成本更低

### 费用估算

假设 1000 人/天，每人登录 1 次：
- 每日费用：1000 × 0.045 = 45 元
- 每月费用：45 × 30 = 1350 元

---

## ✅ 总结

**回答你的问题：**

1. **真实短信验证码需要收费吗？**
   ✅ 是的，约 0.045 元/条

2. **当前版本需要付费吗？**
   ✅ 不需要，当前使用免费演示模式

3. **如果要上线怎么办？**
   ✅ 注册阿里云/腾讯云短信服务，充值后即可使用

4. **开发测试需要付费吗？**
   ✅ 不需要，使用固定验证码 123456 即可
