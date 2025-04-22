import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#121212",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "center",
  },
  accountDisplay: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  accountLabel: {
    fontSize: 13,
    color: "#999999",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  accountValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
}); 