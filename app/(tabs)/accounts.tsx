import { StyleSheet, View, Pressable, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAccount } from "@/app/context/AccountContext";
import { StorageUtils } from "@/app/utils/storage";

export default function AccountsScreen() {
  const { accounts, selectedAccount, setSelectedAccount, refreshAccounts } = useAccount();

  const addAccount = async () => {
    const newAccount = {
      id: Date.now().toString(),
      name: `Account ${accounts.length + 1}`,
      balance: 0,
      type: 'other' as const
    };

    try {
      await StorageUtils.addAccount(newAccount);
      await refreshAccounts();
    } catch (error) {
      Alert.alert("Error", "Failed to create account");
    }
  };

  const deleteAccount = (accountId: string) => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account? This will also delete all associated transactions.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await StorageUtils.deleteAccount(accountId);
              await refreshAccounts();
            } catch (error) {
              Alert.alert("Error", "Failed to delete account");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView
        style={styles.headerContainer}
        darkColor="#121212"
        lightColor="#F5F5F5"
      >
        <ThemedText type="title" style={styles.headerTitle}>
          Accounts
        </ThemedText>
      </ThemedView>

      <View style={styles.content}>
        {accounts.map(account => (
          <Pressable
            key={account.id}
            onPress={() => setSelectedAccount(account)}
          >
            <ThemedView 
              style={[
                styles.accountCard,
                selectedAccount?.id === account.id && styles.selectedCard
              ]} 
              darkColor="#1E1E1E" 
              lightColor="#FFFFFF"
            >
              <View style={styles.accountRow}>
                <View>
                  <ThemedText type="subtitle">{account.name}</ThemedText>
                  <ThemedText>${account.balance.toFixed(2)}</ThemedText>
                </View>
                <View style={styles.rightContent}>
                  {selectedAccount?.id === account.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color="#86CB8B" />
                    </View>
                  )}
                  {account.type !== 'main' && (
                    <Pressable
                      onPress={() => deleteAccount(account.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </Pressable>
                  )}
                </View>
              </View>
            </ThemedView>
          </Pressable>
        ))}

        <Pressable 
          style={styles.addButton}
          onPress={addAccount}
        >
          <ThemedText style={styles.addButtonText}>+ Add Account</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  accountCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#86CB8B",
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedIndicator: {
    marginRight: 8,
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  addButtonText: {
    fontWeight: "600",
  },
  deleteButton: {
    padding: 8,
  },
});
