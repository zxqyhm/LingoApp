import { useMemo } from 'react';
import { useColorScheme } from './useColorScheme';
import { Colors, Theme } from '@/constants/theme';

export function useTheme() {
  const colorScheme = useColorScheme();

  const theme = useMemo<Theme>(() => {
    return colorScheme === 'dark' ? Colors.dark : Colors.light;
  }, [colorScheme]);

  const isDark = useMemo(() => {
    return colorScheme === 'dark';
  }, [colorScheme]);

  return {
    theme,
    isDark,
    colorScheme,
  };
}