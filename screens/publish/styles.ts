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
    publishButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.md,
    },
    publishButtonDisabled: {
      opacity: 0.5,
    },
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    textInput: {
      minHeight: 120,
      fontSize: 16,
      lineHeight: 24,
      textAlignVertical: 'top',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      backgroundColor: theme.backgroundDefault,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: Spacing.md,
      gap: Spacing.md,
    },
    imageItem: {
      width: (Spacing.md * 3 + 8) / 4,
      aspectRatio: 1,
      position: 'relative',
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      borderRadius: BorderRadius.md,
    },
    removeButton: {
      position: 'absolute',
      top: -6,
      right: -6,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    addImageButton: {
      width: 80,
      aspectRatio: 1,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundTertiary,
    },
    addImageText: {
      fontSize: 32,
      color: theme.textMuted,
    },
    addImageButtonLarge: {
      marginTop: Spacing.lg,
      paddingVertical: Spacing['3xl'],
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundTertiary,
    },
    uploadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.md,
      padding: Spacing.md,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.md,
    },
  });
};
