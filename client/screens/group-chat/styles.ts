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
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    securityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      paddingHorizontal: 6,
      paddingVertical: 2,
      backgroundColor: `${theme.accent}15`,
      borderRadius: 10,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageList: {
      flex: 1,
    },
    messageListContent: {
      padding: Spacing.md,
    },
    messageRow: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    messageRowSelf: {
      justifyContent: 'flex-end',
    },
    messageRowOther: {
      justifyContent: 'flex-start',
    },
    avatarSmall: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${theme.primary}10`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
    },
    messageContent: {
      maxWidth: '75%',
    },
    senderName: {
      marginBottom: 2,
    },
    messageBubble: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      marginBottom: 2,
    },
    messageBubbleSelf: {
      borderTopRightRadius: 4,
    },
    messageBubbleOther: {
      borderTopLeftRadius: 4,
    },
    messageTime: {
      fontSize: 11,
      marginTop: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
      borderTopWidth: 1,
      gap: Spacing.sm,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });
};
