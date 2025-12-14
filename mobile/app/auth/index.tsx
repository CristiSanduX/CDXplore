import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { signInWithGoogle } from "../../src/auth/google";

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);

  const onGooglePress = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // redirect-ul se face automat de Guard (app/_layout.tsx)
    } catch (err) {
      console.log("Google sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* TITLU */}
      <Text
        style={{
          fontSize: 36,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        CDXplore
      </Text>

      {/* SUBTITLE */}
      <Text
        style={{
          fontSize: 16,
          opacity: 0.7,
          marginBottom: 28,
        }}
      >
        Sign in to sync your visited countries
      </Text>

      {/* GOOGLE BUTTON */}
      <Pressable
        onPress={onGooglePress}
        disabled={loading}
        style={{
          height: 54,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          alignItems: "center",
          justifyContent: "center",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Continue with Google
          </Text>
        )}
      </Pressable>
    </View>
  );
}
