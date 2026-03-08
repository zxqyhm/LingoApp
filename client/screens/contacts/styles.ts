import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      height: 44,
    },
    searchIcon: {
      marginRight: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      marginLeft: Spacing.xs,
    },
    section: {
      paddingHorizontal: Spacing.md,
      marginTop: Spacing.md,
    },
    sectionTitle: {
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    groupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.xs,
    },
    groupAvatar: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    groupInfo: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    groupName: {
      marginBottom: Spacing.xs,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.xs,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: Spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#22c55e',
      borderWidth: 2,
      borderColor: theme.backgroundDefault,
    },
    contactInfo: {
      flex: 1,
    },
    contactNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    contactName: {
      flex: 1,
    },
    languageBadge: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
      marginLeft: Spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing['5xl'],
    },
    emptyText: {
      marginTop: Spacing.md,
    },
    emptyHint: {
      marginTop: Spacing.xs,
    },
  });
};
