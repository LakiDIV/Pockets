import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "@/app/types/transaction";
import { colors, typography, spacing, layout } from "@/app/styles/shared";

interface TransactionCardProps {
  transaction: Transaction;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

// Define prop comparison function for memoization
const arePropsEqual = (
  prevProps: TransactionCardProps,
  nextProps: TransactionCardProps
) => {
  return (
    prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.amount === nextProps.transaction.amount &&
    prevProps.transaction.date === nextProps.transaction.date &&
    prevProps.transaction.description === nextProps.transaction.description &&
    prevProps.transaction.type === nextProps.transaction.type
  );
};

// Base component to be memoized
function TransactionCardBase({
  transaction,
  formatCurrency,
  formatDate,
}: TransactionCardProps) {
  // Memoize expensive calculations
  const isUpcoming = React.useMemo(
    () => new Date(transaction.date) > new Date(),
    [transaction.date]
  );

  // Memoize icon and badge details
  const { iconName, iconColor } = React.useMemo(() => {
    return {
      iconName: transaction.type === "Income"
        ? "arrow-up-circle-outline" as const
        : "arrow-down-circle-outline" as const,
      iconColor: transaction.type === "Income" ? "#86CB8B" : "#E38989"
    };
  }, [transaction.type]);

  return (
    <View style={[styles.transactionItem, styles.transactionItemSpacing]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconName}
          size={24}
          color={iconColor}
        />
      </View>
      <View style={styles.transactionDetails}>
        <View style={styles.descriptionRow}>
          <Text style={styles.descriptionText}>{transaction.description}</Text>
          {isUpcoming && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>Upcoming</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.amountDate}>
        <Text
          style={[
            styles.amountText,
            transaction.type === "Income"
              ? styles.incomeAmount
              : styles.expenseAmount,
          ]}
        >
          {transaction.type === "Income" ? "+" : "-"}
          {formatCurrency(transaction.amount).replace("-$", "$")}
        </Text>
        <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
      </View>
    </View>
  );
}

// Export the memoized component
export const TransactionCard = React.memo(TransactionCardBase, arePropsEqual);

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderRadius: layout.borderRadius.medium,
    backgroundColor: colors.surface,
  },
  transactionItemSpacing: {
    marginBottom: spacing.small,
  },
  iconContainer: {
    marginRight: spacing.medium,
  },
  transactionDetails: {
    flex: 1,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  descriptionText: {
    ...typography.body,
    flex: 1,
  },
  upcomingBadge: {
    backgroundColor: colors.income + '20', // Using income color with 20% opacity
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.small,
    borderWidth: 1,
    borderColor: colors.income + '40', // Using income color with 40% opacity
  },
  upcomingText: {
    ...typography.caption,
    color: colors.income,
    fontSize: 12,
    fontWeight: '600',
  },
  amountDate: {
    alignItems: "flex-end",
    marginLeft: spacing.small,
  },
  amountText: {
    ...typography.body,
    fontWeight: "bold",
  },
  dateText: typography.caption,
  incomeAmount: {
    color: colors.income,
  },
  expenseAmount: {
    color: colors.expense,
  },
});
