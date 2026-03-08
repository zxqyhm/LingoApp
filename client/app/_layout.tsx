import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from "@/contexts/AuthContext";
import { ColorSchemeProvider } from '@/hooks/useColorScheme';
import { LanguageProvider } from '@/contexts/LanguageContext';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其他想要忽略的警告信息
]);

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      try {
        // 隐藏启动屏
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('启动屏隐藏失败:', e);
      }
    };
    prepare();
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ColorSchemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark"></StatusBar>
            <Stack screenOptions={{
              // 设置所有页面的切换动画为从右侧滑入，适用于 iOS 和 Android
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              // 隐藏自带的头部
              headerShown: false
            }}>
              <Stack.Screen name="(tabs)" options={{ title: "" }} />
              <Stack.Screen name="detail" options={{ title: "" }} />
              <Stack.Screen name="publish" options={{ title: "" }} />
              <Stack.Screen name="login" options={{ title: "" }} />
              <Stack.Screen name="create-group" options={{ title: "创建群组" }} />
              <Stack.Screen name="group-chat" options={{ title: "群聊" }} />
              <Stack.Screen name="group-settings" options={{ title: "群组设置" }} />
            </Stack>
            <Toast />
          </GestureHandlerRootView>
        </ColorSchemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}