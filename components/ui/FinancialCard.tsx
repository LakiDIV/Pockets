import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { IconSymbolName } from "@/components/ui/IconSymbol";

type CardColorTone = "default" | "income" | "expense";

type FinancialCardProps = {
  title: string;
  description?: string;
  iconName: IconSymbolName;
  onPress?: () => void;
  hideDescription?: boolean;
  colorTone?: CardColorTone;
  // Layout type for flexibility
  layout?: "horizontal" | "vertical";
};

export function FinancialCard({
  title,
  description,
  iconName,
  onPress,
  hideDescription = false,
  colorTone = "default",
  layout = "horizontal",
}: FinancialCardProps) {
  // Function to get background colors based on color tone
  const getBackgroundColors = () => {
    switch (colorTone) {
      case "income":
        return {
          card: "#1C332C", // Dark green tint
          icon: "#29483F",
          iconColor: "#6EE7B7", // Light green for income
        };
      case "expense":
        return {
          card: "#331C1C", // Dark red tint
          icon: "#482929",
          iconColor: "#F87171", // Light red for expense
        };
      default:
        return {
          card: "#1C2433", // Default blue tint
          icon: "#29323F",
          iconColor: "#85AEFF", // Light blue
        };
    }
  };

  const colors = getBackgroundColors();

  // Render horizontal card (suitable for list items)
  if (layout === "horizontal") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.cardWrapper}
      >
        <ThemedView
          style={[styles.horizontalCard]}
          darkColor={colors.card}
          lightColor="#F5F5F5"
        >
          <ThemedView
            style={styles.horizontalIconContainer}
            darkColor={colors.icon}
            lightColor="#E8EDF5"
          >
            <IconSymbol name={iconName} size={22} color={colors.iconColor} />
          </ThemedView>

          <View style={styles.horizontalContentContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {title}
            </ThemedText>
            {!hideDescription && description && (
              <ThemedText type="default" style={styles.description}>
                {description}
              </ThemedText>
            )}
          </View>

          <IconSymbol name="chevron.right" size={16} color="#6A6A6A" />
        </ThemedView>
      </TouchableOpacity>
    );
  }

  // Render vertical card (suitable for grid items)
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.gridCardWrapper}
    >
      <ThemedView
        style={styles.verticalCard}
        darkColor={colors.card}
        lightColor="#F5F5F5"
      >
        <ThemedView
          style={styles.verticalIconContainer}
          darkColor={colors.icon}
          lightColor="#E8EDF5"
        >
          <IconSymbol name={iconName} size={22} color={colors.iconColor} />
        </ThemedView>

        <View style={styles.verticalContentContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
          {!hideDescription && description && (
            <ThemedText type="default" style={styles.description}>
              {description}
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal layout styles
  cardWrapper: {
    marginBottom: 12,
  },
  horizontalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  horizontalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  horizontalContentContainer: {
    flex: 1,
  },

  // Vertical layout styles
  gridCardWrapper: {
    height: 145,
  },
  verticalCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
  },
  verticalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  verticalContentContainer: {
    justifyContent: "flex-end",
  },

  // Common styles
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#9CA3AF",
  },
});
