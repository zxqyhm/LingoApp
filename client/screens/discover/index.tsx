import React, { useState, useMemo } from 'react';
import { View, Dimensions, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

// 导入Tab组件
import LatestTab from './tabs/LatestTab';
import RecommendTab from './tabs/RecommendTab';
import NearbyTab from './tabs/NearbyTab';
import SelfieTab from './tabs/SelfieTab';
import GenderTab from './tabs/GenderTab';

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const layout = Dimensions.get('window');

  const [index, setIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const [routes] = useState([
    { key: 'recommended', title: '推荐' },
    { key: 'latest', title: '最新' },
    { key: 'following', title: '关注' },
    { key: 'nearby', title: '附近' },
    { key: 'selfie', title: '自拍' },
  ]);

  const renderScene = SceneMap({
    recommended: RecommendedTab,
    latest: LatestTab,
    following: FollowingTab,
    nearby: NearbyTab,
    selfie: SelfieTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: theme.primary }}
      style={[styles.tabBar, { backgroundColor: theme.backgroundRoot }]}
      tabStyle={{ width: 'auto', paddingHorizontal: Spacing.md }}
      activeColor={theme.primary}
      inactiveColor={theme.textMuted}
      renderLabel={({ route, focused, color }: any) => (
        <ThemedText
          variant="body"
          color={color}
          style={focused ? styles.activeTab : styles.inactiveTab}
        >
          {route.title}
        </ThemedText>
      )}
    />
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot}>
      {/* 顶部搜索栏和筛选按钮 */}
      <View style={[styles.header, { backgroundColor: theme.backgroundRoot, borderBottomColor: theme.border }]}>
        {/* 搜索框 */}
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundTertiary }]}>
          <FontAwesome6 name="magnifying-glass" size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="搜索用户或动态..."
            placeholderTextColor={theme.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* 筛选按钮 */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <FontAwesome6 name="filter" size={20} color={theme.primary} />
          <ThemedText variant="caption" color={theme.primary} style={styles.filterText}>筛选</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Tab 内容 */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
      />

      {/* 筛选弹窗 */}
      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />
    </Screen>
  );
}

// 筛选弹窗组件
function FilterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 大洲选项
  const continents = ['全部', '亚洲', '美洲', '欧洲', '非洲', '大洋洲'];

  // 主要语言选项（联合国6种官方语言 + 日语 + 韩语 + 德语 + 小语种）
  const mainLanguages = [
    { name: '全部', value: 'all' },
    { name: '英语', value: 'english' },
    { name: '汉语', value: 'chinese' },
    { name: '西班牙语', value: 'spanish' },
    { name: '法语', value: 'french' },
    { name: '阿拉伯语', value: 'arabic' },
    { name: '俄语', value: 'russian' },
    { name: '日语', value: 'japanese' },
    { name: '韩语', value: 'korean' },
    { name: '德语', value: 'german' },
    { name: '小语种 ▼', value: 'others', isExpandable: true },
  ];

  // 小语种列表
  const minorLanguages = [
    '意大利语', '葡萄牙语', '荷兰语', '瑞典语', '挪威语', '丹麦语', '芬兰语',
    '波兰语', '乌克兰语', '捷克语', '匈牙利语', '土耳其语', '希腊语', '希伯来语',
    '印地语', '乌尔都语', '孟加拉语', '泰语', '越南语', '印尼语', '马来语',
    '他加禄语', '斯瓦希里语', '豪萨语', '约鲁巴语', '波斯语', '普什图语',
    '泰米尔语', '泰卢固语', '卡纳达语', '马拉地语', '古吉拉特语', '旁遮普语',
    '缅甸语', '高棉语', '老挝语', '蒙古语', '哈萨克语', '乌兹别克语', '阿姆哈拉语',
    '索马里语', '豪萨语', '约鲁巴语'
  ];

  const [selectedContinent, setSelectedContinent] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [showMinorLanguages, setShowMinorLanguages] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <ThemedText variant="h3" color={theme.textPrimary}>筛选</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome6 name="xmark" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <FilterSection title="附近距离" options={['全部', '1km内', '5km内', '10km内', '50km内']} />
            <FilterSection title="年龄" options={['全部', '18-25', '26-35', '36-45', '46+']} />
            <FilterSection title="性别" options={['全部', '男', '女']} />
            <FilterSection
              title="大洲"
              options={continents}
              selected={selectedContinent}
              onSelect={setSelectedContinent}
            />
            <View style={styles.filterSection}>
              <ThemedText variant="bodyMedium" color={theme.textPrimary} style={styles.filterSectionTitle}>正在学习的语言</ThemedText>
              <View style={styles.filterOptions}>
                {mainLanguages.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterOption,
                      selectedLanguage === index && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => {
                      setSelectedLanguage(index);
                      if (item.isExpandable) {
                        setShowMinorLanguages(!showMinorLanguages);
                      }
                    }}
                  >
                    <ThemedText
                      variant="caption"
                      color={selectedLanguage === index ? theme.buttonPrimaryText : theme.textSecondary}
                    >
                      {item.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 小语种展开列表 */}
              {showMinorLanguages && (
                <View style={styles.minorLanguagesContainer}>
                  {minorLanguages.map((lang, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.minorLanguageOption,
                        { backgroundColor: theme.backgroundTertiary }
                      ]}
                    >
                      <ThemedText variant="caption" color={theme.textSecondary}>
                        {lang}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.modalButton, { borderColor: theme.border }]}
              onPress={() => {
                setSelectedContinent(0);
                setSelectedLanguage(0);
              }}
            >
              <ThemedText variant="body" color={theme.textSecondary}>重置</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={onClose}
            >
              <ThemedText variant="body" color={theme.buttonPrimaryText}>确认</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// 筛选部分组件
function FilterSection({ title, options, selected, onSelect }: any) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.filterSection}>
      <ThemedText variant="bodyMedium" color={theme.textPrimary} style={styles.filterSectionTitle}>{title}</ThemedText>
      <View style={styles.filterOptions}>
        {options.map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterOption,
              selected === index && { backgroundColor: theme.primary }
            ]}
            onPress={() => onSelect?.(index)}
          >
            <ThemedText
              variant="caption"
              color={selected === index ? theme.buttonPrimaryText : theme.textSecondary}
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}