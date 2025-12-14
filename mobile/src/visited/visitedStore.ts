import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const FIELD = "visited";

function ref(uid: string) {
  return doc(db, "users", uid, "meta", "visited");
}

export async function loadVisited(): Promise<Set<string>> {
  const u = auth.currentUser;
  if (!u) return new Set();

  const snap = await getDoc(ref(u.uid));
  if (!snap.exists()) return new Set();

  const raw = snap.data()?.[FIELD];
  const arr = Array.isArray(raw) ? (raw as string[]) : [];
  return new Set(arr);
}

export async function saveVisited(next: Set<string>) {
  const u = auth.currentUser;
  if (!u) return;

  await setDoc(
    ref(u.uid),
    {
      [FIELD]: Array.from(next),
      migratedFromLocal: true, 
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
