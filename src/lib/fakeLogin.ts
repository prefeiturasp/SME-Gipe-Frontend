// lib/fakeLogin.ts
import { useUserStore } from "@/stores/useUserStore";
import { useQueryClient } from "@tanstack/react-query";

export const useFakeLogin = () => {
    const queryClient = useQueryClient();
    const setUser = useUserStore((state) => state.setUser);

    const fakeLogin = ({
        rfOuCpf,
        password,
    }: {
        rfOuCpf: string;
        password: string;
    }): boolean => {
        if (rfOuCpf === "123456" && password === "senha123") {
            const user = {
                name: "Guilherme Vilas Boas",
                role: "admin",
                cpf: "12629586871",
                email: "ollyverottoboni@gmail.com",
                login: "12629586871",
                situacaoUsuario: 1,
                situacaoGrupo: 1,
                visoes: ["UE", "DRE", "SME"],
                perfis_por_sistema: [
                    {
                        sistema: 903,
                        perfis: ["UE", "DRE", "SME"],
                    },
                ],
            };

            setUser(user);
            queryClient.setQueryData(["user"], user);
            return true;
        }

        return false;
    };

    return fakeLogin;
};
