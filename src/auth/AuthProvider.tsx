import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

type AuthCtx = {
  user: User | null;

  /** True after we resolved the initial auth state (signed in or not). */
  isReady: boolean;

  /** Convenience alias (same meaning as !isReady). */
  loading: boolean;

  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  /** Useful if later you want to force-refresh token / claims. */
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsReady(true);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Optional: enforce account picker (you already setCustomParameters in firebase.ts; safe either way)
    // googleProvider.setCustomParameters({ prompt: "select_account" });

    await signInWithPopup(auth, googleProvider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const refreshUser = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) return;
    // Force refresh token (later useful for Firestore rules/claims changes)
    await u.getIdToken(true);
    // Keep state in sync (optional but safe)
    setUser(auth.currentUser);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isReady,
      loading: !isReady,
      signInWithGoogle,
      logout,
      refreshUser,
    }),
    [user, isReady, signInWithGoogle, logout, refreshUser]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider />");
  return v;
}
