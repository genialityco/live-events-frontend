import type { User } from "firebase/auth";
import { createContext } from "react";

type AuthCtx = {
  user: User | null;
  authorId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>; // ⬅️ nuevo
};

export const Ctx = createContext<AuthCtx | undefined>(undefined);
