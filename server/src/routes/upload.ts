import express from 'express';
import multer from 'multer';
import StorageService from '@/utils/storage';

const router = express.Router();

// 配置 multer 用于接收文件
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制 10MB
});

/**
 * POST /api/v1/upload/image
 * 上传图片到对象存储
 *
 * Body (multipart/form-data):
 *   file: File - 图片文件
 *
 * Returns:
 *   {
 *     success: boolean,
 *     url: string - 图片签名 URL（有效期 7 天）
 *   }
 */
router.post('/image', upload.single('file'), async (req, res) => {
  try {
    // 检查是否有文件
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未找到文件' });
    }

    const { buffer, originalname, mimetype } = req.file;

    // 验证文件类型
    if (!mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, error: '仅支持图片文件' });
    }

    // 生成文件名（添加时间戳避免重复）
    const fileName = `posts/${Date.now()}_${originalname}`;

    // 上传到对象存储并获取签名 URL
    const imageUrl = await StorageService.uploadAndGetUrl(buffer, fileName, mimetype);

    res.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error('图片上传错误:', error);
    res.status(500).json({ success: false, error: '图片上传失败' });
  }
});

/**
 * POST /api/v1/upload/avatar
 * 上传头像到对象存储
 *
 * Body (multipart/form-data):
 *   file: File - 图片文件
 *
 * Returns:
 *   {
 *     success: boolean,
 *     url: string - 头像签名 URL（有效期 30 天）
 *   }
 */
router.post('/avatar', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未找到文件' });
    }

    const { buffer, originalname, mimetype } = req.file;

    if (!mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, error: '仅支持图片文件' });
    }

    // 头像存储在 avatars 目录
    const fileName = `avatars/${Date.now()}_${originalname}`;

    // 上传到对象存储，有效期 30 天
    const imageUrl = await StorageService.uploadAndGetUrl(buffer, fileName, mimetype);

    res.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error('头像上传错误:', error);
    res.status(500).json({ success: false, error: '头像上传失败' });
  }
});

// 错误处理中间件
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: '文件大小超过限制（最大 10MB）' });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  next(err);
});

export default router;
