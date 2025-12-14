import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/auth/AuthProvider";

function Guard() {
  const { user, ready } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;

    const root = (segments[0] ?? "") as string;
    const inAuth = root === "auth";

    if (!user && !inAuth) {
      router.replace("/auth" as any);
    }

    if (user && inAuth) {
      router.replace("/(tabs)" as any);
    }
  }, [user, ready, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Guard />
    </AuthProvider>
  );
}
