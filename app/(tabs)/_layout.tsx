import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopWidth: 1,
          borderTopColor: "#2C2C2C",
          height: 80,
          paddingVertical: 10,
          // Not using position: absolute to avoid overlaying navigation area
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#666666",
        tabBarShowLabel: false, // Hide the label text
        tabBarItemStyle: {
          paddingBottom: Platform.OS === "ios" ? 20 : 10, // Add padding to push content up
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
