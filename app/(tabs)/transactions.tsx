import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useCallback, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StorageUtils } from "@/app/utils/storage";
import { Transaction } from "@/app/types/transaction";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = useCallback(async () => {
    const allTransactions = await StorageUtils.getTransactions();
    // Sort transactions by date (most recent first)
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(sortedTransactions);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-$' : '$';
    return `${prefix}${Math.abs(value).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Transactions</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
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
              <Text style={styles.descriptionText}>
                {transaction.description}
              </Text>
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
                {formatCurrency(transaction.amount).replace('-$', '$')}
              </Text>
              <Text style={styles.dateText}>
                {formatDate(transaction.date)}
              </Text>
            </View>
          </View>
        ))}
        
        {transactions.length === 0 && (
          <View style={styles.noTransactionsContainer}>
            <Text style={styles.noTransactionsText}>
              No transactions found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 24,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  amountDate: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
  },
  incomeAmount: {
    color: "#86CB8B",
  },
  expenseAmount: {
    color: "#E38989",
  },
  noTransactionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noTransactionsText: {
    color: '#666666',
    fontSize: 16,
  },
}); 