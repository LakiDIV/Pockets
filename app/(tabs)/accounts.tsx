import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FinancialCard } from "@/components/ui/FinancialCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";

export default function AccountsScreen() {
  const accountItems = useMemo(
    () => [
      {
        title: "Wallets",
        description: "Manage your wallets",
        iconName: "creditcard.fill",
        colorTone: "default",
        onPress: () => console.log("Wallets pressed"),
      },
      {
        title: "Assets",
        description: "View investments",
        iconName: "chart.bar.fill",
        colorTone: "default",
        onPress: () => console.log("Assets pressed"),
      },
      {
        title: "Liabilities",
        description: "Track debts",
        iconName: "arrow.down.circle.fill",
        colorTone: "default",
        onPress: () => console.log("Liabilities pressed"),
      },
      {
        title: "Receivables",
        description: "Money owed to you",
        iconName: "arrow.up.circle.fill",
        colorTone: "default",
        onPress: () => console.log("Receivables pressed"),
      },
    ],
    []
  );

  // Create pairs of items for the grid
  const rows = [];
  for (let i = 0; i < accountItems.length; i += 2) {
    if (i + 1 < accountItems.length) {
      rows.push([accountItems[i], accountItems[i + 1]]);
    } else {
      rows.push([accountItems[i]]);
    }
  }

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {rows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.gridRow}>
              {row.map((item, colIndex) => (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={styles.gridCell}
                >
                  <FinancialCard
                    title={item.title}
                    description={item.description}
                    iconName={item.iconName}
                    colorTone={item.colorTone}
                    onPress={item.onPress}
                    layout="vertical"
                  />
                </View>
              ))}
              {row.length === 1 && <View style={styles.gridCell} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const padding = 16;
const gap = 12;
const cardWidth = (width - padding * 2 - gap) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: padding,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  gridContainer: {
    paddingHorizontal: padding,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridCell: {
    width: cardWidth,
  },
});
