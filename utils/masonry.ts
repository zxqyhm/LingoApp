export interface MasonryItem {
  id: string;
  imageUrl: string;
  aspectRatio: number;
  title?: string;
  user?: {
    username: string;
    avatarUrl?: string;
  };
  likesCount?: number;
  commentsCount?: number;
}

// 视觉修正后的高度计算器
export function getOptimizedDimensions(
  originalAspectRatio: number,
  columnWidth: number
) {
  // Visual V2 核心优化：拉大高低反差范围
  // Min 0.5: 允许最高为宽度的 2 倍 (长卡片) -> 制造流动感
  // Max 2.0: 允许最扁为宽度的 0.5 倍 (短卡片) -> 制造断层
  const CLAMPED_RATIO = Math.min(Math.max(originalAspectRatio, 0.5), 2.0);

  return {
    height: columnWidth / CLAMPED_RATIO,
    isClamped: originalAspectRatio < 0.5,
  };
}

// 贪心分配算法 (Greedy Layout)
export function distributeItems<T extends MasonryItem>(
  items: T[],
  columnWidth: number,
  columns = 2
) {
  const FOOTER_HEIGHT = 120; // 标题+头像+操作按钮区域高度

  const columnArrays: T[][] = Array.from({ length: columns }, () => []);
  const columnHeights: number[] = Array(columns).fill(0);

  items.forEach((item) => {
    const { height: imgHeight } = getOptimizedDimensions(item.aspectRatio || 1, columnWidth);
    const totalItemHeight = imgHeight + FOOTER_HEIGHT;

    // 永远放入当前最矮的那一列
    const shortestIndex = columnHeights.indexOf(Math.min(...columnHeights));

    columnArrays[shortestIndex].push(item);
    columnHeights[shortestIndex] += totalItemHeight;
  });

  return columnArrays;
}
