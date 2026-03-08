import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/contexts/LanguageContext';
import LatestTab from './tabs/LatestTab';
import RecommendTab from './tabs/RecommendTab';
import NearbyTab from './tabs/NearbyTab';
import SelfieTab from './tabs/SelfieTab';
import FollowingTab from './tabs/FollowingTab';
import { Spacing } from '@/constants/theme';

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const layout = Dimensions.get('window');

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'latest', title: '最新' },
    { key: 'recommend', title: '推荐' },
    { key: 'nearby', title: '附近' },
    { key: 'selfie', title: '自拍' },
    { key: 'following', title: '关注' },
  ]);

  const renderScene = SceneMap({
    latest: LatestTab,
    recommend: RecommendTab,
    nearby: NearbyTab,
    selfie: SelfieTab,
    following: FollowingTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: theme.primary }}
      style={{ backgroundColor: theme.backgroundRoot }}
      tabStyle={{ width: 'auto', paddingHorizontal: Spacing.md }}
      activeColor={theme.primary}
      inactiveColor={theme.textMuted}
      renderLabel={({ route, color }: any) => (
        <ThemedText variant="body" color={color} style={{ fontWeight: '500' }}>
          {route.title}
        </ThemedText>
      )}
    />
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
      />
    </Screen>
  );
}
