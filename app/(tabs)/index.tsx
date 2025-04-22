// HomeScreen Component
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { StorageUtils } from "@/app/utils/storage";
import { Transaction } from "@/app/types/transaction";
import { Account } from "@/app/types/account";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AccountHeader } from "@/components/AccountHeader";
import { TransactionCard } from "@/components/TransactionCard";
import { ActionButtons } from "@/components/ActionButtons";
import { TransactionModal } from "@/components/TransactionModal";
import { TransactionsBottomSheet } from "@/components/TransactionsBottomSheet";
import { colors, typography, spacing, layout } from "@/app/styles/shared";
import { useAccount } from "@/app/context/AccountContext";

export default function HomeScreen() {
  const { selectedAccount, refreshAccounts, getLatestAccountData } = useAccount();
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<"Income" | "Expense">("Income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTransactionsVisible, setIsTransactionsVisible] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  const loadData = useCallback(async () => {
    if (!selectedAccount) return;

    // Get fresh account data
    const freshAccount = await getLatestAccountData(selectedAccount.id);
    if (freshAccount) {
      setCurrentAccount(freshAccount);
    }

    const allTxs = await StorageUtils.getTransactions();
    const accountTxs = allTxs.filter(tx => tx.accountId === selectedAccount.id);
    const recentTxs = accountTxs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    setRecentTransactions(recentTxs);
    setAllTransactions(accountTxs);
  }, [selectedAccount, getLatestAccountData]);

  // Update current account when selected account changes
  useEffect(() => {
    if (selectedAccount) {
      setCurrentAccount(selectedAccount);
    }
  }, [selectedAccount]);

  // Refresh data periodically
  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 2000);
    return () => clearInterval(intervalId);
  }, [loadData]);

  const handleAddTransaction = async () => {
    if (!amount || !description || !selectedAccount) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: numericAmount,
      description,
      date: selectedDate.toISOString(),
      accountId: selectedAccount.id,
    };

    try {
      await StorageUtils.saveTransaction(newTransaction);
      await loadData();
      await refreshAccounts();
      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction");
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setTransactionType("Income");
    setSelectedDate(new Date());
  };

  const formatCurrency = useCallback((value: number) => {
    const prefix = value < 0 ? "-$" : "$";
    return `${prefix}${Math.abs(value).toFixed(2)}`;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  const viewAllTransactions = useCallback(() => {
    setIsTransactionsVisible(true);
    bottomSheetRef.current?.expand();
  }, []);

  const handleSheetClose = useCallback(() => {
    setIsTransactionsVisible(false);
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  if (!currentAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
          <Text style={styles.noAccountText}>Please select an account</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
          <AccountHeader
            account={currentAccount}
            balance={currentAccount.balance}
            formatCurrency={formatCurrency}
          />

          <View style={styles.transactionHistoryContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={viewAllTransactions}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <View style={styles.noTransactionsContainer}>
                <Text style={styles.noTransactionsText}>
                  No recent transactions
                </Text>
              </View>
            )}
          </View>
        </View>

        <ActionButtons
          onIncomePress={() => {
            setTransactionType("Income");
            setIsModalVisible(true);
          }}
          onExpensePress={() => {
            setTransactionType("Expense");
            setIsModalVisible(true);
          }}
        />

        <TransactionModal
          visible={isModalVisible}
          type={transactionType}
          amount={amount}
          description={description}
          selectedAccount={currentAccount}
          selectedDate={selectedDate}
          onAmountChange={setAmount}
          onDescriptionChange={setDescription}
          onDateChange={setSelectedDate}
          onCancel={() => {
            setIsModalVisible(false);
            resetForm();
          }}
          onSave={handleAddTransaction}
        />

        <TransactionsBottomSheet
          ref={bottomSheetRef}
          transactions={allTransactions}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          onClose={handleSheetClose}
          snapPoints={snapPoints}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    padding: spacing.large,
  },
  noAccountText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  transactionHistoryContainer: {
    marginTop: spacing.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  noTransactionsContainer: {
    padding: spacing.medium,
    alignItems: 'center',
  },
  noTransactionsText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  viewAllButton: {
    fontSize: 14,
    color: colors.income,
  },
});
