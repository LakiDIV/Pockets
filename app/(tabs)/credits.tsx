import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { colors, typography, spacing, layout } from "@/app/styles/shared";

// Updated transaction type
type Transaction = {
  id: number;
  date: string;
  dueDate: string;
  amount: number;
  description: string;
};

type Contact = {
  payee: string;
  transactions: Transaction[];
};

// Dummy data for receivables with mixed dates (past, present, and future)
const dummyReceivables: Contact[] = [
  {
    payee: "John Doe",
    transactions: [
      { id: 1, date: "2024-03-15", dueDate: "2024-03-20", amount: 500, description: "Consulting Fee" },
      { id: 2, date: "2024-03-20", dueDate: "2026-04-01", amount: 300, description: "Project Payment" },
    ]
  },
  {
    payee: "Alice Smith",
    transactions: [
      { id: 3, date: "2024-03-10", dueDate: "2026-06-15", amount: 1000, description: "Service Payment" },
      { id: 4, date: "2024-03-25", dueDate: "2026-07-25", amount: 750, description: "Monthly Rent" },
    ]
  },
  {
    payee: "Tech Corp",
    transactions: [
      { id: 5, date: "2024-03-05", dueDate: "2024-03-10", amount: 2500, description: "Contract Payment" },
      { id: 6, date: "2024-03-18", dueDate: "2026-04-18", amount: 1500, description: "Equipment Cost" },
    ]
  },
  {
    payee: "Future Projects Ltd",
    transactions: [
      { id: 11, date: "2026-01-01", dueDate: "2026-02-01", amount: 3000, description: "Future Project A" },
      { id: 12, date: "2026-02-01", dueDate: "2026-03-01", amount: 4500, description: "Future Project B" },
    ]
  }
];

// Dummy data for liabilities with mixed dates
const dummyLiabilities: Contact[] = [
  {
    payee: "Office Space Co",
    transactions: [
      { id: 7, date: "2024-03-30", dueDate: "2024-04-05", amount: 2000, description: "Office Rent" },
      { id: 8, date: "2026-04-30", dueDate: "2026-05-05", amount: 2000, description: "Future Office Lease" },
    ]
  },
  {
    payee: "Equipment Supplier",
    transactions: [
      { id: 9, date: "2024-03-25", dueDate: "2026-08-30", amount: 1200, description: "Hardware Purchase" },
      { id: 10, date: "2024-04-01", dueDate: "2026-09-15", amount: 800, description: "Software License" },
    ]
  },
  {
    payee: "Future Services Inc",
    transactions: [
      { id: 13, date: "2026-05-01", dueDate: "2026-06-01", amount: 5000, description: "Future Service A" },
      { id: 14, date: "2026-06-01", dueDate: "2026-07-01", amount: 3500, description: "Future Service B" },
    ]
  }
];

type TabType = 'receivables' | 'liabilities';

