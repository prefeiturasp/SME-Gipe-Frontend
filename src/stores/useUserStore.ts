import { create } from "zustand";
import { logoutAction } from "@/actions/logout";

export interface User {
    username: string;
    name: string;
    email: string;
    cpf: string;
    rede: string;
    is_core_sso: boolean;
    is_validado: boolean;
    is_app_admin: boolean;
    perfil_acesso: {
        codigo: number;
        nome: string;
    };
    unidades: {
        ue: {
            ue_uuid: string | null;
            codigo_eol: string | null;
            nome: string | null;
            sigla: string | null;
        };
        dre: {
            dre_uuid: string | null;
            codigo_eol: string | null;
            nome: string | null;
            sigla: string | null;
        };
    }[];
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => {
        set({ user });
    },
    clearUser: async () => {
        await logoutAction();
        set({ user: null });
    },
}));
