import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    tabBar: {
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    activeTab: {
      fontWeight: '600',
    },
    inactiveTab: {
      fontWeight: '400',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      gap: Spacing.md,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      gap: 6,
    },
    filterText: {
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.md,
      borderBottomWidth: 1,
    },
    modalBody: {
      padding: Spacing.md,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: Spacing.md,
      gap: Spacing.md,
      borderTopWidth: 1,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: 12,
      alignItems: 'center',
    },
    filterSection: {
      marginBottom: Spacing.lg,
    },
    filterSectionTitle: {
      marginBottom: Spacing.sm,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    filterOption: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    minorLanguagesContainer: {
      marginTop: Spacing.sm,
      gap: Spacing.xs,
    },
    minorLanguageOption: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: 8,
      marginLeft: Spacing.md,
    },
  });
};