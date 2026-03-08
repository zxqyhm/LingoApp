import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    createButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    emptyButton: {
      marginTop: Spacing.xl,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    list: {
      flex: 1,
    },
    groupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: BorderRadius.lg,
      backgroundColor: `${theme.primary}10`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    groupText: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    groupDesc: {
      fontSize: 13,
      marginBottom: 4,
    },
    groupMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};
