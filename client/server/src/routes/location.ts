import express from 'express';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const router = express.Router();
const client = getSupabaseClient();

/**
 * 计算两个经纬度之间的距离（单位：公里）
 * 使用 Haversine 公式
 */
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

/**
 * 更新用户位置
 * POST /api/v1/location/update
 */
router.post('/update', async (req, res) => {
  try {
    const { userId, latitude, longitude, city, country } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        error: '缺少必需参数：userId, latitude, longitude'
      });
    }

    const { data, error } = await client
      .from('users')
      .update({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        city: city || null,
        country: country || null,
        last_location_update: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('更新位置失败:', error);
      return res.status(500).json({ error: '更新位置失败' });
    }

    res.json({ success: true, user: data });
  } catch (error) {
    console.error('更新位置失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取附近用户
 * GET /api/v1/location/nearby-users?lat=xxx&lon=xxx&radius=10&limit=20
 */
router.get('/nearby-users', async (req, res) => {
  try {
    const { lat, lon, radius = 10, limit = 20, userId } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: '缺少必需参数：lat, lon'
      });
    }

    const userLat = parseFloat(lat as string);
    const userLon = parseFloat(lon as string);
    const radiusKm = parseFloat(radius as string);
    const limitNum = parseInt(limit as string);

    // 获取所有有位置的用户
    const { data: users, error } = await client
      .from('users')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(1000); // 先获取较多用户，再筛选

    if (error) {
      console.error('获取附近用户失败:', error);
      return res.status(500).json({ error: '获取附近用户失败' });
    }

    // 计算距离并筛选
    const nearbyUsers = users
      .filter(user => {
        // 排除自己
        if (userId && user.id === userId) return false;

        // 排除机器人
        if (user.is_bot) return false;

        // 计算距离
        const userLatNum = parseFloat(user.latitude || '0');
        const userLonNum = parseFloat(user.longitude || '0');
        const distance = calculateDistance(userLat, userLon, userLatNum, userLonNum);

        return distance <= radiusKm;
      })
      .map(user => {
        const userLatNum = parseFloat(user.latitude || '0');
        const userLonNum = parseFloat(user.longitude || '0');
        const distance = calculateDistance(userLat, userLon, userLatNum, userLonNum);

        return {
          ...user,
          distance: Math.round(distance * 10) / 10, // 保留一位小数
        };
      })
      .sort((a, b) => a.distance - b.distance) // 按距离排序
      .slice(0, limitNum); // 限制数量

    res.json({ success: true, users: nearbyUsers });
  } catch (error) {
    console.error('获取附近用户失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取附近群组
 * GET /api/v1/location/nearby-groups?lat=xxx&lon=xxx&radius=50&limit=20
 */
router.get('/nearby-groups', async (req, res) => {
  try {
    const { lat, lon, radius = 50, limit = 20 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: '缺少必需参数：lat, lon'
      });
    }

    const userLat = parseFloat(lat as string);
    const userLon = parseFloat(lon as string);
    const radiusKm = parseFloat(radius as string);
    const limitNum = parseInt(limit as string);

    // 获取所有有位置的公开群组
    const { data: groups, error } = await client
      .from('groups')
      .select('*')
      .eq('is_public', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(1000);

    if (error) {
      console.error('获取附近群组失败:', error);
      return res.status(500).json({ error: '获取附近群组失败' });
    }

    // 计算距离并筛选
    const nearbyGroups = groups
      .map(group => {
        const groupLat = parseFloat(group.latitude || '0');
        const groupLon = parseFloat(group.longitude || '0');
        const distance = calculateDistance(userLat, userLon, groupLat, groupLon);

        return {
          ...group,
          distance: Math.round(distance * 10) / 10,
        };
      })
      .filter(group => group.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limitNum);

    res.json({ success: true, groups: nearbyGroups });
  } catch (error) {
    console.error('获取附近群组失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取附近动态
 * GET /api/v1/location/nearby-posts?lat=xxx&lon=xxx&radius=50&limit=20
 */
router.get('/nearby-posts', async (req, res) => {
  try {
    const { lat, lon, radius = 50, limit = 20 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: '缺少必需参数：lat, lon'
      });
    }

    const userLat = parseFloat(lat as string);
    const userLon = parseFloat(lon as string);
    const radiusKm = parseFloat(radius as string);
    const limitNum = parseInt(limit as string);

    // 获取所有有位置的动态
    const { data: posts, error } = await client
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('获取附近动态失败:', error);
      return res.status(500).json({ error: '获取附近动态失败' });
    }

    // 计算距离并筛选
    const nearbyPosts = posts
      .map((post: any) => {
        const postLat = parseFloat(post.latitude || '0');
        const postLon = parseFloat(post.longitude || '0');
        const distance = calculateDistance(userLat, userLon, postLat, postLon);

        return {
          ...post,
          distance: Math.round(distance * 10) / 10,
        };
      })
      .filter((post: any) => post.distance <= radiusKm)
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, limitNum);

    res.json({ success: true, posts: nearbyPosts });
  } catch (error) {
    console.error('获取附近动态失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 逆向地理编码（根据经纬度获取城市和）
 * 注意：这里使用简单的实现，实际项目中应该使用 Google Maps API 或其他地理编码服务
 */
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: '缺少必需参数：lat, lon'
      });
    }

    // 这里只是一个示例，实际应该调用真实的地理编码 API
    // 比如使用 Google Maps Geocoding API、Mapbox API 等
    // 这里返回模拟数据

    res.json({
      success: true,
      location: {
        latitude: lat,
        longitude: lon,
        city: '北京', // 应该根据实际经纬度计算
        country: '中国',
        address: '北京市朝阳区',
      }
    });
  } catch (error) {
    console.error('逆向地理编码失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