export default function CreditsScreen() {
  const [expandedPayee, setExpandedPayee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('receivables');
  const horizontalScrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');

  const toggleExpand = (payee: string) => {
    setExpandedPayee(expandedPayee === payee ? null : payee);
  };

  const getTotalAmount = (transactions: Transaction[]) => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const hasOverdueTransactions = (transactions: Transaction[]) => {
    return transactions.some(transaction => isOverdue(transaction.dueDate));
  };

  const sortTransactions = (transactions: Transaction[]) => {
    return [...transactions].sort((a, b) => {
      // First sort by overdue status
      const aOverdue = isOverdue(a.dueDate);
      const bOverdue = isOverdue(b.dueDate);
      if (aOverdue !== bOverdue) return bOverdue ? 1 : -1;
      
      // Then sort by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const sortContacts = (contacts: Contact[]) => {
    return [...contacts].sort((a, b) => {
      // First sort by whether any transaction is overdue
      const aHasOverdue = hasOverdueTransactions(a.transactions);
      const bHasOverdue = hasOverdueTransactions(b.transactions);
      if (aHasOverdue !== bHasOverdue) return bHasOverdue ? 1 : -1;
      
      // Then sort by earliest due date
      const aEarliestDue = Math.min(...a.transactions.map(t => new Date(t.dueDate).getTime()));
      const bEarliestDue = Math.min(...b.transactions.map(t => new Date(t.dueDate).getTime()));
      return aEarliestDue - bEarliestDue;
    });
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    horizontalScrollRef.current?.scrollTo({
      x: tab === 'receivables' ? 0 : screenWidth,
      animated: true
    });
  };

  const handleHorizontalScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newTab = contentOffsetX <= screenWidth / 2 ? 'receivables' : 'liabilities';
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const interpolatedColors = useMemo(() => ({
    receivablesColor: scrollX.interpolate({
      inputRange: [0, screenWidth],
      outputRange: [colors.income, colors.expense],
      extrapolate: 'clamp',
    }),
    receivablesBackground: scrollX.interpolate({
      inputRange: [0, screenWidth],
      outputRange: [colors.income + '20', colors.expense + '20'],
      extrapolate: 'clamp',
    }),
    tabIndicator: scrollX.interpolate({
      inputRange: [0, screenWidth],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  }), [scrollX, screenWidth]);

  const renderTransactionList = (items: Contact[], isReceivables: boolean) => {
    const sortedContacts = sortContacts(items);
    
    return sortedContacts.map((item) => {
      const sortedTransactions = sortTransactions(item.transactions);
      const hasOverdue = hasOverdueTransactions(item.transactions);

      return (
        <ThemedView
          key={item.payee}
          style={[
            styles.payeeContainer,
            hasOverdue && styles.overdueContainer
          ]}
          darkColor={colors.surface}
          lightColor="#F5F5F5"
        >
          <View
            style={[
              styles.payeeHeader,
              expandedPayee === item.payee && styles.expandedHeader
            ]}
            onTouchEnd={() => toggleExpand(item.payee)}
          >
            <View style={styles.payeeInfo}>
              <Animated.View style={[
                styles.iconContainer,
                { backgroundColor: isReceivables ? interpolatedColors.receivablesBackground : colors.expense + '20' }
              ]}>
                <Ionicons
                  name={isReceivables ? "person-outline" : "business-outline"}
                  size={24}
                  color={isReceivables ? colors.income : colors.expense}
                />
              </Animated.View>
              <View style={styles.textContainer}>
                <View style={styles.payeeNameContainer}>
                  <ThemedText type="defaultSemiBold" style={styles.payeeName}>
                    {item.payee}
                  </ThemedText>
                  {hasOverdue && (
                    <View style={styles.overdueBadge}>
                      <ThemedText type="default" style={styles.overdueBadgeText}>
                        Overdue
                      </ThemedText>
                    </View>
                  )}
                </View>
                <Animated.Text style={[
                  styles.totalAmount,
                  { color: isReceivables ? colors.income : colors.expense }
                ]}>
                  {isReceivables ? '+' : '-'}${getTotalAmount(item.transactions).toFixed(2)}
                </Animated.Text>
              </View>
            </View>
            <Ionicons
              name={expandedPayee === item.payee ? "chevron-up" : "chevron-down"}
              size={24}
              color={colors.text}
            />
          </View>
          
          {expandedPayee === item.payee && (
            <View style={styles.transactionsContainer}>
              {sortedTransactions.map((transaction) => {
                const transactionOverdue = isOverdue(transaction.dueDate);
                return (
                  <View 
                    key={transaction.id} 
                    style={[
                      styles.transaction,
                      transactionOverdue && styles.overdueTransaction
                    ]}
                  >
                    <View style={styles.transactionDetails}>
                      <View style={styles.transactionDateContainer}>
                        <ThemedText type="default" style={styles.transactionDate}>
                          {transaction.date}
                        </ThemedText>
                        <ThemedText 
                          type="default" 
                          style={[
                            styles.dueDate,
                            transactionOverdue && styles.overdueDueDate
                          ]}
                        >
                          Due: {transaction.dueDate}
                        </ThemedText>
                      </View>
                      <ThemedText type="defaultSemiBold" style={styles.transactionDescription}>
                        {transaction.description}
                      </ThemedText>
                    </View>
                    <Animated.Text style={[
                      styles.transactionAmount,
                      { color: isReceivables ? colors.income : colors.expense }
                    ]}>
                      {isReceivables ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </Animated.Text>
                  </View>
                );
              })}
            </View>
          )}
        </ThemedView>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Credits",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'receivables' && styles.activeTabButton
          ]}
          onPress={() => handleTabPress('receivables')}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.tabText,
              activeTab === 'receivables' && styles.activeTabText
            ]}
          >
            Receivables
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'liabilities' && styles.activeTabButton
          ]}
          onPress={() => handleTabPress('liabilities')}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.tabText,
              activeTab === 'liabilities' && styles.activeTabText
            ]}
          >
            Liabilities
          </ThemedText>
        </Pressable>
        <Animated.View style={[
          styles.tabIndicator,
          {
            transform: [{
              translateX: interpolatedColors.tabIndicator.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenWidth / 2]
              })
            }]
          }
        ]} />
      </View>

      <Animated.ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleHorizontalScroll}
        scrollEventThrottle={16}
        style={styles.horizontalScroll}
        decelerationRate="fast"
      >
        <View style={[styles.tabPage, { width: screenWidth }]}>
          <ScrollView style={styles.scrollView}>
            {renderTransactionList(dummyReceivables, true)}
          </ScrollView>
        </View>
        <View style={[styles.tabPage, { width: screenWidth }]}>
          <ScrollView style={styles.scrollView}>
            {renderTransactionList(dummyLiabilities, false)}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.small,
    alignItems: 'center',
    marginHorizontal: spacing.small,
    borderRadius: layout.borderRadius.medium,
    zIndex: 1,
  },
  activeTabButton: {
    backgroundColor: 'transparent',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: spacing.small,
    left: spacing.medium,
    width: '45%',
    height: 36,
    backgroundColor: colors.surfaceLight,
    borderRadius: layout.borderRadius.medium,
    zIndex: 0,
  },
  tabText: {
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.text,
  },
  horizontalScroll: {
    flex: 1,
  },
  tabPage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: spacing.medium,
  },
  payeeContainer: {
    marginBottom: spacing.medium,
    borderRadius: layout.borderRadius.large,
    overflow: 'hidden',
  },
  payeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
  },
  expandedHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  payeeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.medium,
  },
  textContainer: {
    flex: 1,
  },
  payeeName: {
    fontSize: typography.title.fontSize,
    color: typography.title.color,
    fontWeight: '600',
    marginBottom: spacing.small,
  },
  totalAmount: {
    ...typography.body,
  },
  transactionsContainer: {
    paddingHorizontal: spacing.medium,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  transactionDescription: {
    ...typography.body,
  },
  transactionAmount: {
    ...typography.body,
    marginLeft: spacing.medium,
  },
  overdueContainer: {
    // Removed borderLeftWidth and borderLeftColor
  },
  payeeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  overdueBadge: {
    backgroundColor: colors.expense + '20',
    paddingHorizontal: spacing.small,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.small,
  },
  overdueBadgeText: {
    color: colors.expense,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medium,
  },
  dueDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  overdueDueDate: {
    color: colors.expense,
    fontWeight: '600',
  },
  overdueTransaction: {
    backgroundColor: colors.expense + '08',
  },
}); 