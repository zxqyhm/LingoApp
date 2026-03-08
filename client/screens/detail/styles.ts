import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.md,
    },
    backButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.sm,
    },
    authorSection: {
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    authorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: Spacing.md,
    },
    authorDetails: {
      flex: 1,
    },
    contentSection: {
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    content: {
      marginBottom: Spacing.md,
    },
    translateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    translatedSection: {
      padding: Spacing.md,
      borderRadius: BorderRadius.sm,
      marginTop: Spacing.sm,
    },
    translatedLabel: {
      marginBottom: Spacing.xs,
    },
    translatedContent: {
      lineHeight: 20,
    },
    mediaSection: {
      marginBottom: Spacing.sm,
    },
    mediaItem: {
      width: '100%',
      height: 300,
    },
    actionSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    actionText: {
      marginTop: 2,
    },
    commentsSection: {
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    commentsTitle: {
      marginBottom: Spacing.md,
    },
    commentItem: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: Spacing.sm,
    },
    commentContent: {
      flex: 1,
    },
    commentAuthor: {
      marginBottom: 2,
    },
    commentText: {
      marginBottom: 4,
      lineHeight: 20,
    },
    commentTime: {
      marginTop: 2,
    },
    noComments: {
      textAlign: 'center',
      paddingVertical: Spacing.lg,
    },
    commentInputSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderTopWidth: 1,
    },
    commentInput: {
      flex: 1,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: 20,
      marginRight: Spacing.sm,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
