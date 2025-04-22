import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Account } from "@/app/types/account";

interface TransactionModalProps {
  visible: boolean;
  type: "Income" | "Expense";
  amount: string;
  description: string;
  selectedAccount: Account | null;
  onAmountChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function TransactionModal({
  visible,
  type,
  amount,
  description,
  selectedAccount,
  onAmountChange,
  onDescriptionChange,
  onCancel,
  onSave,
}: TransactionModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add {type}</Text>

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
            onChangeText={onAmountChange}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#666666"
            value={description}
            onChangeText={onDescriptionChange}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
}); 