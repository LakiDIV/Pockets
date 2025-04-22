import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Transaction } from "@/app/types/transaction";
import { TransactionCard } from "./TransactionCard";
import { forwardRef } from "react";

interface TransactionsBottomSheetProps {
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
  onClose: () => void;
  snapPoints: string[];
}

export const TransactionsBottomSheet = forwardRef<BottomSheet, TransactionsBottomSheetProps>(
  ({ transactions, formatCurrency, formatDate, onClose, snapPoints }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        index={-1}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>All Transactions</Text>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))}

          {transactions.length === 0 && (
            <View style={styles.noTransactionsContainer}>
              <Text style={styles.noTransactionsText}>
                No transactions found
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
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
  noTransactionsContainer: {
    padding: 20,
    alignItems: "center",
  },
  noTransactionsText: {
    color: "#666666",
    fontSize: 16,
  },
}); 