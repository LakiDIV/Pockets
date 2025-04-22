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

export default function HomeScreen() {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<"Income" | "Expense">(
    "Income"
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTransactionsVisible, setIsTransactionsVisible] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  const loadData = useCallback(async () => {
    const balanceData = await StorageUtils.getBalance();
    const recentTxs = await StorageUtils.getRecentTransactions(3);
    const allTxs = await StorageUtils.getTransactions();
    const accounts = await StorageUtils.getAccounts();

    setBalance(balanceData.total);
    setRecentTransactions(recentTxs);
    setAllTransactions(
      allTxs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
    setSelectedAccount(accounts[0]);
  }, []);

  useEffect(() => {
    loadData();
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
          <AccountHeader
            account={selectedAccount}
            balance={balance}
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
          selectedAccount={selectedAccount}
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
  balanceContainer: {
    alignItems: "flex-start", // Left aligned
    marginTop: 40,
    marginBottom: 50,
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
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
    padding: 16,
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
  actionContainerWrapper: {
    paddingHorizontal: 24,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1E1E1E", // Added background to look more like a button
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 12,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    color: "#FFFFFF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#3A3A3A",
  },
  saveButton: {
    backgroundColor: "#86CB8B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  negativeBalance: {
    color: "#E38989",
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
  transactionItemSpacing: {
    marginBottom: 12, // Add spacing between transaction cards
  },
  accountDisplay: {
    width: "100%",
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  accountLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  bottomSheetBackground: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: "#666666",
    width: 40,
    height: 4,
    marginTop: 8,
  },
  bottomSheetHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
});
