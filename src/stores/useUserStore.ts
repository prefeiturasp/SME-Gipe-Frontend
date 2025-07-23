import { create } from "zustand";
import {
    setEncryptedCookie,
    getDecryptedCookie,
    removeCookie,
} from "@/lib/cookieUtils";

const COOKIE_KEY = "user_data";

interface User {
    nome: string;
    identificador: string | number;
    perfil_acesso: string;
    unidade: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const getInitialUser = (): User | null => {
    return getDecryptedCookie<User>(COOKIE_KEY);
};

export const useUserStore = create<UserState>((set) => ({
    user: getInitialUser(),
    setUser: (user) => {
        setEncryptedCookie(COOKIE_KEY, user, 1);
        set({ user });
    },
    clearUser: () => {
        removeCookie(COOKIE_KEY);
        set({ user: null });
    },
}));
