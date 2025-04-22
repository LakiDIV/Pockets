import { View, Text, StyleSheet } from "react-native";
import { Account } from "@/app/types/account";

interface AccountHeaderProps {
  account: Account | null;
  balance: number;
  formatCurrency: (value: number) => string;
}

export function AccountHeader({ account, balance, formatCurrency }: AccountHeaderProps) {
  return (
    <View style={styles.accountInfoContainer}>
      <Text style={styles.accountName}>{account?.name}</Text>
      <Text style={[styles.balanceAmount, balance < 0 && styles.negativeBalance]}>
        {formatCurrency(balance)}
      </Text>
      <Text style={styles.balanceLabel}>Total Balance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  accountInfoContainer: {
    alignItems: "flex-start",
    marginTop: 40,
    marginBottom: 40,
  },
  accountName: {
    fontSize: 20,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 20,
    color: "#AAAAAA",
  },
  negativeBalance: {
    color: "#E38989",
  },
}); 