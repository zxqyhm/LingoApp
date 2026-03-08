# Lingo - 定位功能使用指南

## 📍 功能概述

Lingo 应用现已支持完整的定位功能，包括：
- ✅ 更新用户位置
- ✅ 获取附近用户
- ✅ 获取附近群组
- ✅ 获取附近动态
- ✅ 距离计算（Haversine 算法）

---

## 🔧 数据库更新

### 新增字段

#### users 表
```sql
latitude          varchar(20)   -- 纬度
longitude         varchar(20)   -- 经度
city              varchar(100)  -- 城市
country           varchar(100)  -- 国家
last_location_update timestamp   -- 最后定位更新时间
```

#### posts 表
```sql
latitude          varchar(20)   -- 纬度
longitude         varchar(20)   -- 经度
location_name     varchar(200)  -- 位置名称
```

#### groups 表
```sql
latitude          varchar(20)   -- 纬度
longitude         varchar(20)   -- 经度
city              varchar(100)  -- 城市
country           varchar(100)  -- 国家
```

---

## 🌐 API 接口

### 1. 更新用户位置

**接口**：`POST /api/v1/location/update`

**请求参数**：
```json
{
  "userId": "user-uuid",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "city": "北京",
  "country": "中国"
}
```

**响应**：
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "latitude": "39.9042",
    "longitude": "116.4074",
    "city": "北京",
    "country": "中国",
    "last_location_update": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. 获取附近用户

**接口**：`GET /api/v1/location/nearby-users`

**请求参数**：
- `lat`（必需）：用户纬度
- `lon`（必需）：用户经度
- `radius`（可选）：搜索半径（公里），默认 10
- `limit`（可选）：返回数量，默认 20
- `userId`（可选）：排除自己的用户 ID

**示例**：
```
GET /api/v1/location/nearby-users?lat=39.9042&lon=116.4074&radius=10&limit=20&userId=xxx
```

**响应**：
```json
{
  "success": true,
  "users": [
    {
      "id": "user-1",
      "username": "张三",
      "avatar_url": "https://...",
      "city": "北京",
      "country": "中国",
      "distance": 2.3,
      "native_language": "中文",
      "learning_languages": ["英语", "日语"]
    },
    {
      "id": "user-2",
      "username": "李四",
      "avatar_url": "https://...",
      "city": "北京",
      "country": "中国",
      "distance": 5.8,
      "native_language": "中文",
      "learning_languages": ["法语"]
    }
  ]
}
```

---

### 3. 获取附近群组

**接口**：`GET /api/v1/location/nearby-groups`

**请求参数**：
- `lat`（必需）：用户纬度
- `lon`（必需）：用户经度
- `radius`（可选）：搜索半径（公里），默认 50
- `limit`（可选）：返回数量，默认 20

**示例**：
```
GET /api/v1/location/nearby-groups?lat=39.9042&lon=116.4074&radius=50&limit=20
```

**响应**：
```json
{
  "success": true,
  "groups": [
    {
      "id": "group-1",
      "name": "北京英语学习群",
      "avatar_url": "https://...",
      "description": "大家一起学习英语",
      "member_count": 120,
      "city": "北京",
      "country": "中国",
      "distance": 3.5,
      "is_public": true
    },
    {
      "id": "group-2",
      "name": "朝阳区日语角",
      "avatar_url": "https://...",
      "description": "每周线下日语聚会",
      "member_count": 85,
      "city": "北京",
      "country": "中国",
      "distance": 8.2,
      "is_public": true
    }
  ]
}
```

---

### 4. 获取附近动态

**接口**：`GET /api/v1/location/nearby-posts`

**请求参数**：
- `lat`（必需）：用户纬度
- `lon`（必需）：用户经度
- `radius`（可选）：搜索半径（公里），默认 50
- `limit`（可选）：返回数量，默认 20

**示例**：
```
GET /api/v1/location/nearby-posts?lat=39.9042&lon=116.4074&radius=50&limit=20
```

**响应**：
```json
{
  "success": true,
  "posts": [
    {
      "id": "post-1",
      "content": "今天在三里屯遇到了很多外国朋友，练习了英语口语！",
      "media_urls": ["https://..."],
      "media_type": "image",
      "location_name": "北京市朝阳区三里屯",
      "distance": 1.5,
      "created_at": "2024-01-15T10:00:00Z",
      "users": {
        "id": "user-1",
        "username": "张三",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

---

### 5. 逆向地理编码

**接口**：`GET /api/v1/location/reverse-geocode`

**请求参数**：
- `lat`（必需）：纬度
- `lon`（必需）：经度

**示例**：
```
GET /api/v1/location/reverse-geocode?lat=39.9042&lon=116.4074
```

**响应**：
```json
{
  "success": true,
  "location": {
    "latitude": "39.9042",
    "longitude": "116.4074",
    "city": "北京",
    "country": "中国",
    "address": "北京市朝阳区"
  }
}
```

---

## 📱 前端集成指南

### 1. 安装依赖

```bash
cd /workspace/projects/client
npx expo install expo-location
```

### 2. 请求定位权限

```typescript
import * as Location from 'expo-location';

