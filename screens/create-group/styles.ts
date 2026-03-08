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
    submitButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.md,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    formGroup: {
      marginBottom: Spacing.lg,
    },
    label: {
      marginBottom: Spacing.sm,
      fontWeight: '600',
    },
    input: {
      height: 48,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      fontSize: 16,
    },
    textArea: {
      minHeight: 100,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    section: {
      marginTop: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
    },
    settingInfo: {
      flex: 1,
      marginRight: Spacing.md,
    },
    tips: {
      flexDirection: 'row',
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      marginTop: Spacing.md,
    },
  });
};
