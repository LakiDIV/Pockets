import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, layout } from "@/app/styles/shared";

interface ActionButtonsProps {
  onIncomePress: () => void;
  onExpensePress: () => void;
}

export function ActionButtons({
  onIncomePress,
  onExpensePress,
}: ActionButtonsProps) {
  const buttons = [
    {
      title: "Income",
      iconName: "arrow-up-circle-outline" as const,
      color: colors.income,
      onPress: onIncomePress,
    },
    {
      title: "Expenses",
      iconName: "arrow-down-circle-outline" as const,
      color: colors.expense,
      onPress: onExpensePress,
    },
  ];

  return (
    <View style={styles.actionContainerWrapper}>
      <View style={styles.actionContainer}>
        {buttons.map((item, index) => (
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
  );
}

const styles = StyleSheet.create({
  actionContainerWrapper: {
    paddingHorizontal: spacing.large,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.medium,
    borderRadius: layout.borderRadius.large,
    backgroundColor: colors.surface,
    maxWidth: 160,
    marginHorizontal: spacing.small / 2,
    ...layout.shadow.small,
  },
  actionText: {
    ...typography.body,
    marginTop: spacing.small,
    fontWeight: "600",
  },
});
