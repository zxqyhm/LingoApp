import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';

export default function DetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen backgroundColor={theme.backgroundRoot}>
      <View style={styles.container}>
        <ThemedText variant="h3">内容详情</ThemedText>
        <ThemedText>点赞、评论、转发页面</ThemedText>
      </View>
    </Screen>
  );
}

import { useMemo } from 'react';
