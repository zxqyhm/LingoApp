import Constants from 'expo-constants';

export const getEnv = () => {
  // 从 app.config.ts 的 extra 字段中获取环境变量
  const extra = Constants.expoConfig?.extra;
  
  return {
    backendBaseUrl: extra?.EXPO_PUBLIC_BACKEND_BASE_URL || process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://lingo-api-ttop.onrender.com',
  };
};

export const env = getEnv();
