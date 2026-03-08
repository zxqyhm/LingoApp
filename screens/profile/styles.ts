import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      padding: Spacing.xl,
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: Spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    avatarLoading: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    editIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.backgroundRoot,
    },
    userInfo: {
      alignItems: 'center',
    },
    username: {
      marginBottom: Spacing.xs,
    },
    bio: {
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    languageTags: {
      flexDirection: 'row',
      gap: Spacing.sm,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    tag: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.md,
    },
    divider: {
      height: 1,
      marginVertical: Spacing.md,
    },
    settingsSection: {
      padding: Spacing.lg,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    section: {
      padding: Spacing.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.md,
    },
    empty: {
      padding: Spacing.xl,
      alignItems: 'center',
    },
    postCard: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
    },
    postContent: {
      marginBottom: Spacing.sm,
      lineHeight: 22,
    },
    postImages: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    postImage: {
      width: 80,
      height: 80,
      borderRadius: BorderRadius.md,
    },
    postTime: {
      marginTop: Spacing.sm,
    },
  });
};
