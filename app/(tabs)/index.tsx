// HomeScreen Component
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StorageUtils } from "@/app/utils/storage";
import { Transaction } from "@/app/types/transaction";
import { Account } from '@/app/types/account';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'Income' | 'Expense'>('Income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const loadData = useCallback(async () => {
    const balanceData = await StorageUtils.getBalance();
    const transactions = await StorageUtils.getRecentTransactions(3);
    const accounts = await StorageUtils.getAccounts();
    setBalance(balanceData.total);
    setRecentTransactions(transactions);
    setSelectedAccount(accounts[0]);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTransaction = async () => {
    if (!amount || !description || !selectedAccount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: numericAmount,
      description,
      date: new Date().toISOString(),
      accountId: selectedAccount.id,
    };

    try {
      await StorageUtils.saveTransaction(newTransaction);
      await loadData();
      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setTransactionType('Income');
  };

  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-$' : '$';
    return `${prefix}${Math.abs(value).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const viewAllTransactions = () => {
    router.push('/transactions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        {/* Account Info Section */}
        <View style={styles.accountInfoContainer}>
          <Text style={styles.accountName}>{selectedAccount?.name}</Text>
          <Text style={[
            styles.balanceAmount,
            balance < 0 && styles.negativeBalance
          ]}>
            {formatCurrency(balance)}
          </Text>
          <Text style={styles.balanceLabel}>Total Balance</Text>
        </View>

        {/* Transaction Preview */}
        <View style={styles.transactionHistoryContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={viewAllTransactions}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={[styles.transactionItem, styles.transactionItemSpacing]}>
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

      {/* Action Buttons */}
      <View style={styles.actionContainerWrapper}>
        <View style={styles.actionContainer}>
          {[
            {
              title: "Income",
              iconName: "arrow-up-circle-outline",
              color: "#86CB8B",
              onPress: () => {
                setTransactionType('Income');
                setIsModalVisible(true);
              },
            },
            {
              title: "Expenses",
              iconName: "arrow-down-circle-outline",
              color: "#E38989",
              onPress: () => {
                setTransactionType('Expense');
                setIsModalVisible(true);
              },
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={`item-${index}`}
              style={styles.actionButton}
              onPress={item.onPress}
            >
              <Ionicons name={item.iconName} size={32} color={item.color} />
              <Text style={styles.actionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add {transactionType}
            </Text>
            
            <View style={styles.accountDisplay}>
              <Text style={styles.accountLabel}>Account</Text>
              <Text style={styles.accountValue}>{selectedAccount?.name}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount"
              placeholderTextColor="#666666"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#666666"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTransaction}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  mainContent: {
    flex: 1,
    padding: 24,
  },
  accountInfoContainer: {
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 40,
  },
  accountName: {
    fontSize: 20,
    color: '#AAAAAA',
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
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    paddingBottom: 28, // Increased from 40 to 100 to move buttons lower
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, // Added margin to avoid overlapping with navbar
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1E1E1E", // Added background to look more like a button
    minWidth: 140,
    // Added shadow for button-like appearance
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#3A3A3A',
  },
  saveButton: {
    backgroundColor: '#86CB8B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  negativeBalance: {
    color: '#E38989',
  },
  noTransactionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noTransactionsText: {
    color: '#666666',
    fontSize: 16,
  },
  viewAllButton: {
    fontSize: 16,
    color: '#86CB8B',
    fontWeight: '600',
  },
  transactionItemSpacing: {
    marginBottom: 12, // Add spacing between transaction cards
  },
  accountDisplay: {
    width: '100%',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  accountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
