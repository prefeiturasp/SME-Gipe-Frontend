import { create } from "zustand";
import { logoutAction } from "@/actions/logout";

export interface User {
    nome: string;
    identificador: string | number;
    perfil_acesso: {
        nome: string;
        codigo: number;
    };
    unidade: [
        {
            nomeUnidade: string;
            codigo: string;
        }
    ];
    email: string;
    cpf: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => {
        set({ user });
    },
    clearUser: () => {
        logoutAction();
        set({ user: null });
    },
}));