// 请求定位权限
const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('提示', '需要定位权限才能使用附近功能');
    return false;
  }

  return true;
};

// 获取当前位置
const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) return null;

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};
```

### 3. 更新用户位置

```typescript
const updateUserLocation = async (userId: string) => {
  const location = await getCurrentLocation();

  if (!location) return;

  // 调用逆向地理编码获取城市和（可选）
  const { data } = await fetch(
    `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/location/reverse-geocode?lat=${location.latitude}&lon=${location.longitude}`
  ).then(res => res.json());

  // 更新用户位置
  await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/location/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      latitude: location.latitude,
      longitude: location.longitude,
      city: data.location.city,
      country: data.location.country,
    }),
  });
};
```

### 4. 获取附近用户

```typescript
const getNearbyUsers = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/location/nearby-users?lat=${latitude}&lon=${longitude}&radius=10&limit=20`
  );

  const data = await response.json();
  return data.users;
};
```

### 5. 发布带位置的动态

```typescript
const createPostWithLocation = async (userId: string, content: string) => {
  const location = await getCurrentLocation();

  if (!location) return;

  const { data } = await fetch(
    `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/location/reverse-geocode?lat=${location.latitude}&lon=${location.longitude}`
  ).then(res => res.json());

  await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      content,
      latitude: location.latitude,
      longitude: location.longitude,
      locationName: data.location.address,
    }),
  });
};
```

---

## 🎯 使用场景

### 场景 1：发现附近的语言学习者

1. 用户打开"附近"页面
2. 应用自动获取当前位置
3. 展示附近 10 公内的语言学习者
4. 显示距离和共同学习的语言
5. 点击可发送消息或发起关注

### 场景 2：加入本地语言群组

1. 用户查看"附近群组"
2. 展示本地公开群组
3. 显示群组位置、距离、成员数
4. 点击可申请加入

### 场景 3：浏览附近动态

1. 用户查看"附近动态"
2. 展示附近的用户发布的内容
3. 显示发布位置和距离
4. 可互动（点赞、评论、分享）

### 场景 4：发布带位置的动态

1. 用户发布动态
2. 选择添加位置
3. 系统获取当前位置
4. 显示位置名称（如"北京市朝阳区"）
5. 发布后，附近用户可以看到

---

## 🛡️ 隐私保护

### 位置权限级别

1. **仅使用一次**：每次使用时询问
2. **使用时允许**：应用在前台时允许
3. **始终允许**：后台也允许

### 隐私设置

用户可以在设置中：
- 关闭定位功能
- 隐藏位置信息
- 选择谁可以看到位置
- 清除位置历史

### 数据保护

- 位置数据加密存储
- 仅用于附近功能
- 不与第三方共享
- 用户可随时删除

---

## 📊 距离计算算法

使用 **Haversine 公式**计算两点之间的球面距离：

```typescript
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

---

## 🚀 性能优化

### 1. 数据库索引

已在数据库中创建复合索引：
```sql
CREATE INDEX users_location_idx ON users(latitude, longitude);
CREATE INDEX posts_location_idx ON posts(latitude, longitude);
CREATE INDEX groups_location_idx ON groups(latitude, longitude);
```

### 2. 查询优化

- 限制返回数量（默认 20 条）
- 先查询有位置的数据，再计算距离
- 按距离排序，优先展示最近的

### 3. 缓存策略

- 缓存用户位置（5 分钟）
- 缓存附近用户列表（10 分钟）
- 位置更新时清除缓存

---

## ⚠️ 注意事项

1. **权限处理**：需要正确处理定位权限请求
2. **精度控制**：根据需求选择合适的定位精度
3. **耗电量**：频繁定位会消耗电量
4. **隐私保护**：确保用户知道位置如何使用
5. **网络连接**：定位需要网络连接

---

## 🎉 总结

定位功能为 Lingo 带来了以下价值：

1. **本地化社交**：发现附近的语言学习者
2. **群组发现**：快速加入本地语言群组
3. **内容探索**：浏览附近用户的动态
4. **线下活动**：组织线下语言交流活动
5. **增强互动**：基于位置的社交互动

---

**Lingo - 全球语言学习与社交应用** 🌍
