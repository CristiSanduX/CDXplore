import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const FIELD = "visited";

function visitedRef(uid: string) {
  return doc(db, "users", uid, "meta", "visited");
}

/**
 * Load visited countries once (initial load)
 */
export async function loadVisited(): Promise<Set<string>> {
  const u = auth.currentUser;
  if (!u) return new Set();

  const snap = await getDoc(visitedRef(u.uid));
  if (!snap.exists()) return new Set();

  const raw = snap.data()?.[FIELD];
  const arr = Array.isArray(raw) ? (raw as string[]) : [];
  return new Set(arr);
}

/**
 * Save visited countries (called on toggle)
 */
export async function saveVisited(next: Set<string>) {
  const u = auth.currentUser;
  if (!u) return;

  await setDoc(
    visitedRef(u.uid),
    {
      [FIELD]: Array.from(next),
      migratedFromLocal: true, // poți șterge când vrei
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Realtime subscription (sync web ↔ mobile)
 * Call this once and unsubscribe on unmount
 */
export function subscribeVisited(cb: (v: Set<string>) => void) {
  const u = auth.currentUser;
  if (!u) return () => {};

  return onSnapshot(visitedRef(u.uid), (snap) => {
    if (!snap.exists()) {
      cb(new Set());
      return;
    }

    const raw = snap.data()?.[FIELD];
    const arr = Array.isArray(raw) ? (raw as string[]) : [];
    cb(new Set(arr));
  });
}
