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

  /** Convenience: resolved initial auth state. */
  isReady: boolean;

  /** Convenience alias (same meaning as !isReady). */
  loading: boolean;

  /** Robust avatar url (some providers only populate providerData photoURL reliably). */
  userPhotoUrl: string | null;

  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  /** Force-refresh token / claims + reload user profile fields. */
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function pickBestPhotoUrl(u: User | null): string | null {
  if (!u) return null;

  const direct = u.photoURL ?? null;
  if (direct) return direct;

  const fromProvider =
    u.providerData?.find((p) => !!p.photoURL)?.photoURL ?? null;

  return fromProvider;
}

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

  const refreshUser = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) return;

    // Refresh token (claims / rules changes)
    await u.getIdToken(true);

    // Ensure profile fields (photoURL, displayName) are up-to-date
    await u.reload();

    setUser(auth.currentUser);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);

    // Immediately sync state + ensure photoURL is populated
    await refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const userPhotoUrl = useMemo(() => pickBestPhotoUrl(user), [user]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isReady,
      loading: !isReady,
      userPhotoUrl,
      signInWithGoogle,
      logout,
      refreshUser,
    }),
    [user, isReady, userPhotoUrl, signInWithGoogle, logout, refreshUser]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider />");
  return v;
}
