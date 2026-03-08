import { ExpoConfig, ConfigContext } from 'expo/config';

const appName = 'LingoTalk';
const projectId = process.env.COZE_PROJECT_ID || process.env.EXPO_PUBLIC_COZE_PROJECT_ID;
const slugAppName =  'myapp';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    "owner": "zxqyhm",
    "name": appName,
    "slug": slugAppName,
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "extra": {
      "eas": {
        "projectId": "d9324e3c-dd6f-47e5-90bf-b3b47b325005"
      },
      "EXPO_PUBLIC_BACKEND_BASE_URL": "https://lingo-api-ttop.onrender.com"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": `com.anonymous.x${projectId || '0'}`
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      process.env.EXPO_PUBLIC_BACKEND_BASE_URL ? [
        "expo-router",
        {
          "origin": process.env.EXPO_PUBLIC_BACKEND_BASE_URL
        }
      ] : 'expo-router',
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": `允许LingoVibe App访问您的相册，以便您上传或保存图片。`,
          "cameraPermission": `允许LingoVibe App使用您的相机，以便您直接拍摄照片上传。`,
          "microphonePermission": `允许LingoVibe App访问您的麦克风，以便您拍摄带有声音的视频。`
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": `LingoVibe App需要访问您的位置以提供周边服务及导航功能。`
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": `LingoVibe App需要访问相机以拍摄照片和视频。`,
          "microphonePermission": `LingoVibe App需要访问麦克风以录制视频声音。`,
          "recordAudioAndroid": true
        }
      ],
      "expo-web-browser",
      "expo-secure-store",
      "expo-localization"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}