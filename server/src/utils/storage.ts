import { S3Storage } from 'coze-coding-dev-sdk';

/**
 * 对象存储工具类
 * 用于文件上传、下载、删除等操作
 */
class StorageService {
  private static instance: S3Storage;

  /**
   * 获取 S3Storage 单例
   */
  public static getInstance(): S3Storage {
    if (!StorageService.instance) {
      StorageService.instance = new S3Storage({
        endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
        accessKey: '',
        secretKey: '',
        bucketName: process.env.COZE_BUCKET_NAME,
        region: 'cn-beijing',
      });
    }
    return StorageService.instance;
  }

  /**
   * 上传文件并返回签名 URL
   * @param fileContent 文件二进制内容
   * @param fileName 文件名（建议包含路径，如 posts/xxx.jpg）
   * @param contentType MIME 类型
   * @returns 签名 URL
   */
  public static async uploadAndGetUrl(
    fileContent: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const storage = StorageService.getInstance();

    // 上传文件，获取返回的 key（重要：必须使用返回的 key，而非传入的 fileName）
    const fileKey = await storage.uploadFile({
      fileContent,
      fileName,
      contentType,
    });

    // 生成签名 URL，有效期 7 天
    const signedUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 7 * 24 * 3600, // 7 天
    });

    return signedUrl;
  }

  /**
   * 仅上传文件，返回对象 key（用于持久化存储）
   * @param fileContent 文件二进制内容
   * @param fileName 文件名
   * @param contentType MIME 类型
   * @returns 对象存储的 key
   */
  public static async uploadOnly(
    fileContent: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const storage = StorageService.getInstance();

    const fileKey = await storage.uploadFile({
      fileContent,
      fileName,
      contentType,
    });

    return fileKey;
  }

  /**
   * 根据 key 生成签名 URL
   * @param fileKey 对象存储的 key
   * @param expireTime 有效期（秒），默认 7 天
   * @returns 签名 URL
   */
  public static async getUrl(
    fileKey: string,
    expireTime: number = 7 * 24 * 3600
  ): Promise<string> {
    const storage = StorageService.getInstance();

    return storage.generatePresignedUrl({
      key: fileKey,
      expireTime,
    });
  }

  /**
   * 删除文件
   * @param fileKey 对象存储的 key
   * @returns 是否删除成功
   */
  public static async deleteFile(fileKey: string): Promise<boolean> {
    const storage = StorageService.getInstance();

    return storage.deleteFile({ fileKey });
  }
}

export default StorageService;
