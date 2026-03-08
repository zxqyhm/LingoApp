import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing['5xl'],
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: Spacing['5xl'],
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: BorderRadius.xl,
      backgroundColor: `${theme.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    appName: {
      fontSize: 40,
      fontWeight: '700',
      marginBottom: Spacing.md,
    },
    appDesc: {
      fontSize: 16,
      marginBottom: Spacing.xl,
    },
    loginButtons: {
      gap: Spacing.lg,
    },
    loginButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg,
      gap: Spacing.md,
    },
    phoneButton: {
      backgroundColor: theme.primary,
    },
    wechatButton: {
      backgroundColor: '#07C160',
    },
    googleButton: {
      backgroundColor: '#DB4437',
    },
    appleButton: {
      backgroundColor: '#000000',
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    footer: {
      marginTop: Spacing['3xl'],
      alignItems: 'center',
    },
  });
};
