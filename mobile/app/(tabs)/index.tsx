import React from "react";
import { View, Text, Pressable } from "react-native";
import { signOutGoogle } from "../../src/auth/google";

export default function TabsHome() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 8 }}>
        Logged in ✅
      </Text>
      <Text style={{ opacity: 0.7, marginBottom: 20 }}>
        Welcome to CDXplore Mobile.
      </Text>

      <Pressable
        onPress={signOutGoogle}
        style={{
          height: 50,
          borderRadius: 14,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
