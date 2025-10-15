import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";
import { Ctx } from "./authContext";
import { fetchUserByEmail } from "../services/usersServices";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && u.email) {
        const user = await fetchUserByEmail(u.email);
        setAuthorId(user._id);
      } else {
        setAuthorId(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refresh = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      // onAuthStateChanged ya actualizará `user`/`authorId`
    }
  };

  const value = useMemo(
    () => ({ user, authorId, loading, login, logout, refresh }),
    [user, authorId, loading]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
