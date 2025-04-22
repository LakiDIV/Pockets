import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "@/app/types/transaction";
import { colors, typography, spacing, layout } from "@/app/styles/shared";

interface TransactionCardProps {
  transaction: Transaction;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

export function TransactionCard({
  transaction,
  formatCurrency,
  formatDate,
}: TransactionCardProps) {
  return (
    <View style={[styles.transactionItem, styles.transactionItemSpacing]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            transaction.type === "Income"
              ? "arrow-up-circle-outline"
              : "arrow-down-circle-outline"
          }
          size={24}
          color={transaction.type === "Income" ? "#86CB8B" : "#E38989"}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.descriptionText}>{transaction.description}</Text>
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
  descriptionText: typography.body,
  amountDate: {
    alignItems: "flex-end",
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
